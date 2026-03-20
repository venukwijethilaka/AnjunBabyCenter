"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSuperAdmin = exports.requireAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../prisma"));
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access Denied. Malformed token." });
        }
        // Ensure JWT_SECRET is strictly present
        if (!process.env.JWT_SECRET) {
            console.error("FATAL: JWT_SECRET environment variable is missing.");
            return res.status(500).json({ message: "Internal server authentication error." });
        }
        const secret = String(process.env.JWT_SECRET);
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Optional: Check if user exists and is not banned
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, isActive: true }
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid token. User no longer exists." });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: "Account is banned or inactive." });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};
exports.verifyToken = verifyToken;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({ message: "Forbidden. Admin access required." });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    if (req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({ message: "Forbidden. Super Admin access required." });
    }
    next();
};
exports.requireSuperAdmin = requireSuperAdmin;
//# sourceMappingURL=auth.middleware.js.map