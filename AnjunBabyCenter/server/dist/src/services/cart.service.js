"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuantity = exports.removeFromCart = exports.getCartByUser = exports.addToCart = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const addToCart = async (userId, productId) => {
    try {
        // Validate inputs
        if (!userId || !productId) {
            throw new Error("Invalid userId or productId");
        }
        // Check if user exists first
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error(`User with id ${userId} not found. Please log in again.`);
        }
        // Check if product exists
        const product = await prisma_1.default.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new Error(`Product with id ${productId} not found`);
        }
        // 1. Find or create cart
        let cart = await prisma_1.default.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            cart = await prisma_1.default.cart.create({
                data: { userId },
            });
        }
        // 2. Check if product already in cart
        const existingItem = await prisma_1.default.cartItem.findFirst({
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
                throw new Error(`Cannot add more items. Only ${product.quantity} units available in stock. You already have ${existingItem.quantity} in cart.`);
            }
            return prisma_1.default.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
                include: productWithImageInclude,
            });
        }
        // 4. Otherwise add new item
        return prisma_1.default.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity: 1,
            },
            include: productWithImageInclude, // 👈 Updated to return image on add
        });
    }
    catch (error) {
        console.error("Error in addToCart:", error);
        throw error;
    }
};
exports.addToCart = addToCart;
const getCartByUser = async (userId) => {
    try {
        if (!userId) {
            throw new Error("Invalid userId");
        }
        // Check if user exists
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        return prisma_1.default.cart.findUnique({
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
    }
    catch (error) {
        console.error("Error in getCartByUser:", error);
        throw error;
    }
};
exports.getCartByUser = getCartByUser;
const removeFromCart = async (cartItemId) => {
    try {
        if (!cartItemId) {
            throw new Error("Invalid cartItemId");
        }
        return prisma_1.default.cartItem.delete({
            where: { id: cartItemId },
        });
    }
    catch (error) {
        console.error("Error in removeFromCart:", error);
        throw error;
    }
};
exports.removeFromCart = removeFromCart;
const updateQuantity = async (cartItemId, newQuantity) => {
    try {
        if (!cartItemId || newQuantity < 1) {
            throw new Error("Invalid cartItemId or quantity");
        }
        // Get the cart item and product to check stock
        const cartItem = await prisma_1.default.cartItem.findUnique({
            where: { id: cartItemId },
            include: { product: true },
        });
        if (!cartItem) {
            throw new Error(`Cart item with id ${cartItemId} not found`);
        }
        // Check if requested quantity exceeds available stock
        if (newQuantity > cartItem.product.quantity) {
            throw new Error(`Only ${cartItem.product.quantity} units available in stock. You requested ${newQuantity}`);
        }
        // Update quantity
        return prisma_1.default.cartItem.update({
            where: { id: cartItemId },
            data: { quantity: newQuantity },
            include: { product: true },
        });
    }
    catch (error) {
        console.error("Error in updateQuantity:", error);
        throw error;
    }
};
exports.updateQuantity = updateQuantity;
//# sourceMappingURL=cart.service.js.map