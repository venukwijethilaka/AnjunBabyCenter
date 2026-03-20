"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfInWishlist = exports.removeFromWishlistByProductAndUser = exports.removeFromWishlist = exports.getWishlistByUser = exports.addToWishlist = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const addToWishlist = async (userId, productId) => {
    try {
        // Validate inputs
        if (!userId || !productId) {
            throw new Error("Invalid userId or productId");
        }
        // Check if user exists
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
        // Check if already in wishlist
        const existingWishlistItem = await prisma_1.default.wishlist.findFirst({
            where: {
                userId,
                productId,
            },
        });
        if (existingWishlistItem) {
            throw new Error("Product is already in your wishlist");
        }
        // Add to wishlist
        return prisma_1.default.wishlist.create({
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
    }
    catch (error) {
        console.error("Error in addToWishlist:", error);
        throw error;
    }
};
exports.addToWishlist = addToWishlist;
const getWishlistByUser = async (userId) => {
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
        // Get all wishlist items for user
        const wishlistItems = await prisma_1.default.wishlist.findMany({
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
    }
    catch (error) {
        console.error("Error in getWishlistByUser:", error);
        throw error;
    }
};
exports.getWishlistByUser = getWishlistByUser;
const removeFromWishlist = async (wishlistId) => {
    try {
        if (!wishlistId) {
            throw new Error("Invalid wishlistId");
        }
        return prisma_1.default.wishlist.delete({
            where: { id: wishlistId },
        });
    }
    catch (error) {
        console.error("Error in removeFromWishlist:", error);
        throw error;
    }
};
exports.removeFromWishlist = removeFromWishlist;
const removeFromWishlistByProductAndUser = async (userId, productId) => {
    try {
        if (!userId || !productId) {
            throw new Error("Invalid userId or productId");
        }
        const wishlistItem = await prisma_1.default.wishlist.findFirst({
            where: {
                userId,
                productId,
            },
        });
        if (!wishlistItem) {
            throw new Error("Item not found in wishlist");
        }
        return prisma_1.default.wishlist.delete({
            where: { id: wishlistItem.id },
        });
    }
    catch (error) {
        console.error("Error in removeFromWishlistByProductAndUser:", error);
        throw error;
    }
};
exports.removeFromWishlistByProductAndUser = removeFromWishlistByProductAndUser;
const checkIfInWishlist = async (userId, productId) => {
    try {
        if (!userId || !productId) {
            throw new Error("Invalid userId or productId");
        }
        const wishlistItem = await prisma_1.default.wishlist.findFirst({
            where: {
                userId,
                productId,
            },
        });
        return !!wishlistItem;
    }
    catch (error) {
        console.error("Error in checkIfInWishlist:", error);
        throw error;
    }
};
exports.checkIfInWishlist = checkIfInWishlist;
//# sourceMappingURL=wishlist.service.js.map