import prisma from "../../prisma";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 

// --- CONFIG ---
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Utility to send emails (OTPs, Reset links, etc.)
 */
export const sendEmail = async (to: string, subject: string, text: string) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ EMAIL NOT CONFIGURED. OTP not sent.");
        return;
    }
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

/**
 * Helper to generate Access and Refresh tokens
 */
export const generateTokens = async (userId: number, refreshExpiry: string = "1d") => {
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: refreshExpiry });

    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken }
    });

    return { accessToken, refreshToken };
};

// --- AUTH SERVICES ---

/**
 * Handles Google Login: Creates user if not exists or links account
 */
export const findOrCreateGoogleUser = async (email: string, googleId: string, name: string) => {
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
        user = await prisma.user.create({
            data: { email, googleId, name, password: "", loyaltyPoints: 0, isActive: true, role: "CUSTOMER" }
        });
    } else if (!user.googleId) {
        user = await prisma.user.update({ where: { email }, data: { googleId } });
    }
    
    // Check ban status for Google Users
    if (!user.isActive) {
        if (user.banExpiresAt && new Date() > user.banExpiresAt) {
            // ✅ AUTO-UNBAN
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

/**
 * Traditional Email/Password Registration
 */
export const registerUser = async (name: string, email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); 

    if (existingUser) {
        if (existingUser.isActive) {
            throw new Error("User already exists");
        } 
        await prisma.user.update({
            where: { email },
            data: { name, password: hashedPassword, otp, otpExpires: expires }
        });
    } else {
        await prisma.user.create({
            data: { 
                name, email, password: hashedPassword, otp, otpExpires: expires, 
                loyaltyPoints: 0, role: "CUSTOMER", isActive: false 
            }
        });
    }

    console.log(`(Dev Log) OTP for ${email}: ${otp}`); 
    await sendEmail(email, "Anjun Baby Center", `Your OTP code is: ${otp}`);
    return otp; 
};

export const resendOtp = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (user.isActive) throw new Error("User is already verified.");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
        where: { email },
        data: { otp, otpExpires: expires }
    });

    await sendEmail(email, "New Verification Code", `Your new OTP code is: ${otp}`);
    return true;
};

/**
 * Main Login Logic with Automatic Unbanning
 */
export const loginUser = async (email: string, password: string, rememberMe: boolean = false) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    
    // Ban Logic
    if (!user.isActive) {
        if (user.banExpiresAt) {
             if (new Date() > user.banExpiresAt) {
                 // ✅ AUTO-UNBAN: Time has passed
                 await prisma.user.update({
                     where: { id: user.id },
                     data: { isActive: true, banReason: null, banExpiresAt: null }
                 });
             } else {
                 // ❌ STILL BANNED
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

export const verifyOtp = async (email: string, code: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== code || !user.otpExpires || user.otpExpires < new Date()) {
        throw new Error("Invalid or expired OTP");
    }

    await prisma.user.update({
        where: { email },
        data: { otp: null, otpExpires: null, isActive: true }
    });

    const tokens = await generateTokens(user.id, "7d");
    return { user, ...tokens };
};

export const refreshAccessToken = async (token: string) => {
    if (!token) throw new Error("Refresh token required");
    let decoded: any;
    try {
        decoded = jwt.verify(token, REFRESH_SECRET);
    } catch (err) {
        throw new Error("Invalid refresh token");
    }
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
            bio: data.bio,
            country: data.country,
            city: data.city,
            postalCode: data.postalCode,
            taxId: data.taxId,
            avatar: data.avatar
        }
    });
};

// --- PASSWORD RECOVERY ---

export const forgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (!user.password) throw new Error("This account uses Google Sign-In.");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({ where: { email }, data: { otp, otpExpires: expires } });
    await sendEmail(email, "Reset Your Password", `Your Password Reset Code is: ${otp}`);
    return true;
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
        throw new Error("Invalid or expired code");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, otp: null, otpExpires: null }
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

// --- ADMIN SERVICES ---

/**
 * Fetches all users with their orders for management
 */
export const getAllUsers = async () => {
    return await prisma.user.findMany({
        include: {
            orders: {
                include: { items: true },
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Toggles user status (Ban/Unban)
 */
export const updateUserStatus = async (userId: number, isActive: boolean, banReason?: string, banDurationDays?: number) => {
    let banExpiresAt = null;

    if (!isActive && banDurationDays) {
        const date = new Date();
        date.setDate(date.getDate() + banDurationDays);
        banExpiresAt = date;
    }

    return await prisma.user.update({
        where: { id: userId },
        data: { 
            isActive,
            banReason: isActive ? null : banReason,
            banExpiresAt: isActive ? null : banExpiresAt
        }
    });
};

/**
 * Updates User Role (Super Admin usage)
 */
export const updateUserRole = async (userId: number, role: "ADMIN" | "CUSTOMER" | "SUPER_ADMIN") => {
    return await prisma.user.update({
        where: { id: userId },
        data: { role: role as any }
    });
};

// --- LOYALTY LEVEL SERVICES ---
export const getAllLoyaltyLevels = async () => {
    return await prisma.loyaltyLevel.findMany({ 
        orderBy: { minPoints: 'asc' } 
    });
};

export const createLoyaltyLevel = async (data: any) => {
    return await prisma.loyaltyLevel.create({
        data: {
            name: data.name,
            minPoints: Number(data.minPoints),
            discount: Number(data.discount || 0), // ✅ Added Discount
            color: data.color,
            badgeColor: data.badgeColor || "bg-gray-100" // Default fallback
        }
    });
};

export const updateLoyaltyLevel = async (id: number, data: any) => {
    return await prisma.loyaltyLevel.update({
        where: { id },
        data: { 
            name: data.name, 
            minPoints: data.minPoints !== undefined ? Number(data.minPoints) : undefined, 
            discount: data.discount !== undefined ? Number(data.discount) : undefined, // ✅ Added Discount
            color: data.color, 
            badgeColor: data.badgeColor 
        }
    });
};

export const deleteLoyaltyLevel = async (id: number) => {
    return await prisma.loyaltyLevel.delete({
        where: { id }
    });
};