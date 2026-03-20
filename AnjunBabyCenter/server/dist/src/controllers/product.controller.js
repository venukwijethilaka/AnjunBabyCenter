"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.toggleAvailability = exports.updateProduct = exports.getProductById = exports.getFlashSaleProducts = exports.getFeaturedProducts = exports.getTrendingProducts = exports.getProducts = exports.createProduct = void 0;
const productService = __importStar(require("../services/product.service"));
const createProduct = async (req, res) => {
    try {
        // The service layer now expects the full body which includes the images array.
        // The Prisma schema will validate the required fields.
        const product = await productService.createProduct(req.body);
        res.status(201).json({
            message: "Product created successfully",
            data: product,
        });
    }
    catch (error) {
        console.error("Error creating product:", error);
        // Handle potential validation errors from Prisma
        if (error instanceof Error && error.message.includes('validation')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};
exports.createProduct = createProduct;
const getProducts = async (_req, res) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json({
            message: "Products fetched successfully",
            data: products,
        });
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products. Please try again later." });
    }
};
exports.getProducts = getProducts;
// ─── Algorithm-Driven Section Endpoints ────────────────────────────────
const getTrendingProducts = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 8;
        const days = Number(req.query.days) || 14;
        const products = await productService.getTrendingProducts(limit, days);
        res.status(200).json({ message: "Trending products", data: products });
    }
    catch (error) {
        console.error("Error fetching trending products:", error);
        res.status(500).json({ message: "Failed to fetch trending products. Please try again later." });
    }
};
exports.getTrendingProducts = getTrendingProducts;
const getFeaturedProducts = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 8;
        const days = Number(req.query.days) || 30;
        const products = await productService.getFeaturedProducts(limit, days);
        res.status(200).json({ message: "Featured products", data: products });
    }
    catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({ message: "Failed to fetch featured products. Please try again later." });
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
const getFlashSaleProducts = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 8;
        const products = await productService.getFlashSaleProducts(limit);
        res.status(200).json({ message: "Flash sale products", data: products });
    }
    catch (error) {
        console.error("Error fetching flash sale products:", error);
        res.status(500).json({ message: "Failed to fetch flash sale products. Please try again later." });
    }
};
exports.getFlashSaleProducts = getFlashSaleProducts;
const getProductById = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error fetching product by id:", error);
        res.status(500).json({ message: "Failed to fetch product by id. Please try again later." });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product. Please try again later." });
    }
};
exports.updateProduct = updateProduct;
const toggleAvailability = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ message: "Invalid product ID" });
        const existing = await productService.getProductById(id);
        if (!existing)
            return res.status(404).json({ message: "Product not found" });
        const { availability } = req.body;
        if (typeof availability !== 'boolean') {
            return res.status(400).json({ message: "availability must be a boolean" });
        }
        const updated = await productService.updateProduct(id, { availability });
        res.status(200).json({ message: "Availability updated", data: updated });
    }
    catch (error) {
        console.error("Error toggling availability:", error);
        res.status(500).json({ message: "Failed to toggle availability. Please try again later." });
    }
};
exports.toggleAvailability = toggleAvailability;
const deleteProduct = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to delete product. Please try again later." });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.controller.js.map