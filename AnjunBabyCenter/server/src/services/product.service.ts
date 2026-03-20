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

// ─── Algorithm-Driven Section Queries ───────────────────────────────────────

/** Trending: most ordered products in the last N days */
export const getTrendingProducts = async (limit = 8, days = 14) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Sum quantities sold per product within the window
  const orderTotals = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: { order: { createdAt: { gte: since } } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: limit * 3, // fetch extra to filter unavailable
  });

  if (orderTotals.length === 0) {
    // Fallback: newest available products when there's no sales data yet
    return prisma.product.findMany({
      where: { availability: true },
      select: {
        id: true,
        name: true,
        price: true,
        discountPercentage: true,
        availability: true,
        categoryId: true,
        createdAt: true,
        category: true,
        images: true,
        color: true,
        size: true,
        quantity: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  const productIds = orderTotals.map(o => o.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, availability: true },
    select: {
      id: true,
      name: true,
      price: true,
      discountPercentage: true,
      availability: true,
      categoryId: true,
      createdAt: true,
      category: true,
      images: true,
      promotionalOffers: { where: { isActive: true, endDate: { gte: new Date() } } },
      color: true,
      size: true,
      quantity: true,
    },
  });

  // Re-sort by sales rank and attach order count
  return productIds
    .map(id => {
      const p = products.find(p => p.id === id);
      const total = orderTotals.find(o => o.productId === id)?._sum?.quantity ?? 0;
      return p ? { ...p, _orderCount: total } : null;
    })
    .filter(Boolean)
    .slice(0, limit) as (typeof products[0] & { _orderCount: number })[];
};

/** Featured: newest products (last 30 days) sorted by wishlist saves */
export const getFeaturedProducts = async (limit = 8, days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const recent = await prisma.product.findMany({
    where: { createdAt: { gte: since }, availability: true },
    select: {
      id: true,
      name: true,
      price: true,
      discountPercentage: true,
      availability: true,
      categoryId: true,
      createdAt: true,
      category: true,
      images: true,
      wishlist: true,
      promotionalOffers: { where: { isActive: true, endDate: { gte: new Date() } } },
      color: true,
      size: true,
      quantity: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (recent.length >= limit) {
    // Sort featured by wishlist saves (popularity)
    return [...recent]
      .sort((a, b) => b.wishlist.length - a.wishlist.length)
      .slice(0, limit);
  }

  // Fallback: fill remaining slots with most wishlisted products of all time
  const existingIds = recent.map(p => p.id);
  const popular = await prisma.product.findMany({
    where: { id: { notIn: existingIds }, availability: true },
    select: {
      id: true,
      name: true,
      price: true,
      discountPercentage: true,
      availability: true,
      categoryId: true,
      createdAt: true,
      category: true,
      images: true,
      wishlist: true,
      promotionalOffers: { where: { isActive: true, endDate: { gte: new Date() } } },
      color: true,
      size: true,
      quantity: true,
    },
  });
  const sortedPopular = popular
    .sort((a, b) => b.wishlist.length - a.wishlist.length)
    .slice(0, limit - recent.length);

  return [...recent, ...sortedPopular];
};

/** Flash Sale: products with an active, non-expired PromotionalOffer */
export const getFlashSaleProducts = async (limit = 8) => {
  const offers = await prisma.promotionalOffer.findMany({
    where: { isActive: true, endDate: { gte: new Date() } },
    include: {
      product: {
        include: { category: true, images: true },
      },
    },
    orderBy: { endDate: 'asc' }, // soonest expiry first (urgency)
    take: limit,
  });

  return offers
    .filter(o => o.product.availability)
    .map(o => ({
      ...o.product,
      _offerPrice: Number(o.offerPrice),
      _offerEndDate: o.endDate,
      _offerId: o.id,
    }));
};

export const getProducts = async () => {
  return prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      discountPercentage: true,
      availability: true,
      categoryId: true,
      createdAt: true,
      category: true,
      images: true,
      color: true,
      size: true,
      quantity: true,
    },
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