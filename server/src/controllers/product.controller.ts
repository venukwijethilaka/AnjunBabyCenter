import type { Request, Response } from "express";
import * as productService from "../services/product.service.js";
export const createProduct = async (req: Request, res: Response) => {
    try {
        
        const { name, description, price, quantity, images, categoryId } = req.body;
        
        // 2. Update the validation check
        if (!name || !description || !price || !images || !images.length || !categoryId || quantity === undefined) {
            return res.status(400).json({ 
                message: "Missing required fields: name, description, price, images (array), categoryId, quantity" 
            });
        }

        // 3. Pass 'images' to the service
        const product = await productService.createProduct({
            name,
            description,
            color: req.body.color,
            size: req.body.size,
            price: req.body.price,
            quantity: req.body.quantity,
            images: req.body.images, // Now passing the array
            availability: req.body.availability ?? true,
            isFeatured: req.body.isFeatured ?? false,
            isTrending: req.body.isTrending ?? false,
            isFlashSale: req.body.isFlashSale ?? false,
            discountPercentage: req.body.discountPercentage,
            categoryId: Number(req.body.categoryId),
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

        const updateData = req.body.data || req.body; 

        const existingProduct = await productService.getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // We cast the entire object to 'any' to bypass strict property checks
        const updatedProduct = await productService.updateProduct(id, {
            name: updateData.name,
            description: updateData.description,
            color: updateData.color || null,
            size: updateData.size || null,
            price: updateData.price !== undefined ? Number(updateData.price) : undefined,
            quantity: updateData.quantity !== undefined ? Number(updateData.quantity) : undefined,
            images: updateData.images,
            availability: updateData.availability,
            isFeatured: updateData.isFeatured,
            isTrending: updateData.isTrending,
            isFlashSale: updateData.isFlashSale,
            discountPercentage: updateData.discountPercentage !== undefined ? Number(updateData.discountPercentage) : undefined,
            categoryId: updateData.categoryId ? Number(updateData.categoryId) : undefined,
        } as any); 

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error: any) {
        console.error("Error updating product:", error);
        res.status(500).json({ 
            message: error.message || "Failed to update product", 
            error: process.env.NODE_ENV === 'development' ? error : undefined 
        });
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