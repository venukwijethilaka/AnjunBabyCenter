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
const express_1 = require("express");
const productController = __importStar(require("../controllers/product.controller.js"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Create a new product (Admin Only)
router.post("/", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, productController.createProduct);
// Get all products
router.get("/", productController.getProducts);
// ── Algorithm-Driven Section Routes (must be BEFORE /:id) ──
router.get("/trending", productController.getTrendingProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/flash-sale", productController.getFlashSaleProducts);
// Get a single product by ID
router.get("/:id", productController.getProductById);
// Update a product by ID (full update) (Admin Only)
router.put("/:id", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, productController.updateProduct);
// Toggle availability quickly (PATCH — single field) (Admin Only)
router.patch("/:id/availability", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, productController.toggleAvailability);
// Delete a product by ID (Admin Only)
router.delete("/:id", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, productController.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.route.js.map