import { z } from "zod";

export const createOfferSchema = z.object({
    body: z.object({
        title: z.string({ message: "Offer title is required" }).min(2, "Title must be at least 2 characters"),
        description: z.string({ message: "Offer description is required" }).min(5),
        imageUrl: z.string().url("Must be a valid URL").optional(),
        discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
            message: "Valid discount type is required",
        }),
        discountValue: z.number({ message: "Discount value is required" }).positive(),
        startDate: z.string().datetime({ message: "Invalid start date format" }).optional(),
        endDate: z.string().datetime({ message: "Invalid end date format" }).optional(),
        isActive: z.boolean({ message: "isActive boolean is required" }),
        productIds: z.array(z.number().int().positive()).optional()
    })
});

export const updateOfferSchema = z.object({
    body: z.object({
        title: z.string().min(2).optional(),
        description: z.string().min(5).optional(),
        imageUrl: z.string().url().optional(),
        discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]).optional(),
        discountValue: z.number().positive().optional(),
        startDate: z.string().datetime().optional().nullable(),
        endDate: z.string().datetime().optional().nullable(),
        isActive: z.boolean().optional(),
        productIds: z.array(z.number().int().positive()).optional()
    })
});
