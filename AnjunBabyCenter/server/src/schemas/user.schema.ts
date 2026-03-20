import { z } from "zod";

export const toggleUserStatusSchema = z.object({
    body: z.object({
        isActive: z.boolean({ message: "isActive boolean is required" }),
        banReason: z.string().optional(),
        banDuration: z.number().int().positive().optional(),
    })
});

export const updateUserRoleSchema = z.object({
    body: z.object({
        role: z.enum(["CUSTOMER", "ADMIN", "SUPER_ADMIN"], {
            message: "Valid role is required",
        }),
    })
});

export const updateProfileSchema = z.object({
    body: z.object({
        firstName: z.string().min(2).optional(),
        lastName: z.string().min(2).optional(),
        phone: z.string().regex(/^0\d{9}$/, "Phone must be 10 digits starting with 0").optional().or(z.literal("")),
        country: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        avatar: z.string().optional(),
    })
});

export const createLoyaltyLevelSchema = z.object({
    body: z.object({
        name: z.string({ message: "Name is required" }),
        minPoints: z.number({ message: "Minimum points is required" }).int().nonnegative(),
        color: z.string().optional(),
        perks: z.array(z.string()).optional(),
    })
});

export const updateLoyaltyLevelSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        minPoints: z.number().int().nonnegative().optional(),
        color: z.string().optional(),
        perks: z.array(z.string()).optional(),
    })
});
