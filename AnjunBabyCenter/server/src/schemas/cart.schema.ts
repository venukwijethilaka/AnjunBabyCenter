import { z } from "zod";

export const addToCartSchema = z.object({
    body: z.object({
        userId: z.number({ message: "User ID is required" }).int().positive(),
        productId: z.number({ message: "Product ID is required" }).int().positive(),
        quantity: z.number({ message: "Quantity is required" }).int().positive()
    })
});

export const updateCartItemSchema = z.object({
    body: z.object({
        quantity: z.number({ message: "Quantity is required" }).int().positive()
    })
});
