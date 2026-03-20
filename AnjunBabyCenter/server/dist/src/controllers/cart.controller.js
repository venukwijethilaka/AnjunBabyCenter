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
exports.deleteCartItem = exports.updateCartItemQuantity = exports.getUserCart = exports.addItemToCart = void 0;
const CartService = __importStar(require("../services/cart.service"));
const addItemToCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        // Validate required fields
        if (!userId || !productId) {
            return res.status(400).json({
                message: "userId and productId are required",
                error: "MISSING_FIELDS"
            });
        }
        const item = await CartService.addToCart(userId, productId);
        res.status(200).json(item);
    }
    catch (error) {
        console.error('Add to cart error:', error);
        res.status(400).json({
            message: error?.message || "UNKNOWN_ERROR"
        });
    }
};
exports.addItemToCart = addItemToCart;
const getUserCart = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                message: "Valid userId is required",
                error: "INVALID_USER_ID"
            });
        }
        const cart = await CartService.getCartByUser(userId);
        res.status(200).json(cart);
    }
    catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            message: "Failed to fetch cart",
            error: error?.message || "UNKNOWN_ERROR"
        });
    }
};
exports.getUserCart = getUserCart;
const updateCartItemQuantity = async (req, res) => {
    try {
        const cartItemId = Number(req.params.cartItemId);
        const { quantity } = req.body;
        if (!cartItemId || isNaN(cartItemId)) {
            return res.status(400).json({
                message: "Valid cartItemId is required",
                error: "INVALID_CART_ITEM_ID"
            });
        }
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1",
                error: "INVALID_QUANTITY"
            });
        }
        const result = await CartService.updateQuantity(cartItemId, quantity);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Update quantity error:', error);
        res.status(500).json({
            message: "Failed to update quantity",
            error: error?.message || "UNKNOWN_ERROR"
        });
    }
};
exports.updateCartItemQuantity = updateCartItemQuantity;
const deleteCartItem = async (req, res) => {
    try {
        const cartItemId = Number(req.params.cartItemId);
        if (!cartItemId || isNaN(cartItemId)) {
            return res.status(400).json({
                message: "Valid cartItemId is required",
                error: "INVALID_CART_ITEM_ID"
            });
        }
        const result = await CartService.removeFromCart(cartItemId);
        res.status(200).json({ message: "Item removed from cart", data: result });
    }
    catch (error) {
        console.error('Delete cart item error:', error);
        res.status(500).json({
            message: "Failed to remove item from cart",
            error: error?.message || "UNKNOWN_ERROR"
        });
    }
};
exports.deleteCartItem = deleteCartItem;
//# sourceMappingURL=cart.controller.js.map