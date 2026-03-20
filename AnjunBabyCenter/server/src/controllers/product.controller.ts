import type { Request, Response } from "express";
import * as productService from "../services/product.service";

export const createProduct = async (req: Request, res: Response) => {
    try {
        // The service layer now expects the full body which includes the images array.
        // The Prisma schema will validate the required fields.
        const product = await productService.createProduct(req.body);

        res.status(201).json({
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        // Handle potential validation errors from Prisma
        if (error instanceof Error && error.message.includes('validation')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};

export const getProducts = async (_req: Request, res: Response) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json({
            message: "Products fetched successfully",
            data: products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products. Please try again later." });
    }
};

// ─── Algorithm-Driven Section Endpoints ────────────────────────────────

export const getTrendingProducts = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 8;
        const days = Number(req.query.days) || 14;
        const products = await productService.getTrendingProducts(limit, days);
        res.status(200).json({ message: "Trending products", data: products });
    } catch (error) {
        console.error("Error fetching trending products:", error);
        res.status(500).json({ message: "Failed to fetch trending products. Please try again later." });
    }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 8;
        const days = Number(req.query.days) || 30;
        const products = await productService.getFeaturedProducts(limit, days);
        res.status(200).json({ message: "Featured products", data: products });
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({ message: "Failed to fetch featured products. Please try again later." });
    }
};

export const getFlashSaleProducts = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 8;
        const products = await productService.getFlashSaleProducts(limit);
        res.status(200).json({ message: "Flash sale products", data: products });
    } catch (error) {
        console.error("Error fetching flash sale products:", error);
        res.status(500).json({ message: "Failed to fetch flash sale products. Please try again later." });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            data: product,
        });
    } catch (error) {
        console.error("Error fetching product by id:", error);
        res.status(500).json({ message: "Failed to fetch product by id. Please try again later." });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Check if product exists
        const existingProduct = await productService.getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Validate that at least some fields are being updated
        const updateData = req.body;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedProduct = await productService.updateProduct(id, updateData);

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product. Please try again later." });
    }
};

export const toggleAvailability = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });

        const existing = await productService.getProductById(id);
        if (!existing) return res.status(404).json({ message: "Product not found" });

        const { availability } = req.body;
        if (typeof availability !== 'boolean') {
            return res.status(400).json({ message: "availability must be a boolean" });
        }

        const updated = await productService.updateProduct(id, { availability });
        res.status(200).json({ message: "Availability updated", data: updated });
    } catch (error) {
        console.error("Error toggling availability:", error);
        res.status(500).json({ message: "Failed to toggle availability. Please try again later." });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Check if product exists
        const existingProduct = await productService.getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const deletedProduct = await productService.deleteProduct(id);

        res.status(200).json({
            message: "Product deleted successfully",
            data: deletedProduct,
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to delete product. Please try again later." });
    }
};