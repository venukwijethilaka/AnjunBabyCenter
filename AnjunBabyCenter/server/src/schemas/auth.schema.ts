import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z.string({ message: "Name is required" }).min(2, "Name must be at least 2 characters"),
        email: z.string({ message: "Email is required" }).email("Not a valid email"),
        password: z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string({ message: "Email is required" }).email("Not a valid email"),
        password: z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
        rememberMe: z.boolean().optional(),
    })
});

export const verifyOtpSchema = z.object({
    body: z.object({
        email: z.string({ message: "Email is required" }).email(),
        otp: z.string({ message: "OTP is required" }).length(6, "OTP must be exactly 6 digits"),
    })
});

export const resendOtpSchema = z.object({
    body: z.object({
        email: z.string({ message: "Email is required" }).email(),
    })
});

export const googleLoginSchema = z.object({
    body: z.object({
        email: z.string({ message: "Email is required" }).email(),
        name: z.string({ message: "Name is required" }),
        googleId: z.string({ message: "Google ID is required" }),
    })
});

export const changePasswordSchema = z.object({
    body: z.object({
        userId: z.number({ message: "User ID is required" }),
        currentPassword: z.string({ message: "Current password is required" }),
        newPassword: z.string({ message: "New password is required" }).min(6, "Password must be at least 6 characters"),
    })
});
