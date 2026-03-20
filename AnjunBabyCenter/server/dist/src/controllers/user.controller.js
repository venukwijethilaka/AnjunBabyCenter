"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoyaltyLevel = exports.updateLoyaltyLevel = exports.createLoyaltyLevel = exports.getLoyaltyLevels = exports.updateUserRole = exports.toggleUserStatus = exports.getUsers = exports.changePassword = exports.updateProfile = exports.getProfile = exports.refreshToken = exports.loginWithGoogle = exports.resetPassword = exports.forgotPassword = exports.verifyOtp = exports.login = exports.resendOtp = exports.register = void 0;
const userService = __importStar(require("../services/user.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../prisma"));
if (!process.env.JWT_SECRET)
    throw new Error("FATAL: JWT_SECRET environment variable is missing.");
const JWT_SECRET = process.env.JWT_SECRET;
// 1. Register - Updated to return Hash/Expiry
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { hash, expiry } = await userService.registerUser(name, email, password);
        // ✅ Frontend needs these to verify later
        res.status(200).json({ message: "OTP sent to email", hash, expiry });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Registration failed" });
    }
};
exports.register = register;
// 2. Resend OTP - Updated to return new Hash/Expiry
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const { hash, expiry } = await userService.resendOtp(email);
        res.status(200).json({ message: "New OTP sent", hash, expiry });
    }
    catch (error) {
        res.status(400).json({ message: error.message || "Failed to resend OTP" });
    }
};
exports.resendOtp = resendOtp;
// 3. Login (No changes needed here as it uses password/tokens)
const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const result = await userService.loginUser(email, password, rememberMe);
        res.status(200).json({
            message: "Login successful",
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        });
    }
    catch (error) {
        if (error.isBanned) {
            return res.status(403).json({
                message: "Account Banned",
                isBanned: true,
                banReason: error.banReason,
                banExpiresAt: error.banExpiresAt
            });
        }
        res.status(401).json({ message: error.message || "Login failed" });
    }
};
exports.login = login;
// 4. Verify OTP - Updated to receive Hash/Expiry from Frontend
const verifyOtp = async (req, res) => {
    try {
        const { email, otp, hash, expiry } = req.body;
        const result = await userService.verifyOtp(email, otp, hash, expiry);
        res.status(200).json({
            message: "Verification successful",
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        });
    }
    catch (error) {
        res.status(401).json({ message: error.message || "Invalid or expired OTP" });
    }
};
exports.verifyOtp = verifyOtp;
// 5. Forgot Password - Updated to return Hash/Expiry
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const { hash, expiry } = await userService.forgotPassword(email);
        res.status(200).json({ message: "Reset code sent to email", hash, expiry });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.forgotPassword = forgotPassword;
// 6. Reset Password - Updated to receive Hash/Expiry
const resetPassword = async (req, res) => {
    try {
        const { email, otp, hash, expiry, newPassword } = req.body;
        await userService.resetPassword(email, otp, hash, expiry, newPassword);
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.resetPassword = resetPassword;
// --- REST OF THE CONTROLLERS (Google Login, Profile, Admin) ---
// These remain largely the same as they don't use the stateless OTP logic.
const loginWithGoogle = async (req, res) => {
    try {
        const { email, googleId, name } = req.body;
        const result = await userService.findOrCreateGoogleUser(email, googleId, name);
        res.status(200).json({
            message: "Google login successful",
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        });
    }
    catch (error) {
        if (error.isBanned) {
            return res.status(403).json({
                message: "Account Banned",
                isBanned: true,
                banReason: error.banReason,
                banExpiresAt: error.banExpiresAt
            });
        }
        res.status(500).json({ message: "Google login failed", error });
    }
};
exports.loginWithGoogle = loginWithGoogle;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await userService.refreshAccessToken(refreshToken);
        res.status(200).json({ accessToken: result.accessToken });
    }
    catch (error) {
        res.status(403).json({ message: error.message || "Invalid Refresh Token" });
    }
};
exports.refreshToken = refreshToken;
const getProfile = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const profile = await userService.getUserProfile(userId);
        if (!profile)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json(profile);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const updatedUser = await userService.updateUserProfile(userId, req.body);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update profile" });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        await userService.changePassword(Number(userId), currentPassword, newPassword);
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.changePassword = changePassword;
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const users = await userService.getAllUsers(page, limit);
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
exports.getUsers = getUsers;
const toggleUserStatus = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Unauthorized" });
        let requesterId;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            requesterId = decoded.id;
        }
        catch (e) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        const userId = Number(req.params.id);
        const { isActive, banReason, banDuration } = req.body;
        const [requester, targetUser] = await Promise.all([
            prisma_1.default.user.findUnique({ where: { id: requesterId } }),
            prisma_1.default.user.findUnique({ where: { id: userId } })
        ]);
        if (!targetUser)
            return res.status(404).json({ message: "User not found" });
        if (String(targetUser.role) === "SUPER_ADMIN")
            return res.status(403).json({ message: "Super Admins cannot be suspended." });
        if (userId === requesterId)
            return res.status(400).json({ message: "You cannot suspend your own account." });
        if (String(targetUser.role) === "ADMIN" && String(requester?.role) !== "SUPER_ADMIN")
            return res.status(403).json({ message: "Only Super Admins can suspend other Admins." });
        const updatedUser = await userService.updateUserStatus(userId, isActive, banReason, Number(banDuration));
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update user status" });
    }
};
exports.toggleUserStatus = toggleUserStatus;
const updateUserRole = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Unauthorized" });
        let requesterId;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            requesterId = decoded.id;
        }
        catch (e) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        const requester = await prisma_1.default.user.findUnique({ where: { id: requesterId } });
        if (!requester || String(requester.role) !== "SUPER_ADMIN")
            return res.status(403).json({ message: "Only Super Admins can change roles." });
        const userId = Number(req.params.id);
        const { role } = req.body;
        if (!["CUSTOMER", "ADMIN", "SUPER_ADMIN"].includes(role))
            return res.status(400).json({ message: "Invalid role specified." });
        const user = await userService.updateUserRole(userId, role);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server crash during role update." });
    }
};
exports.updateUserRole = updateUserRole;
const getLoyaltyLevels = async (req, res) => {
    try {
        const levels = await userService.getAllLoyaltyLevels();
        res.json(levels);
    }
    catch (e) {
        res.status(500).json({ message: "Failed to fetch levels", error: e.message });
    }
};
exports.getLoyaltyLevels = getLoyaltyLevels;
const createLoyaltyLevel = async (req, res) => {
    try {
        const level = await userService.createLoyaltyLevel(req.body);
        res.status(201).json(level);
    }
    catch (e) {
        res.status(500).json({ message: "Failed to create level", error: e.message });
    }
};
exports.createLoyaltyLevel = createLoyaltyLevel;
const updateLoyaltyLevel = async (req, res) => {
    try {
        const level = await userService.updateLoyaltyLevel(Number(req.params.id), req.body);
        res.json(level);
    }
    catch (e) {
        res.status(500).json({ message: "Failed to update level", error: e.message });
    }
};
exports.updateLoyaltyLevel = updateLoyaltyLevel;
const deleteLoyaltyLevel = async (req, res) => {
    try {
        await userService.deleteLoyaltyLevel(Number(req.params.id));
        res.json({ message: "Loyalty level deleted" });
    }
    catch (e) {
        res.status(500).json({ message: "Failed to delete level", error: e.message });
    }
};
exports.deleteLoyaltyLevel = deleteLoyaltyLevel;
//# sourceMappingURL=user.controller.js.map