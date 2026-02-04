import type { Request, Response } from "express";
import * as categoryService from "../services/category.service";

const handleHttpError = (res: Response, error: unknown, defaultMessage: string) => {
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

export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({ message: "Category created successfully", data: category });
    } catch (error) {
        handleHttpError(res, error, "Error creating category");
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({ message: "Categories fetched successfully", data: categories });
    } catch (error) {
        handleHttpError(res, error, "Error fetching categories");
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category fetched successfully", data: category });
    } catch (error) {
        handleHttpError(res, error, "Error fetching category");
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const category = await categoryService.updateCategory(id, req.body);
        res.status(200).json({ message: "Category updated successfully", data: category });
    } catch (error) {
        handleHttpError(res, error, "Error updating category");
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await categoryService.deleteCategory(id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        handleHttpError(res, error, "Error deleting category");
    }
};