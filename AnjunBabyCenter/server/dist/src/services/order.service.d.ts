export declare const createOrder: (userId: number, address: any, items: any[], totalAmount: number) => Promise<{
    items: ({
        product: {
            images: {
                url: string;
                id: number;
                altText: string | null;
                isMain: boolean;
                productId: number;
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            color: string | null;
            description: string;
            size: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            availability: boolean;
            discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
            categoryId: number;
        };
    } & {
        id: number;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        orderId: number;
        productId: number;
    })[];
} & {
    id: number;
    createdAt: Date;
    userId: number;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
    status: string;
    address: import("@prisma/client/runtime/client").JsonValue;
    trackingId: string | null;
}>;
export declare const getUserOrders: (userId: number) => Promise<({
    items: ({
        product: {
            images: {
                url: string;
                id: number;
                altText: string | null;
                isMain: boolean;
                productId: number;
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            color: string | null;
            description: string;
            size: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            availability: boolean;
            discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
            categoryId: number;
        };
    } & {
        id: number;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        orderId: number;
        productId: number;
    })[];
} & {
    id: number;
    createdAt: Date;
    userId: number;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
    status: string;
    address: import("@prisma/client/runtime/client").JsonValue;
    trackingId: string | null;
})[]>;
export declare const getOrderById: (orderId: number) => Promise<({
    user: {
        name: string | null;
        id: number;
        email: string;
    };
    items: ({
        product: {
            images: {
                url: string;
                id: number;
                altText: string | null;
                isMain: boolean;
                productId: number;
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            color: string | null;
            description: string;
            size: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            availability: boolean;
            discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
            categoryId: number;
        };
    } & {
        id: number;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        orderId: number;
        productId: number;
    })[];
} & {
    id: number;
    createdAt: Date;
    userId: number;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
    status: string;
    address: import("@prisma/client/runtime/client").JsonValue;
    trackingId: string | null;
}) | null>;
export declare const getAllOrders: (page?: number, limit?: number) => Promise<{
    data: ({
        user: {
            name: string | null;
            id: number;
            email: string;
        };
        items: ({
            product: {
                images: {
                    url: string;
                    id: number;
                    altText: string | null;
                    isMain: boolean;
                    productId: number;
                }[];
            } & {
                name: string;
                id: number;
                createdAt: Date;
                color: string | null;
                description: string;
                size: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                quantity: number;
                availability: boolean;
                discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
                categoryId: number;
            };
        } & {
            id: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            orderId: number;
            productId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        status: string;
        address: import("@prisma/client/runtime/client").JsonValue;
        trackingId: string | null;
    })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
export declare const updateOrderStatus: (orderId: number, status: string, trackingId?: string) => Promise<{
    items: ({
        product: {
            images: {
                url: string;
                id: number;
                altText: string | null;
                isMain: boolean;
                productId: number;
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            color: string | null;
            description: string;
            size: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            availability: boolean;
            discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
            categoryId: number;
        };
    } & {
        id: number;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        orderId: number;
        productId: number;
    })[];
} & {
    id: number;
    createdAt: Date;
    userId: number;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
    status: string;
    address: import("@prisma/client/runtime/client").JsonValue;
    trackingId: string | null;
}>;
//# sourceMappingURL=order.service.d.ts.map