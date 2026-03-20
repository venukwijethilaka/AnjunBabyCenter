import { Router } from "express";
import { getAuthParams } from "../controllers/imagekit.controller";

const router = Router();

router.get("/auth", getAuthParams);

export default router;
