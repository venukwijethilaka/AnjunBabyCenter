import express from 'express';
import * as bannerController from '../controllers/banner.controller';
import { getAuthParams } from '../controllers/imagekit.controller'; // Using your existing controller

const router = express.Router();

// Banner Management
router.get('/', bannerController.getBanners);
router.get('/active', bannerController.getActiveBanners);
router.get('/:id', bannerController.getBannerById);
router.post('/', bannerController.createBanner);
router.patch('/:id', bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

// ImageKit Auth (Shared logic)
router.get('/imagekit/auth', getAuthParams);

export default router;