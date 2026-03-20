import type { Request, Response } from "express";
import * as WishlistService from "../services/wishlist.service";

export const addItemToWishlist = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error("Add to wishlist error:", error);
    res.status(400).json({
      message: error?.message || "Failed to add item to wishlist",
    });
  }
};

export const getUserWishlist = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error("Get wishlist error:", error);
    res.status(400).json({
      message: error?.message || "Failed to fetch wishlist",
    });
  }
};

export const deleteWishlistItem = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error("Delete wishlist item error:", error);
    res.status(400).json({
      message: error?.message || "Failed to remove item from wishlist",
    });
  }
};

export const deleteWishlistItemByProductAndUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);
    const productId = Number(req.params.productId);

    if (!userId || isNaN(userId) || !productId || isNaN(productId)) {
      return res.status(400).json({
        message: "Valid userId and productId are required",
        error: "INVALID_PARAMETERS",
      });
    }

    const result = await WishlistService.removeFromWishlistByProductAndUser(
      userId,
      productId
    );
    res.status(200).json({ message: "Item removed from wishlist", data: result });
  } catch (error: any) {
    console.error("Delete wishlist item error:", error);
    res.status(400).json({
      message: error?.message || "Failed to remove item from wishlist",
    });
  }
};

export const checkWishlistStatus = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const productId = Number(req.params.productId);

    if (!userId || isNaN(userId) || !productId || isNaN(productId)) {
      return res.status(400).json({
        message: "Valid userId and productId are required",
        error: "INVALID_PARAMETERS",
      });
    }

    const isInWishlist = await WishlistService.checkIfInWishlist(
      userId,
      productId
    );
    res.status(200).json({ isInWishlist });
  } catch (error: any) {
    console.error("Check wishlist status error:", error);
    res.status(400).json({
      message: error?.message || "Failed to check wishlist status",
    });
  }
};
