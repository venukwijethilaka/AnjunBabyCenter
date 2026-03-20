export declare const createCategory: (data: {
    name: string;
    parentId?: number;
    imageUrl?: string;
}) => import("../../generated/prisma/models").Prisma__CategoryClient<{
    name: string;
    id: number;
    isActive: boolean;
    createdAt: Date;
    parentId: number | null;
    imageUrl: string | null;
}, never, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
}>;
export declare const getAllCategories: () => import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
    parent: {
        name: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        parentId: number | null;
        imageUrl: string | null;
    } | null;
    children: {
        name: string;
        id: number;
        isActive: boolean;
        createdAt: Date;
        parentId: number | null;
        imageUrl: string | null;
    }[];
} & {
    name: string;
    id: number;
    isActive: boolean;
    createdAt: Date;
    parentId: number | null;
    imageUrl: string | null;
})[]>;
export declare const getCategoryById: (id: number) => import("../../generated/prisma/models").Prisma__CategoryClient<{
    name: string;
    id: number;
    isActive: boolean;
    createdAt: Date;
    parentId: number | null;
    imageUrl: string | null;
} | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
}>;
export declare const updateCategory: (id: number, data: {
    name?: string;
    parentId?: number | null;
    imageUrl?: string;
}) => import("../../generated/prisma/models").Prisma__CategoryClient<{
    name: string;
    id: number;
    isActive: boolean;
    createdAt: Date;
    parentId: number | null;
    imageUrl: string | null;
}, never, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
}>;
export declare const deleteCategory: (id: number) => Promise<{
    name: string;
    id: number;
    isActive: boolean;
    createdAt: Date;
    parentId: number | null;
    imageUrl: string | null;
}>;
//# sourceMappingURL=category.service.d.ts.map