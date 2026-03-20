export declare const addToCart: (userId: number, productId: number) => Promise<{
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
    quantity: number;
    productId: number;
    cartId: number;
}>;
export declare const getCartByUser: (userId: number) => Promise<({
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
        quantity: number;
        productId: number;
        cartId: number;
    })[];
} & {
    id: number;
    createdAt: Date;
    userId: number;
}) | null>;
export declare const removeFromCart: (cartItemId: number) => Promise<{
    id: number;
    quantity: number;
    productId: number;
    cartId: number;
}>;
export declare const updateQuantity: (cartItemId: number, newQuantity: number) => Promise<{
    product: {
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
    quantity: number;
    productId: number;
    cartId: number;
}>;
//# sourceMappingURL=cart.service.d.ts.map