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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Auth (Public)
router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.post("/auth/verify", userController.verifyOtp);
router.post("/auth/resend-otp", userController.resendOtp);
router.post("/auth/google", userController.loginWithGoogle);
router.post("/auth/refresh", userController.refreshToken);
router.post("/auth/forgot-password", userController.forgotPassword);
router.post("/auth/reset-password", userController.resetPassword);
// Protected User Self-Service
router.post("/auth/change-password", auth_middleware_1.verifyToken, userController.changePassword);
router.get("/profile/:id", auth_middleware_1.verifyToken, userController.getProfile);
router.put("/profile/:id", auth_middleware_1.verifyToken, userController.updateProfile);
// Admin / Super Admin Routes
router.get("/", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, userController.getUsers);
router.patch("/:id/status", auth_middleware_1.verifyToken, auth_middleware_1.requireSuperAdmin, userController.toggleUserStatus);
router.patch("/:id/role", auth_middleware_1.verifyToken, auth_middleware_1.requireSuperAdmin, userController.updateUserRole);
router.get("/loyalty-levels", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, userController.getLoyaltyLevels);
router.post("/loyalty-levels", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, userController.createLoyaltyLevel);
router.patch("/loyalty-levels/:id", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, userController.updateLoyaltyLevel);
router.delete("/loyalty-levels/:id", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, userController.deleteLoyaltyLevel);
exports.default = router;
//# sourceMappingURL=user.route.js.map