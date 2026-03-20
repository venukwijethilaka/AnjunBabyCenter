import { z } from "zod";

export const createBannerSchema = z.object({
    body: z.object({
        title: z.string({ message: "Banner title is required" }).min(2, "Title must be at least 2 characters"),
        imageUrl: z.string({ message: "Image URL is required" }).url("Must be a valid URL"),
        linkUrl: z.string().url("Must be a valid URL").optional(),
        bannerPosition: z.enum(["HERO", "MIDDLE", "BOTTOM"], {
            message: "Valid banner position is required",
        }),
        isActive: z.boolean({ message: "isActive boolean is required" })
    })
});

export const updateBannerSchema = z.object({
    body: z.object({
        title: z.string().min(2).optional(),
        imageUrl: z.string().url().optional(),
        linkUrl: z.string().url().optional(),
        bannerPosition: z.enum(["HERO", "MIDDLE", "BOTTOM"]).optional(),
        isActive: z.boolean().optional()
    })
});
