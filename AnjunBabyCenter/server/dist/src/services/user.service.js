"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoyaltyLevel = exports.updateLoyaltyLevel = exports.createLoyaltyLevel = exports.getAllLoyaltyLevels = exports.updateUserRole = exports.updateUserStatus = exports.getAllUsers = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.updateUserProfile = exports.getUserProfile = exports.refreshAccessToken = exports.verifyOtp = exports.loginUser = exports.resendOtp = exports.registerUser = exports.findOrCreateGoogleUser = exports.generateTokens = exports.sendEmail = exports.verifyOtpHash = exports.generateOtpHash = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto")); // ✅ Required for HMAC
// --- CONFIG ---
if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET || !process.env.OTP_HASH_SECRET) {
    throw new Error("FATAL: Cryptographic secrets (JWT_SECRET, REFRESH_SECRET, OTP_HASH_SECRET) are missing.");
}
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const OTP_HASH_SECRET = process.env.OTP_HASH_SECRET;
const transporter = nodemailer_1.default.createTransport({
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
const generateOtpHash = (email, otp, expiry) => {
    const data = `${email}|${otp}|${expiry}`;
    return crypto_1.default.createHmac("sha256", OTP_HASH_SECRET).update(data).digest("hex");
};
exports.generateOtpHash = generateOtpHash;
/**
 * Verifies the hash using a timing-safe comparison to prevent side-channel attacks.
 */
const verifyOtpHash = (email, otp, expiry, hash) => {
    // 1. Check if expired
    if (Date.now() > expiry)
        return false;
    // 2. Re-calculate hash
    const computedHash = (0, exports.generateOtpHash)(email, otp, expiry);
    // 3. Timing-safe comparison
    return crypto_1.default.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
};
exports.verifyOtpHash = verifyOtpHash;
// --- EMAIL & TOKEN HELPERS ---
const sendEmail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ EMAIL NOT CONFIGURED. OTP not sent.");
        return;
    }
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
        console.log(`✅ Email sent to ${to}`);
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
    }
};
exports.sendEmail = sendEmail;
const generateTokens = async (userId, refreshExpiry = "1d") => {
    const accessToken = jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, REFRESH_SECRET, { expiresIn: refreshExpiry });
    await prisma_1.default.user.update({
        where: { id: userId },
        data: { refreshToken }
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
// --- AUTH SERVICES ---
const findOrCreateGoogleUser = async (email, googleId, name) => {
    let user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma_1.default.user.create({
            data: { email, googleId, name, password: "", loyaltyPoints: 0, isActive: true, role: "CUSTOMER" }
        });
    }
    else if (!user.googleId) {
        user = await prisma_1.default.user.update({ where: { email }, data: { googleId } });
    }
    if (!user.isActive) {
        if (user.banExpiresAt && new Date() > user.banExpiresAt) {
            user = await prisma_1.default.user.update({
                where: { id: user.id },
                data: { isActive: true, banReason: null, banExpiresAt: null }
            });
        }
        else if (user.banExpiresAt) {
            const error = new Error("Account is banned");
            error.isBanned = true;
            error.banReason = user.banReason;
            error.banExpiresAt = user.banExpiresAt;
            throw error;
        }
    }
    const tokens = await (0, exports.generateTokens)(user.id, "7d");
    return { user, ...tokens };
};
exports.findOrCreateGoogleUser = findOrCreateGoogleUser;
const registerUser = async (name, email, password) => {
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    // Generate Stateless OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;
    const hash = (0, exports.generateOtpHash)(email, otp, expiry);
    if (existingUser) {
        if (existingUser.isActive)
            throw new Error("User already exists");
        await prisma_1.default.user.update({
            where: { email },
            data: { name, password: hashedPassword }
        });
    }
    else {
        await prisma_1.default.user.create({
            data: { name, email, password: hashedPassword, loyaltyPoints: 0, role: "CUSTOMER", isActive: false }
        });
    }
    await (0, exports.sendEmail)(email, "Anjun Baby Center", `Your OTP code is: ${otp}`);
    return { hash, expiry };
};
exports.registerUser = registerUser;
const resendOtp = async (email) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("User not found");
    if (user.isActive)
        throw new Error("User is already verified.");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;
    const hash = (0, exports.generateOtpHash)(email, otp, expiry);
    await (0, exports.sendEmail)(email, "New Verification Code", `Your new OTP code is: ${otp}`);
    return { hash, expiry };
};
exports.resendOtp = resendOtp;
const loginUser = async (email, password, rememberMe = false) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("User not found");
    if (!user.isActive) {
        if (user.banExpiresAt) {
            if (new Date() > user.banExpiresAt) {
                await prisma_1.default.user.update({
                    where: { id: user.id },
                    data: { isActive: true, banReason: null, banExpiresAt: null }
                });
            }
            else {
                const error = new Error("Account is banned");
                error.isBanned = true;
                error.banReason = user.banReason;
                error.banExpiresAt = user.banExpiresAt;
                throw error;
            }
        }
        else {
            throw new Error("Account not verified. Please verify your email.");
        }
    }
    if (!user.password)
        throw new Error("This account uses Google Sign-In.");
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const tokenLife = rememberMe ? "7d" : "1d";
    const tokens = await (0, exports.generateTokens)(user.id, tokenLife);
    return { user, ...tokens };
};
exports.loginUser = loginUser;
const verifyOtp = async (email, otp, hash, expiry) => {
    const isValid = (0, exports.verifyOtpHash)(email, otp, expiry, hash);
    if (!isValid)
        throw new Error("Invalid or expired OTP");
    // 1. Update the user status
    const updatedUser = await prisma_1.default.user.update({
        where: { email },
        data: { isActive: true }
    });
    // 2. Generate tokens
    const tokens = await (0, exports.generateTokens)(updatedUser.id, "7d");
    // 3. ✅ RETURN EVERYTHING (Tokens + User)
    return { user: updatedUser, ...tokens };
};
exports.verifyOtp = verifyOtp;
const refreshAccessToken = async (token) => {
    if (!token)
        throw new Error("Refresh token required");
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
    }
    catch (err) {
        throw new Error("Invalid refresh token");
    }
    const user = await prisma_1.default.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== token)
        throw new Error("Invalid refresh token");
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
    return { accessToken };
};
exports.refreshAccessToken = refreshAccessToken;
// --- PROFILE SERVICES ---
const getUserProfile = async (userId) => {
    return await prisma_1.default.user.findUnique({ where: { id: userId } });
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (userId, data) => {
    return await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            name: data.firstName + " " + data.lastName,
            phone: data.phone,
            country: data.country,
            city: data.city,
            postalCode: data.postalCode,
            avatar: data.avatar
        }
    });
};
exports.updateUserProfile = updateUserProfile;
// --- PASSWORD RECOVERY (STATELESS) ---
const forgotPassword = async (email) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("User not found");
    if (!user.password)
        throw new Error("This account uses Google Sign-In.");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;
    const hash = (0, exports.generateOtpHash)(email, otp, expiry);
    await (0, exports.sendEmail)(email, "Reset Your Password", `Your Password Reset Code is: ${otp}`);
    return { hash, expiry };
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (email, otp, hash, expiry, newPassword) => {
    const isValid = (0, exports.verifyOtpHash)(email, otp, expiry, hash);
    if (!isValid)
        throw new Error("Invalid or expired code");
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
    await prisma_1.default.user.update({
        where: { email },
        data: { password: hashedPassword }
    });
    return true;
};
exports.resetPassword = resetPassword;
const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error("User not found");
    if (!user.password)
        throw new Error("Google account detected.");
    const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!isMatch)
        throw new Error("Incorrect current password");
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
    await prisma_1.default.user.update({ where: { id: userId }, data: { password: hashedPassword } });
    return true;
};
exports.changePassword = changePassword;
// --- ADMIN & LOYALTY SERVICES ---
const getAllUsers = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        prisma_1.default.user.findMany({
            skip,
            take: limit,
            include: { orders: { include: { items: true }, orderBy: { createdAt: 'desc' } } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma_1.default.user.count()
    ]);
    return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) };
};
exports.getAllUsers = getAllUsers;
const updateUserStatus = async (userId, isActive, banReason, banDurationDays) => {
    let banExpiresAt = null;
    if (!isActive && banDurationDays) {
        const date = new Date();
        date.setDate(date.getDate() + banDurationDays);
        banExpiresAt = date;
    }
    return await prisma_1.default.user.update({
        where: { id: userId },
        data: { isActive, banReason: isActive ? null : banReason, banExpiresAt: isActive ? null : banExpiresAt }
    });
};
exports.updateUserStatus = updateUserStatus;
const updateUserRole = async (userId, role) => {
    return await prisma_1.default.user.update({ where: { id: userId }, data: { role: role } });
};
exports.updateUserRole = updateUserRole;
const getAllLoyaltyLevels = async () => {
    return await prisma_1.default.loyaltyLevel.findMany({ orderBy: { minPoints: 'asc' } });
};
exports.getAllLoyaltyLevels = getAllLoyaltyLevels;
const createLoyaltyLevel = async (data) => {
    return await prisma_1.default.loyaltyLevel.create({
        data: {
            name: data.name,
            minPoints: Number(data.minPoints),
            discount: Number(data.discount || 0),
            color: data.color,
            badgeColor: data.badgeColor || "bg-gray-100"
        }
    });
};
exports.createLoyaltyLevel = createLoyaltyLevel;
const updateLoyaltyLevel = async (id, data) => {
    return await prisma_1.default.loyaltyLevel.update({
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
exports.updateLoyaltyLevel = updateLoyaltyLevel;
const deleteLoyaltyLevel = async (id) => {
    return await prisma_1.default.loyaltyLevel.delete({ where: { id } });
};
exports.deleteLoyaltyLevel = deleteLoyaltyLevel;
//# sourceMappingURL=user.service.js.map