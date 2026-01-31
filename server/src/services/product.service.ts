import prisma from "../../prisma";
import { Prisma } from "../../generated/prisma/client";

export const createProduct = async (data: {
    name: string;
    description: string;
    color?: string;
    size?: string;
    price: Prisma.Decimal;
    quantity: number;
    availability?: boolean;
    isFeatured?: boolean;
    isTrending?: boolean;
    isFlashSale?: boolean;
    discountPercentage?: Prisma.Decimal;
    categoryId: number;
    images: { url: string; isMain: boolean; altText?: string }[];
}) => {
    const { categoryId, images, ...productData } = data;

    return prisma.product.create({
        data: {
            ...productData,
            category: {
                connect: {
                    id: categoryId,
                },
            },
            images: {
                create: images.map(img => ({
                    url: img.url,
                    isMain: img.isMain,
                    altText: img.altText || productData.name, // Use product name as fallback alt text
                })),
            },
        },
        include: { category: true, images: true },
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
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true, images: true },
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
    availability?: boolean;
    isFeatured?: boolean;
    isTrending?: boolean;
    isFlashSale?: boolean;
    discountPercentage?: Prisma.Decimal;
    categoryId?: number;
    images?: { url: string; isMain: boolean; altText?: string }[];
  }
) => {
  const { images, categoryId, ...productData } = data;

  return prisma.$transaction(async (tx) => {
    // 1. Update scalar fields of the product
    const updatedProduct = await tx.product.update({
      where: { id },
      data: {
        ...productData,
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
      },
    });

    // 2. If new images are provided, replace the old ones
    if (images) {
      // First, delete all existing images for this product
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      // Then, create the new set of images
      await tx.productImage.createMany({
        data: images.map(img => ({
          url: img.url,
          isMain: img.isMain,
          altText: img.altText || updatedProduct.name,
          productId: id,
        })),
      });
    }

    // 3. Return the fully updated product with all relations
    return tx.product.findUnique({
      where: { id },
      include: { category: true, images: true },
    });
  });
};

export const deleteProduct = async (id: number) => {
  return prisma.product.delete({
    where: { id },
    include: { category: true },
  });
};