import { z } from "zod";

export const addToWishlistSchema = z.object({
    body: z.object({
        userId: z.number({ message: "User ID is required" }).int().positive(),
        productId: z.number({ message: "Product ID is required" }).int().positive(),
    })
});
