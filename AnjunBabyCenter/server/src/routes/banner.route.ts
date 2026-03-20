import express from 'express';
import * as bannerController from '../controllers/banner.controller';
import { getAuthParams } from '../controllers/imagekit.controller';
import { verifyToken, requireAdmin } from "../middlewares/auth.middleware";

import { validateResource } from "../middlewares/validate";
import { createBannerSchema, updateBannerSchema } from "../schemas/banner.schema";

const router = express.Router();

// Banner Management
router.get('/', bannerController.getBanners);
router.get('/active', bannerController.getActiveBanners);
router.get('/:id', bannerController.getBannerById);
router.post('/', verifyToken, requireAdmin, validateResource(createBannerSchema), bannerController.createBanner);
router.patch('/:id', verifyToken, requireAdmin, validateResource(updateBannerSchema), bannerController.updateBanner);
router.delete('/:id', verifyToken, requireAdmin, bannerController.deleteBanner);

// ImageKit Auth (Admin Only for file uploads)
router.get('/imagekit/auth', verifyToken, requireAdmin, getAuthParams);

export default router;