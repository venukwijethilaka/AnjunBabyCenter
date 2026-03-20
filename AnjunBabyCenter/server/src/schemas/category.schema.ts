import { z } from "zod";

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string({ message: "Category name is required" }).min(2, "Name must be at least 2 characters"),
        description: z.string().optional(),
        imageUrl: z.string().url("Must be a valid URL").optional(),
        parentId: z.number().int().positive().optional().nullable(),
    })
});

export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        parentId: z.number().int().positive().optional().nullable(),
    })
});
