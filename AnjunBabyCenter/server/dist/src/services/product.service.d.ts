import { Prisma } from "../../generated/prisma/client";
export declare const createProduct: (data: {
    name: string;
    description: string;
    color?: string;
    size?: string;
    price: Prisma.Decimal;
    quantity: number;
    availability?: boolean;
    discountPercentage?: Prisma.Decimal;
    categoryId: number;
    images: {
        url: string;
        isMain: boolean;
        altText?: string;
    }[];
}) => Promise<{
    category: {
        name: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        parentId: number | null;
        imageUrl: string | null;
    };
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
}>;
/** Trending: most ordered products in the last N days */
export declare const getTrendingProducts: (limit?: number, days?: number) => Promise<{
    name: string;
    id: number;
    createdAt: Date;
    color: string | null;
    size: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    quantity: number;
    availability: boolean;
    discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
    category: {
        name: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        parentId: number | null;
        imageUrl: string | null;
    };
    images: {
        url: string;
        id: number;
        altText: string | null;
        isMain: boolean;
        productId: number;
    }[];
    categoryId: number;
}[]>;
/** Featured: newest products (last 30 days) sorted by wishlist saves */
export declare const getFeaturedProducts: (limit?: number, days?: number) => Promise<{
    name: string;
    id: number;
    createdAt: Date;
    wishlist: {
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
    }[];
    color: string | null;
    size: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    quantity: number;
    availability: boolean;
    discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
    category: {
        name: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        parentId: number | null;
        imageUrl: string | null;
    };
    images: {
        url: string;
        id: number;
        altText: string | null;
        isMain: boolean;
        productId: number;
    }[];
    promotionalOffers: {
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        productId: number;
        title: string;
        offerPrice: import("@prisma/client-runtime-utils").Decimal;
        endDate: Date;
    }[];
    categoryId: number;
}[]>;
/** Flash Sale: products with an active, non-expired PromotionalOffer */
export declare const getFlashSaleProducts: (limit?: number) => Promise<{
    _offerPrice: number;
    _offerEndDate: Date;
    _offerId: number;
    category: {
        name: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        parentId: number | null;
        imageUrl: string | null;
    };
    images: {
        url: string;
        id: number;
        altText: string | null;
        isMain: boolean;
        productId: number;
    }[];
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
}[]>;
export declare const getProducts: () => Promise<{
    name: string;
    id: number;
    createdAt: Date;
    color: string | null;
    size: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    quantity: number;
    availability: boolean;
    discountPercentage: import("@prisma/client-runtime-utils").Decimal | null;
    category: {
        name: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        parentId: number | null;
        imageUrl: string | null;
    };
    images: {
        url: string;
        id: number;
        altText: string | null;
        isMain: boolean;
        productId: number;
    }[];
    categoryId: number;
}[]>;
export declare const getProductById: (id: number) => Promise<({
    category: {
        name: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        parentId: number | null;
        imageUrl: string | null;
    };
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
}) | null>;
export declare const updateProduct: (id: number, data: {
    name?: string;
    description?: string;
    color?: string;
    size?: string;
    price?: Prisma.Decimal;
    quantity?: number;
    availability?: boolean;
    discountPercentage?: Prisma.Decimal;
    categoryId?: number;
    images?: {
        url: string;
        isMain: boolean;
        altText?: string;
    }[];
}) => Promise<({
    category: {
        name: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        parentId: number | null;
        imageUrl: string | null;
    };
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
}) | null>;
export declare const deleteProduct: (id: number) => Promise<{
    category: {
        name: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        parentId: number | null;
        imageUrl: string | null;
    };
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
}>;
//# sourceMappingURL=product.service.d.ts.map