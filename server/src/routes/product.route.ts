import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { getAuthParams } from "../controllers/imagekit.controller.js";

// ... other routes


const router = Router();
router.get("/imagekit-auth", getAuthParams);
// Create a new product
router.post("/", productController.createProduct);

// Get all products
router.get("/", productController.getProducts);

// Get a single product by ID
router.get("/:id", productController.getProductById);

// Update a product by ID
router.put("/:id", productController.updateProduct);

// Delete a product by ID
router.delete("/:id", productController.deleteProduct);

export default router;