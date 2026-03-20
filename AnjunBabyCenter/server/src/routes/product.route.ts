import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { verifyToken, requireAdmin } from "../middlewares/auth.middleware";

import { validateResource } from "../middlewares/validate";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema";

const router = Router();

// Create a new product (Admin Only)
router.post("/", verifyToken, requireAdmin, validateResource(createProductSchema), productController.createProduct);

// Get all products
router.get("/", productController.getProducts);

// ── Algorithm-Driven Section Routes (must be BEFORE /:id) ──
router.get("/trending", productController.getTrendingProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/flash-sale", productController.getFlashSaleProducts);

// Get a single product by ID
router.get("/:id", productController.getProductById);

// Update a product by ID (full update) (Admin Only)
router.put("/:id", verifyToken, requireAdmin, validateResource(updateProductSchema), productController.updateProduct);

// Toggle availability quickly (PATCH — single field) (Admin Only)
router.patch("/:id/availability", verifyToken, requireAdmin, productController.toggleAvailability);

// Delete a product by ID (Admin Only)
router.delete("/:id", verifyToken, requireAdmin, productController.deleteProduct);

export default router;
