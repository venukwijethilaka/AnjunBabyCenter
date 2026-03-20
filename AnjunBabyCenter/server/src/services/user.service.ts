import prisma from "../../prisma";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // ✅ Required for HMAC
import { getOtpEmailHTML } from "../utils/emailTemplates";

// --- CONFIG ---
if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET || !process.env.OTP_HASH_SECRET) {
    throw new Error("FATAL: Cryptographic secrets (JWT_SECRET, REFRESH_SECRET, OTP_HASH_SECRET) are missing.");
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;
const OTP_HASH_SECRET = process.env.OTP_HASH_SECRET as string;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// --- STATELESS OTP UTILITIES ---

/**
 * Creates a cryptographic hash of the OTP data.
 */
export const generateOtpHash = (email: string, otp: string, expiry: number) => {
    const data = `${email}|${otp}|${expiry}`;
    return crypto.createHmac("sha256", OTP_HASH_SECRET).update(data).digest("hex");
};

/**
 * Verifies the hash using a timing-safe comparison to prevent side-channel attacks.
 */
export const verifyOtpHash = (email: string, otp: string, expiry: number, hash: string) => {
    // 1. Check if expired
    if (Date.now() > expiry) return false;

    // 2. Re-calculate hash
    const computedHash = generateOtpHash(email, otp, expiry);

    // 3. Timing-safe comparison
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
};

// --- EMAIL & TOKEN HELPERS ---

export const sendEmail = async (to: string, subject: string, html: string) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ EMAIL NOT CONFIGURED. OTP not sent.");
        return;
    }
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

export const generateTokens = async (userId: number, refreshExpiry: string = "1d") => {
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: refreshExpiry as any });

    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken }
    });

    return { accessToken, refreshToken };
};

// --- AUTH SERVICES ---

export const findOrCreateGoogleUser = async (email: string, googleId: string, name: string) => {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: { email, googleId, name, password: "", loyaltyPoints: 0, isActive: true, role: "CUSTOMER" }
        });
    } else if (!user.googleId) {
        user = await prisma.user.update({ where: { email }, data: { googleId } });
    }

    if (!user.isActive) {
        if (user.banExpiresAt && new Date() > user.banExpiresAt) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { isActive: true, banReason: null, banExpiresAt: null }
            });
        } else if (user.banExpiresAt) {
            const error: any = new Error("Account is banned");
            error.isBanned = true;
            error.banReason = user.banReason;
            error.banExpiresAt = user.banExpiresAt;
            throw error;
        }
    }

    const tokens = await generateTokens(user.id, "7d");
    return { user, ...tokens };
};

export const registerUser = async (name: string, email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Stateless OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;
    const hash = generateOtpHash(email, otp, expiry);

    if (existingUser) {
        if (existingUser.isActive) throw new Error("User already exists");
        await prisma.user.update({
            where: { email },
            data: { name, password: hashedPassword }
        });
    } else {
        await prisma.user.create({
            data: { name, email, password: hashedPassword, loyaltyPoints: 0, role: "CUSTOMER", isActive: false }
        });
    }

    await sendEmail(email, "Anjun Baby Center: Verification Code", getOtpEmailHTML(otp, false));
    return { hash, expiry };
};

export const resendOtp = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (user.isActive) throw new Error("User is already verified.");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;
    const hash = generateOtpHash(email, otp, expiry);

    await sendEmail(email, "Anjun Baby Center: Verification Code", getOtpEmailHTML(otp, false));
    return { hash, expiry };
};

export const loginUser = async (email: string, password: string, rememberMe: boolean = false) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    if (!user.isActive) {
        if (user.banExpiresAt) {
            if (new Date() > user.banExpiresAt) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { isActive: true, banReason: null, banExpiresAt: null }
                });
            } else {
                const error: any = new Error("Account is banned");
                error.isBanned = true;
                error.banReason = user.banReason;
                error.banExpiresAt = user.banExpiresAt;
                throw error;
            }
        } else {
            throw new Error("Account not verified. Please verify your email.");
        }
    }

    if (!user.password) throw new Error("This account uses Google Sign-In.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const tokenLife = rememberMe ? "7d" : "1d";
    const tokens = await generateTokens(user.id, tokenLife);
    return { user, ...tokens };
};

export const verifyOtp = async (email: string, otp: string, hash: string, expiry: number) => {
    const isValid = verifyOtpHash(email, otp, expiry, hash);
    if (!isValid) throw new Error("Invalid or expired OTP");

    // 1. Update the user status
    const updatedUser = await prisma.user.update({
        where: { email },
        data: { isActive: true }
    });

    // 2. Generate tokens
    const tokens = await generateTokens(updatedUser.id, "7d");

    // 3. ✅ RETURN EVERYTHING (Tokens + User)
    return { user: updatedUser, ...tokens };
};

export const refreshAccessToken = async (token: string) => {
    if (!token) throw new Error("Refresh token required");
    let decoded: any;
    try {
        decoded = jwt.verify(token, REFRESH_SECRET);
    } catch (err) { throw new Error("Invalid refresh token"); }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== token) throw new Error("Invalid refresh token");

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
    return { accessToken };
};

// --- PROFILE SERVICES ---

export const getUserProfile = async (userId: number) => {
    return await prisma.user.findUnique({ where: { id: userId } });
};

export const updateUserProfile = async (userId: number, data: any) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            name: data.firstName + " " + data.lastName,
            phone: data.phone,
            street: data.street,
            country: data.country,
            city: data.city,
            postalCode: data.postalCode,
            avatar: data.avatar
        }
    });
};

// --- PASSWORD RECOVERY (STATELESS) ---

export const forgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (!user.password) throw new Error("This account uses Google Sign-In.");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;
    const hash = generateOtpHash(email, otp, expiry);

    await sendEmail(email, "Anjun Baby Center: Reset Password", getOtpEmailHTML(otp, true));
    return { hash, expiry };
};

export const resetPassword = async (email: string, otp: string, hash: string, expiry: number, newPassword: string) => {
    const isValid = verifyOtpHash(email, otp, expiry, hash);
    if (!isValid) throw new Error("Invalid or expired code");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });
    return true;
};

export const changePassword = async (userId: number, currentPassword: string, newPassword: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    if (!user.password) throw new Error("Google account detected.");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Incorrect current password");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
    return true;
};

// --- ADMIN & LOYALTY SERVICES ---

export const getAllUsers = async (page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            include: { orders: { include: { items: true }, orderBy: { createdAt: 'desc' } } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count()
    ]);

    return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const updateUserStatus = async (userId: number, isActive: boolean, banReason?: string, banDurationDays?: number) => {
    let banExpiresAt = null;
    if (!isActive && banDurationDays) {
        const date = new Date();
        date.setDate(date.getDate() + banDurationDays);
        banExpiresAt = date;
    }
    return await prisma.user.update({
        where: { id: userId },
        data: { isActive, banReason: isActive ? null : banReason, banExpiresAt: isActive ? null : banExpiresAt }
    });
};

export const updateUserRole = async (userId: number, role: "ADMIN" | "CUSTOMER" | "SUPER_ADMIN") => {
    return await prisma.user.update({ where: { id: userId }, data: { role: role as any } });
};

export const getAllLoyaltyLevels = async () => {
    return await prisma.loyaltyLevel.findMany({ orderBy: { minPoints: 'asc' } });
};

export const createLoyaltyLevel = async (data: any) => {
    return await prisma.loyaltyLevel.create({
        data: {
            name: data.name,
            minPoints: Number(data.minPoints),
            discount: Number(data.discount || 0),
            color: data.color,
            badgeColor: data.badgeColor || "bg-gray-100"
        }
    });
};

export const updateLoyaltyLevel = async (id: number, data: any) => {
    return await prisma.loyaltyLevel.update({
        where: { id },
        data: {
            name: data.name,
            minPoints: data.minPoints !== undefined ? Number(data.minPoints) : undefined,
            discount: data.discount !== undefined ? Number(data.discount) : undefined,
            color: data.color,
            badgeColor: data.badgeColor
        }
    });
};

export const deleteLoyaltyLevel = async (id: number) => {
    return await prisma.loyaltyLevel.delete({ where: { id } });
};