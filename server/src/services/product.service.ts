import prisma from "../../prisma";
import { Prisma } from "../../generated/prisma/client";

export const createProduct = async (
    data: {
        name: string;
        description: string;
        color?: string;
        size?: string;
        price: Prisma.Decimal;
        quantity: number;
        imageUrl: string;
        availability?: boolean;
        isFeatured?: boolean;
        isTrending?: boolean;
        isFlashSale?: boolean;
        discountPercentage?: Prisma.Decimal;
        categoryId: number;
    }
) => {
    return prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            color: data.color ?? null,
            size: data.size ?? null,
            price: data.price,
            quantity: data.quantity,
            imageUrl: data.imageUrl,
            availability: data.availability ?? true,
            isFeatured: data.isFeatured ?? false,
            isTrending: data.isTrending ?? false,
            isFlashSale: data.isFlashSale ?? false,
            discountPercentage: data.discountPercentage ?? null,
            category: {
                connect: {
                    id: data.categoryId,
                },
            },
        },
        include: { category: true },
    });
};

interface GetProductsQuery {
  categoryId?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
}

export const getProducts = async () => {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
};

export const updateProduct = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    color?: string;
    size?: string;
    price?: Prisma.Decimal;
    quantity?: number;
    imageUrl?: string;
    availability?: boolean;
    isFeatured?: boolean;
    isTrending?: boolean;
    isFlashSale?: boolean;
    discountPercentage?: Prisma.Decimal;
    categoryId?: number;
  }
) => {
  return prisma.product.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.color !== undefined && { color: data.color ?? null }),
      ...(data.size !== undefined && { size: data.size ?? null }),
      ...(data.price && { price: data.price }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
      ...(data.availability !== undefined && { availability: data.availability }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.isTrending !== undefined && { isTrending: data.isTrending }),
      ...(data.isFlashSale !== undefined && { isFlashSale: data.isFlashSale }),
      ...(data.discountPercentage !== undefined && { discountPercentage: data.discountPercentage ?? null }),
      ...(data.categoryId && {
        category: {
          connect: {
            id: data.categoryId,
          },
        },
      }),
    },
    include: { category: true },
  });
};

export const deleteProduct = async (id: number) => {
  return prisma.product.delete({
    where: { id },
    include: { category: true },
  });
};