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