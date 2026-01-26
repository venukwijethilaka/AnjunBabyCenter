import type { Request, Response } from "express";
import * as productService from "../services/product.service.js";

export const createProduct = async (req: Request, res: Response) => {
    try {
        // Validate required fields
        const { name, description, price, quantity, imageUrl, categoryId } = req.body;
        
        if (!name || !description || !price || !imageUrl || !categoryId || quantity === undefined) {
            return res.status(400).json({ 
                message: "Missing required fields: name, description, price, imageUrl, categoryId, quantity" 
            });
        }

        const product = await productService.createProduct({
            name,
            description,
            color: req.body.color,
            size: req.body.size,
            price: req.body.price,
            quantity: req.body.quantity,
            imageUrl: req.body.imageUrl,
            availability: req.body.availability ?? true,
            isFeatured: req.body.isFeatured ?? false,
            isTrending: req.body.isTrending ?? false,
            isFlashSale: req.body.isFlashSale ?? false,
            discountPercentage: req.body.discountPercentage,
            categoryId: req.body.categoryId,
        });

        res.status(201).json({
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error", error });
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
        res.status(500).json({ message: "Failed to fetch products", error });
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
        res.status(500).json({ message: "Error in fetching product by id", error });
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

        const updatedProduct = await productService.updateProduct(id, {
            name: updateData.name,
            description: updateData.description,
            color: updateData.color,
            size: updateData.size,
            price: updateData.price,
            quantity: updateData.quantity,
            imageUrl: updateData.imageUrl,
            availability: updateData.availability,
            isFeatured: updateData.isFeatured,
            isTrending: updateData.isTrending,
            isFlashSale: updateData.isFlashSale,
            discountPercentage: updateData.discountPercentage,
            categoryId: updateData.categoryId,
        });

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product", error });
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
        res.status(500).json({ message: "Failed to delete product", error });
    }
};