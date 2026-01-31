import prisma from "../../prisma";
import { Prisma } from "../../generated/prisma/client";


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

export const getAllCategories = () => {
    return prisma.category.findMany({
        include: {
            children: true,
        }
    })
}