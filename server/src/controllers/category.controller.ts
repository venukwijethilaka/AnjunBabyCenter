import type { Request, Response } from "express";
import * as cateoryServices from "../services/category.service"

export const createCategory = async (req: Request, res: Response) => {
    try{
        const category = await cateoryServices.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json("error in creating category");
    }
}

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await cateoryServices.getAllCategories();
        res.status(200).json({ message: "Categories fetched successfully", data: categories });
    } catch (error) {
        res.status(500).json({ message: "Error in fetching categories" });
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await cateoryServices.getCategoryById(Number(req.params.id));
        res.status(200).json({ message: "Category fetched successfully", data: category });
    } catch (error) {
        res.status(500).json({ message: "Error in fetching category" });
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const category = await cateoryServices.updateCategory(Number(req.params.id), req.body);
        res.status(200).json({ message: "Category updated successfully", data: category });
    } catch (error) {
        res.status(500).json({ message: "Error in updating category" });
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await cateoryServices.deleteCategory(Number(req.params.id));
        res.status(204).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error in deleting category" });
    }
}