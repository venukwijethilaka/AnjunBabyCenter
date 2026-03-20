import express from 'express';
import * as offerController from '../controllers/offer.controller';
import { verifyToken, requireAdmin } from "../middlewares/auth.middleware";

import { validateResource } from "../middlewares/validate";
import { createOfferSchema, updateOfferSchema } from "../schemas/offer.schema";

const router = express.Router();

router.get('/', offerController.getAllOffers);
router.get('/active', offerController.getActiveOffer); // MUST be above /:id
router.post('/', verifyToken, requireAdmin, validateResource(createOfferSchema), offerController.createOffer);
router.put('/:id', verifyToken, requireAdmin, validateResource(updateOfferSchema), offerController.updateOffer);
router.delete('/:id', verifyToken, requireAdmin, offerController.deleteOffer);

export default router;