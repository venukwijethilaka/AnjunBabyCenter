export declare const addToWishlist: (userId: number, productId: number) => Promise<{
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
    createdAt: Date;
    userId: number;
    productId: number;
}>;
export declare const getWishlistByUser: (userId: number) => Promise<{
    userId: number;
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
        createdAt: Date;
        userId: number;
        productId: number;
    })[];
    count: number;
}>;
export declare const removeFromWishlist: (wishlistId: number) => Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    productId: number;
}>;
export declare const removeFromWishlistByProductAndUser: (userId: number, productId: number) => Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    productId: number;
}>;
export declare const checkIfInWishlist: (userId: number, productId: number) => Promise<boolean>;
//# sourceMappingURL=wishlist.service.d.ts.map