import prisma from "../../prisma";

export const addToWishlist = async (
  userId: number,
  productId: number
) => {
  try {
    // Validate inputs
    if (!userId || !productId) {
      throw new Error("Invalid userId or productId");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found. Please log in again.`);
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    // Check if already in wishlist
    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingWishlistItem) {
      throw new Error("Product is already in your wishlist");
    }

    // Add to wishlist
    return prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    throw error;
  }
};

export const getWishlistByUser = async (userId: number) => {
  try {
    if (!userId) {
      throw new Error("Invalid userId");
    }

    // Get all wishlist items for user
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      userId,
      items: wishlistItems,
      count: wishlistItems.length,
    };
  } catch (error) {
    console.error("Error in getWishlistByUser:", error);
    throw error;
  }
};

export const removeFromWishlist = async (wishlistId: number) => {
  try {
    if (!wishlistId) {
      throw new Error("Invalid wishlistId");
    }

    return prisma.wishlist.delete({
      where: { id: wishlistId },
    });
  } catch (error) {
    console.error("Error in removeFromWishlist:", error);
    throw error;
  }
};

export const removeFromWishlistByProductAndUser = async (
  userId: number,
  productId: number
) => {
  try {
    if (!userId || !productId) {
      throw new Error("Invalid userId or productId");
    }

    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!wishlistItem) {
      throw new Error("Item not found in wishlist");
    }

    return prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });
  } catch (error) {
    console.error("Error in removeFromWishlistByProductAndUser:", error);
    throw error;
  }
};

export const checkIfInWishlist = async (
  userId: number,
  productId: number
) => {
  try {
    if (!userId || !productId) {
      throw new Error("Invalid userId or productId");
    }

    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    return !!wishlistItem;
  } catch (error) {
    console.error("Error in checkIfInWishlist:", error);
    throw error;
  }
};
