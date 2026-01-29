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
        
        images: { url: string; isMain?: boolean; altText?: string }[]; 
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
            availability: data.availability ?? true,
            isFeatured: data.isFeatured ?? false,
            isTrending: data.isTrending ?? false,
            isFlashSale: data.isFlashSale ?? false,
            discountPercentage: data.discountPercentage ?? null,
            // Create the related images
            images: {
                create: data.images, 
            },
            category: {
                connect: { id: data.categoryId },
            },
        },
        include: { category: true, images: true }, // Include images in the response
    });
};

export const getProducts = async () => {
    return prisma.product.findMany({
        include: { 
            category: true, 
            images: true, // Make sure frontend gets the image array
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getProductById = async (id: number) => {
    return prisma.product.findUnique({
        where: { id },
        include: { category: true, images: true },
    });
};export const updateProduct = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    color?: string;
    size?: string;
    price?: Prisma.Decimal;
    quantity?: number;
    images?: { url: string; isMain?: boolean; altText?: string }[];
    availability?: boolean;
    isFeatured?: boolean;
    isTrending?: boolean;
    isFlashSale?: boolean;
    discountPercentage?: Prisma.Decimal;
    categoryId?: number;
  }
) => {
  // 1. Explicitly pull out categoryId so it doesn't stay in 'rest'
  const { images, categoryId, ...rest } = data;

  return prisma.product.update({
    where: { id },
    data: {
      ...rest, // This now safely contains ONLY basic fields
      
      // 2. Handle Images: Wipe and Re-create
      ...(images && {
        images: {
          deleteMany: {},
          create: images.map(img => ({
            url: img.url,
            isMain: img.isMain ?? false,
            altText: img.altText || rest.name || ""
          })),
        },
      }),

      // 3. Handle Category: Use the foreign key directly or the connect syntax
      // If your Prisma schema has the field 'categoryId', it's simpler to just do this:
      ...(categoryId && { categoryId: categoryId }),
    },
    include: { category: true, images: true },
  });
};
export const deleteProduct = async (id: number) => {
    return prisma.product.delete({
        where: { id },
        // Because of 'onDelete: Cascade' in Prisma, images will auto-delete
    });
};