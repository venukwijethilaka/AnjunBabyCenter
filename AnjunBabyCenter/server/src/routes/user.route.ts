import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { verifyToken, requireAdmin, requireSuperAdmin } from "../middlewares/auth.middleware";

import { validateResource } from "../middlewares/validate";
import { registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema, googleLoginSchema, changePasswordSchema } from "../schemas/auth.schema";
import { toggleUserStatusSchema, updateUserRoleSchema, updateProfileSchema, createLoyaltyLevelSchema, updateLoyaltyLevelSchema } from "../schemas/user.schema";

const router = Router();

// Auth (Public)
router.post("/auth/register", validateResource(registerSchema), userController.register);
router.post("/auth/login", validateResource(loginSchema), userController.login);
router.post("/auth/verify", validateResource(verifyOtpSchema), userController.verifyOtp);
router.post("/auth/resend-otp", validateResource(resendOtpSchema), userController.resendOtp);
router.post("/auth/google", validateResource(googleLoginSchema), userController.loginWithGoogle);
router.post("/auth/refresh", userController.refreshToken); // Doesn't need strict validation, just expects valid existing refreshToken
router.post("/auth/forgot-password", userController.forgotPassword); // Just email
router.post("/auth/reset-password", userController.resetPassword); // Token + new password

// Protected User Self-Service
router.post("/auth/change-password", verifyToken, validateResource(changePasswordSchema), userController.changePassword);
router.get("/profile/:id", verifyToken, userController.getProfile);
router.put("/profile/:id", verifyToken, validateResource(updateProfileSchema), userController.updateProfile);

// Admin / Super Admin Routes
router.get("/", verifyToken, requireAdmin, userController.getUsers);
router.patch("/:id/status", verifyToken, requireSuperAdmin, validateResource(toggleUserStatusSchema), userController.toggleUserStatus);
router.patch("/:id/role", verifyToken, requireSuperAdmin, validateResource(updateUserRoleSchema), userController.updateUserRole);

router.get("/loyalty-levels", verifyToken, requireAdmin, userController.getLoyaltyLevels);
router.post("/loyalty-levels", verifyToken, requireAdmin, validateResource(createLoyaltyLevelSchema), userController.createLoyaltyLevel);
router.patch("/loyalty-levels/:id", verifyToken, requireAdmin, validateResource(updateLoyaltyLevelSchema), userController.updateLoyaltyLevel);
router.delete("/loyalty-levels/:id", verifyToken, requireAdmin, userController.deleteLoyaltyLevel);

export default router;