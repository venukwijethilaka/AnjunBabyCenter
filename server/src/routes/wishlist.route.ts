import express from "express";
import {
  addItemToWishlist,
  getUserWishlist,
  deleteWishlistItem,
  deleteWishlistItemByProductAndUser,
  checkWishlistStatus,
} from "../controllers/wishlist.controller";

const router = express.Router();

// Add item to wishlist
router.post("/", addItemToWishlist);

// Get user's wishlist
router.get("/:userId", getUserWishlist);

// Check if item is in wishlist
router.get("/:userId/:productId/status", checkWishlistStatus);

// Remove item from wishlist by wishlistId
router.delete("/:wishlistId", deleteWishlistItem);

// Remove item from wishlist by userId and productId
router.delete("/:userId/:productId", deleteWishlistItemByProductAndUser);

export default router;
