import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

// Auth
router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.post("/auth/verify", userController.verifyOtp);
router.post("/auth/resend-otp", userController.resendOtp);
router.post("/auth/google", userController.loginWithGoogle);
router.post("/auth/refresh", userController.refreshToken);

// Password
router.post("/auth/forgot-password", userController.forgotPassword);
router.post("/auth/reset-password", userController.resetPassword);
router.post("/auth/change-password", userController.changePassword);

// Profile
router.get("/profile/:id", userController.getProfile);
router.put("/profile/:id", userController.updateProfile);

// Admin User Management
router.get("/", userController.getUsers);
router.patch("/:id/status", userController.toggleUserStatus);
router.patch("/:id/role", userController.updateUserRole);

router.get("/loyalty-levels", userController.getLoyaltyLevels);
router.post("/loyalty-levels", userController.createLoyaltyLevel);
router.patch("/loyalty-levels/:id", userController.updateLoyaltyLevel);
router.delete("/loyalty-levels/:id", userController.deleteLoyaltyLevel);

export default router;