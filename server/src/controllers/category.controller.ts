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