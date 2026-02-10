import { Router } from 'express';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.post('/', orderController.handleCreateOrder);
router.get('/user/:userId', orderController.handleGetUserOrders);
router.get('/:orderId', orderController.handleGetOrderById);
router.post('/:orderId/cancel', orderController.handleCancelOrder);
router.patch('/:orderId/status', orderController.handleUpdateOrderStatus);
router.patch('/:orderId/tracking', orderController.handleUpdateTrackingId);
router.get('/', orderController.handleGetAllOrders);
// ... add other routes here

export default router;