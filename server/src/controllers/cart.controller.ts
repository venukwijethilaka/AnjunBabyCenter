import type { Request, Response } from "express";
import * as CartService from "../services/cart.service";

export const addItemToCart = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('Add to cart error:', error);
    res.status(400).json({ 
      message: error?.message || "UNKNOWN_ERROR"
    });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      message: "Failed to fetch cart",
      error: error?.message || "UNKNOWN_ERROR"
    });
  }
};

export const updateCartItemQuantity = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('Update quantity error:', error);
    res.status(500).json({ 
      message: "Failed to update quantity",
      error: error?.message || "UNKNOWN_ERROR"
    });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ 
      message: "Failed to remove item from cart",
      error: error?.message || "UNKNOWN_ERROR"
    });
  }
};
