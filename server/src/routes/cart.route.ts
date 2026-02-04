import express from "express";
import {
  addItemToCart,
  getUserCart,
  deleteCartItem,
  updateCartItemQuantity,
} from "../controllers/cart.controller";

const router = express.Router();

router.post("/", addItemToCart);
router.get("/:userId", getUserCart);
router.put("/:cartItemId", updateCartItemQuantity);
router.delete("/:cartItemId", deleteCartItem);

export default router;
