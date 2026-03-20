import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        userId: z.number({ message: "User ID is required" }).int().positive(),
        totalAmount: z.number({ message: "Total amount is required" }).nonnegative(),
        address: z.object({
            street: z.string().min(1),
            city: z.string().min(1),
            postalCode: z.string().min(1),
            country: z.string().min(1),
            phone: z.string().min(1)
        }),
        items: z.array(z.object({
            productId: z.number().int().positive(),
            quantity: z.number().int().positive(),
            price: z.number().nonnegative()
        })).min(1, "Order must contain at least one item")
    })
});

export const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.enum(["PENDING", "ARRANGING", "SHIPPING", "DELIVERED", "CANCELLED"], {
            message: "Valid status is required",
        }),
        trackingId: z.string().optional()
    })
});
