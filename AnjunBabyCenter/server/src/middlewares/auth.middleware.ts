import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../prisma";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

        const secret: string = String(process.env.JWT_SECRET);
        const decoded = jwt.verify(token, secret) as unknown as { id: number; email: string; role: string };

        // Optional: Check if user exists and is not banned
        const user = await prisma.user.findUnique({
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
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({ message: "Forbidden. Admin access required." });
    }

    next();
};

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({ message: "Forbidden. Super Admin access required." });
    }

    next();
};
