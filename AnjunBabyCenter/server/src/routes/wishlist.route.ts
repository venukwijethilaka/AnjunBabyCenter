import express from "express";
import {
  addItemToWishlist,
  getUserWishlist,
  deleteWishlistItem,
  deleteWishlistItemByProductAndUser,
  checkWishlistStatus,
} from "../controllers/wishlist.controller";
import { verifyToken } from "../middlewares/auth.middleware";

import { validateResource } from "../middlewares/validate";
import { addToWishlistSchema } from "../schemas/wishlist.schema";

const router = express.Router();

// Add item to wishlist
router.post("/", verifyToken, validateResource(addToWishlistSchema), addItemToWishlist);

// Get user's wishlist
router.get("/:userId", verifyToken, getUserWishlist);

// Check if item is in wishlist
router.get("/:userId/:productId/status", verifyToken, checkWishlistStatus);

// Remove item from wishlist by wishlistId
router.delete("/:wishlistId", verifyToken, deleteWishlistItem);

// Remove item from wishlist by userId and productId
router.delete("/:userId/:productId", verifyToken, deleteWishlistItemByProductAndUser);

export default router;
