import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { verifyToken } from "../middlewares/auth.middleware";

import { validateResource } from "../middlewares/validate";
import { addToCartSchema, updateCartItemSchema } from "../schemas/cart.schema";

const router = Router();

router.post("/", verifyToken, validateResource(addToCartSchema), cartController.addItemToCart);
router.get("/:userId", verifyToken, cartController.getUserCart);
router.patch("/:cartItemId", verifyToken, validateResource(updateCartItemSchema), cartController.updateCartItemQuantity);
router.delete("/:cartItemId", verifyToken, cartController.deleteCartItem);

export default router;
