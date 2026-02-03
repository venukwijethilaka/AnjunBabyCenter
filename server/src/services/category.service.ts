import prisma from "../../prisma";
import { Prisma } from "../../generated/prisma/client";


export const createCategory = (data: {
    name: string;
    parentId?: number;
    imageUrl?: string;
}) => {
    return prisma.category.create({
        data: {
            name: data.name,
            imageUrl: data.imageUrl,
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

export const getAllCategories = () => {
    return prisma.category.findMany({
        include: {
            children: true,
        }
    })
}

export const getCategoryById = (id: number) => {
    return prisma.category.findUnique({
        where: {
            id,
        }
    })
}

export const updateCategory = (id: number, data: {
    name?: string;
    parentId?: number;
    imageUrl?: string;
}) => {
    return prisma.category.update({
        where: {
            id,
        },
        data: {
            name: data.name,
            imageUrl: data.imageUrl,
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

export const deleteCategory = (id: number) => {
    return prisma.category.delete({
        where: {
            id,
        }
    })
}