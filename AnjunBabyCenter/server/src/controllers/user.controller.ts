import type { Request, Response } from "express";
import * as userService from "../services/user.service";
import jwt from "jsonwebtoken";
import prisma from "../../prisma";

if (!process.env.JWT_SECRET) throw new Error("FATAL: JWT_SECRET environment variable is missing.");
const JWT_SECRET = process.env.JWT_SECRET;

// 1. Register - Updated to return Hash/Expiry
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const { hash, expiry } = await userService.registerUser(name, email, password);
        // ✅ Frontend needs these to verify later
        res.status(200).json({ message: "OTP sent to email", hash, expiry });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Registration failed" });
    }
};

// 2. Resend OTP - Updated to return new Hash/Expiry
export const resendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const { hash, expiry } = await userService.resendOtp(email);
        res.status(200).json({ message: "New OTP sent", hash, expiry });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to resend OTP" });
    }
};

// 3. Login (No changes needed here as it uses password/tokens)
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, rememberMe } = req.body;
        const result = await userService.loginUser(email, password, rememberMe);
        res.status(200).json({
            message: "Login successful",
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        });
    } catch (error: any) {
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

// 4. Verify OTP - Updated to receive Hash/Expiry from Frontend
export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp, hash, expiry } = req.body;
        const result = await userService.verifyOtp(email, otp, hash, expiry);
        res.status(200).json({
            message: "Verification successful",
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        });
    } catch (error: any) {
        res.status(401).json({ message: error.message || "Invalid or expired OTP" });
    }
};

// 5. Forgot Password - Updated to return Hash/Expiry
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const { hash, expiry } = await userService.forgotPassword(email);
        res.status(200).json({ message: "Reset code sent to email", hash, expiry });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// 6. Reset Password - Updated to receive Hash/Expiry
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, hash, expiry, newPassword } = req.body;
        await userService.resetPassword(email, otp, hash, expiry, newPassword);
        res.status(200).json({ message: "Password reset successful" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// --- REST OF THE CONTROLLERS (Google Login, Profile, Admin) ---
// These remain largely the same as they don't use the stateless OTP logic.

export const loginWithGoogle = async (req: Request, res: Response) => {
    try {
        const { email, googleId, name } = req.body;
        const result = await userService.findOrCreateGoogleUser(email, googleId, name);
        res.status(200).json({
            message: "Google login successful",
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        });
    } catch (error: any) {
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

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const result = await userService.refreshAccessToken(refreshToken);
        res.status(200).json({ accessToken: result.accessToken });
    } catch (error: any) {
        res.status(403).json({ message: error.message || "Invalid Refresh Token" });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const profile = await userService.getUserProfile(userId);
        if (!profile) return res.status(404).json({ message: "User not found" });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const updatedUser = await userService.updateUserProfile(userId, req.body);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: "Failed to update profile" });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        await userService.changePassword(Number(userId), currentPassword, newPassword);
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error: any) { res.status(400).json({ message: error.message }); }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const users = await userService.getAllUsers(page, limit);
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        let requesterId: number;
        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            requesterId = decoded.id;
        } catch (e) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const userId = Number(req.params.id);
        const { isActive, banReason, banDuration } = req.body;

        const [requester, targetUser] = await Promise.all([
            prisma.user.findUnique({ where: { id: requesterId } }),
            prisma.user.findUnique({ where: { id: userId } })
        ]);

        if (!targetUser) return res.status(404).json({ message: "User not found" });
        if (String(targetUser.role) === "SUPER_ADMIN") return res.status(403).json({ message: "Super Admins cannot be suspended." });
        if (userId === requesterId) return res.status(400).json({ message: "You cannot suspend your own account." });
        if (String(targetUser.role) === "ADMIN" && String(requester?.role) !== "SUPER_ADMIN") return res.status(403).json({ message: "Only Super Admins can suspend other Admins." });

        const updatedUser = await userService.updateUserStatus(userId, isActive, banReason, Number(banDuration));
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: "Failed to update user status" });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        let requesterId: number;
        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            requesterId = decoded.id;
        } catch (e) { return res.status(401).json({ message: "Invalid or expired token" }); }

        const requester = await prisma.user.findUnique({ where: { id: requesterId } });
        if (!requester || String(requester.role) !== "SUPER_ADMIN") return res.status(403).json({ message: "Only Super Admins can change roles." });

        const userId = Number(req.params.id);
        const { role } = req.body;
        if (!["CUSTOMER", "ADMIN", "SUPER_ADMIN"].includes(role)) return res.status(400).json({ message: "Invalid role specified." });

        const user = await userService.updateUserRole(userId, role as any);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: "Server crash during role update." });
    }
};

export const getLoyaltyLevels = async (req: Request, res: Response) => {
    try {
        const levels = await userService.getAllLoyaltyLevels();
        res.json(levels);
    } catch (e: any) { res.status(500).json({ message: "Failed to fetch levels", error: e.message }); }
};

export const createLoyaltyLevel = async (req: Request, res: Response) => {
    try {
        const level = await userService.createLoyaltyLevel(req.body);
        res.status(201).json(level);
    } catch (e: any) { res.status(500).json({ message: "Failed to create level", error: e.message }); }
};

export const updateLoyaltyLevel = async (req: Request, res: Response) => {
    try {
        const level = await userService.updateLoyaltyLevel(Number(req.params.id), req.body);
        res.json(level);
    } catch (e: any) {
        res.status(500).json({ message: "Failed to update level", error: e.message });
    }
};

export const deleteLoyaltyLevel = async (req: Request, res: Response) => {
    try {
        await userService.deleteLoyaltyLevel(Number(req.params.id));
        res.json({ message: "Loyalty level deleted" });
    } catch (e: any) {
        res.status(500).json({ message: "Failed to delete level", error: e.message });
    }
};