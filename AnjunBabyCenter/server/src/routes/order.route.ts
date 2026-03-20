import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { verifyToken, requireAdmin } from "../middlewares/auth.middleware";

import { validateResource } from "../middlewares/validate";
import { createOrderSchema, updateOrderStatusSchema } from "../schemas/order.schema";

const router = Router();

// User endpoints
router.post('/', verifyToken, validateResource(createOrderSchema), orderController.handleCreateOrder);
router.get('/user/:userId', verifyToken, orderController.handleGetUserOrders);
router.get('/:orderId', verifyToken, orderController.handleGetOrderById);
router.post('/:orderId/cancel', verifyToken, orderController.handleCancelOrder);

// Admin endpoints
router.patch('/:orderId/status', verifyToken, requireAdmin, validateResource(updateOrderStatusSchema), orderController.handleUpdateOrderStatus);
router.patch('/:orderId/tracking', verifyToken, requireAdmin, orderController.handleUpdateTrackingId);
router.get('/', verifyToken, requireAdmin, orderController.handleGetAllOrders);

export default router;