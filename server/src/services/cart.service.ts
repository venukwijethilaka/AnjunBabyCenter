import prisma from "../../prisma";

export const addToCart = async (
  userId: number,
  productId: number
) => {
  try {
    // Validate inputs
    if (!userId || !productId) {
      throw new Error("Invalid userId or productId");
    }

    // Check if user exists first
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

    // 1. Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // 2. Check if product already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    // We define the image include logic here so we can reuse it
    const productWithImageInclude = {
      product: {
        include: {
          images: {
            where: { isMain: true },
            take: 1
          }
        }
      }
    };

    // 3. Increase quantity if exists (but check stock first)
    if (existingItem) {
      // Check if the new quantity would exceed available stock
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.quantity) {
        throw new Error(
          `Cannot add more items. Only ${product.quantity} units available in stock. You already have ${existingItem.quantity} in cart.`
        );
      }
      
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: productWithImageInclude,
      });
    }

    // 4. Otherwise add new item
    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
      include: productWithImageInclude, // 👈 Updated to return image on add
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error;
  }
};

export const getCartByUser = async (userId: number) => {
  try {
    if (!userId) {
      throw new Error("Invalid userId");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                // 👇 THIS IS THE NEW PART 👇
                images: {
                  where: { isMain: true }, // Only fetch the thumbnail
                  take: 1 // We only need one image
                }
              }
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in getCartByUser:", error);
    throw error;
  }
};

export const removeFromCart = async (cartItemId: number) => {
  try {
    if (!cartItemId) {
      throw new Error("Invalid cartItemId");
    }

    return prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    throw error;
  }
};

export const updateQuantity = async (cartItemId: number, newQuantity: number) => {
  try {
    if (!cartItemId || newQuantity < 1) {
      throw new Error("Invalid cartItemId or quantity");
    }

    // Get the cart item and product to check stock
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });

    if (!cartItem) {
      throw new Error(`Cart item with id ${cartItemId} not found`);
    }

    // Check if requested quantity exceeds available stock
    if (newQuantity > cartItem.product.quantity) {
      throw new Error(
        `Only ${cartItem.product.quantity} units available in stock. You requested ${newQuantity}`
      );
    }

    // Update quantity
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity },
      include: { product: true },
    });
  } catch (error) {
    console.error("Error in updateQuantity:", error);
    throw error;
  }
};