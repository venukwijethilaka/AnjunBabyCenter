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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const categoryService = __importStar(require("../services/category.service"));
const handleHttpError = (res, error, defaultMessage) => {
    if (error instanceof Error) {
        if (error.message.includes("not found")) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes("parent") || error.message.includes("sub-categories") || error.message.includes("products")) {
            return res.status(400).json({ message: error.message });
        }
    }
    return res.status(500).json({ message: defaultMessage, error: String(error) });
};
const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({ message: "Category created successfully", data: category });
    }
    catch (error) {
        handleHttpError(res, error, "Error creating category");
    }
};
exports.createCategory = createCategory;
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({ message: "Categories fetched successfully", data: categories });
    }
    catch (error) {
        handleHttpError(res, error, "Error fetching categories");
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category fetched successfully", data: category });
    }
    catch (error) {
        handleHttpError(res, error, "Error fetching category");
    }
};
exports.getCategoryById = getCategoryById;
const updateCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const category = await categoryService.updateCategory(id, req.body);
        res.status(200).json({ message: "Category updated successfully", data: category });
    }
    catch (error) {
        handleHttpError(res, error, "Error updating category");
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await categoryService.deleteCategory(id);
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        handleHttpError(res, error, "Error deleting category");
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map