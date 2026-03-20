export declare const getAllOffers: (includeAll?: boolean) => Promise<({
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
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    productId: number;
    title: string;
    offerPrice: import("@prisma/client-runtime-utils").Decimal;
    endDate: Date;
})[]>;
export declare const getActiveOffer: () => Promise<({
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
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    productId: number;
    title: string;
    offerPrice: import("@prisma/client-runtime-utils").Decimal;
    endDate: Date;
}) | null>;
export declare const createOffer: (data: any) => Promise<{
    id: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    productId: number;
    title: string;
    offerPrice: import("@prisma/client-runtime-utils").Decimal;
    endDate: Date;
}>;
export declare const updateOffer: (id: number, data: any) => Promise<{
    id: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    productId: number;
    title: string;
    offerPrice: import("@prisma/client-runtime-utils").Decimal;
    endDate: Date;
}>;
export declare const deleteOffer: (id: number) => Promise<{
    id: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    productId: number;
    title: string;
    offerPrice: import("@prisma/client-runtime-utils").Decimal;
    endDate: Date;
}>;
//# sourceMappingURL=offer.service.d.ts.map