"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWishlistStatus = exports.deleteWishlistItemByProductAndUser = exports.deleteWishlistItem = exports.getUserWishlist = exports.addItemToWishlist = void 0;
const WishlistService = __importStar(require("../services/wishlist.service"));
const addItemToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        // Validate required fields
        if (!userId || !productId) {
            return res.status(400).json({
                message: "userId and productId are required",
                error: "MISSING_FIELDS",
            });
        }
        const item = await WishlistService.addToWishlist(userId, productId);
        res.status(200).json(item);
    }
    catch (error) {
        console.error("Add to wishlist error:", error);
        res.status(500).json({
            message: "Failed to add item to wishlist",
            error: error?.message || "UNKNOWN_ERROR",
        });
    }
};
exports.addItemToWishlist = addItemToWishlist;
const getUserWishlist = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                message: "Valid userId is required",
                error: "INVALID_USER_ID",
            });
        }
        const wishlist = await WishlistService.getWishlistByUser(userId);
        res.status(200).json(wishlist);
    }
    catch (error) {
        console.error("Get wishlist error:", error);
        res.status(500).json({
            message: "Failed to fetch wishlist",
            error: error?.message || "UNKNOWN_ERROR",
        });
    }
};
exports.getUserWishlist = getUserWishlist;
const deleteWishlistItem = async (req, res) => {
    try {
        const wishlistId = Number(req.params.wishlistId);
        if (!wishlistId || isNaN(wishlistId)) {
            return res.status(400).json({
                message: "Valid wishlistId is required",
                error: "INVALID_WISHLIST_ID",
            });
        }
        const result = await WishlistService.removeFromWishlist(wishlistId);
        res.status(200).json({ message: "Item removed from wishlist", data: result });
    }
    catch (error) {
        console.error("Delete wishlist item error:", error);
        res.status(500).json({
            message: "Failed to remove item from wishlist",
            error: error?.message || "UNKNOWN_ERROR",
        });
    }
};
exports.deleteWishlistItem = deleteWishlistItem;
const deleteWishlistItemByProductAndUser = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const productId = Number(req.params.productId);
        if (!userId || isNaN(userId) || !productId || isNaN(productId)) {
            return res.status(400).json({
                message: "Valid userId and productId are required",
                error: "INVALID_PARAMETERS",
            });
        }
        const result = await WishlistService.removeFromWishlistByProductAndUser(userId, productId);
        res.status(200).json({ message: "Item removed from wishlist", data: result });
    }
    catch (error) {
        console.error("Delete wishlist item error:", error);
        res.status(500).json({
            message: "Failed to remove item from wishlist",
            error: error?.message || "UNKNOWN_ERROR",
        });
    }
};
exports.deleteWishlistItemByProductAndUser = deleteWishlistItemByProductAndUser;
const checkWishlistStatus = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const productId = Number(req.params.productId);
        if (!userId || isNaN(userId) || !productId || isNaN(productId)) {
            return res.status(400).json({
                message: "Valid userId and productId are required",
                error: "INVALID_PARAMETERS",
            });
        }
        const isInWishlist = await WishlistService.checkIfInWishlist(userId, productId);
        res.status(200).json({ isInWishlist });
    }
    catch (error) {
        console.error("Check wishlist status error:", error);
        res.status(500).json({
            message: "Failed to check wishlist status",
            error: error?.message || "UNKNOWN_ERROR",
        });
    }
};
exports.checkWishlistStatus = checkWishlistStatus;
//# sourceMappingURL=wishlist.controller.js.map