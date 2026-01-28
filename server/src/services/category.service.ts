import prisma from "../../prisma";
import { Prisma } from "../../generated/prisma/client";

export const getCategories = () => {
    return prisma.category.findMany({
        include: {
            parent: true,
            children: true,
            products: true,
        },
        orderBy: {
            id: "asc",
        },
    });
};

export const createCategory = (data: {
    name: string;
    parentId?: number;
}) => {
    return prisma.category.create({
        data: {
            name: data.name,
            ...(data.parentId && {
                parent: {
                    connect: {
                        id: data.parentId,
                    }
                }
            })
        }
    })
}