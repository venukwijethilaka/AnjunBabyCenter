import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string({ message: "Product name is required" }).min(2, "Name must be at least 2 characters"),
        price: z.number({ message: "Price is required" }).positive("Price must be positive"),
        stockQuantity: z.number({ message: "Stock quantity is required" }).int().nonnegative("Stock cannot be negative"),
        categoryId: z.number({ message: "Category ID is required" }).int().positive(),
        description: z.string().optional(),
        gender: z.enum(["BOY", "GIRL", "UNISEX"]).optional(),
        isTrending: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        images: z.array(z.object({
            url: z.string().url("Must be a valid URL"),
            isMain: z.boolean().optional()
        })).optional()
    })
});

export const updateProductSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        price: z.number().positive().optional(),
        stockQuantity: z.number().int().nonnegative().optional(),
        categoryId: z.number().int().positive().optional(),
        description: z.string().optional(),
        gender: z.enum(["BOY", "GIRL", "UNISEX"]).optional(),
        isTrending: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        images: z.array(z.object({
            id: z.number().optional(),
            url: z.string().url(),
            isMain: z.boolean().optional()
        })).optional()
    })
});

export const createReviewSchema = z.object({
    body: z.object({
        userId: z.number({ message: "User ID is required" }).int().positive(),
        rating: z.number({ message: "Rating is required" }).int().min(1).max(5),
        comment: z.string().optional()
    })
});
