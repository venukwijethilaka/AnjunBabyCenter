import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { verifyToken, requireAdmin } from "../middlewares/auth.middleware";

import { validateResource } from "../middlewares/validate";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";

const router = Router();

router.post("/", verifyToken, requireAdmin, validateResource(createCategorySchema), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", verifyToken, requireAdmin, validateResource(updateCategorySchema), categoryController.updateCategory);
router.delete("/:id", verifyToken, requireAdmin, categoryController.deleteCategory);


export default router;