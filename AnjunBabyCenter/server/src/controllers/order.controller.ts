import type { Request, Response } from "express";
import * as orderService from '../services/order.service';

export const handleUpdateTrackingId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { trackingId } = req.body;
    if (typeof orderId !== 'string' || !trackingId) {
      return res.status(400).json({ message: 'Order ID and trackingId are required' });
    }
    const updatedOrder = await orderService.updateOrderStatus(parseInt(orderId), 'SHIPPING', trackingId);
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update tracking ID' });
  }
};
export const handleUpdateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, trackingId } = req.body;

    if (typeof orderId !== 'string' || !status) {
      return res.status(400).json({ message: 'Order ID and status are required' });
    }

    // This call now handles the loyalty points automatically inside the service
    const updatedOrder = await orderService.updateOrderStatus(parseInt(orderId), status, trackingId);
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

export const handleCreateOrder = async (req: Request, res: Response) => {
  try {
    const { userId, address, items, totalAmount } = req.body;
    if (!userId || !address || !items || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const order = await orderService.createOrder(userId, address, items, totalAmount);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const handleGetUserOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Safety check: Ensure userId exists and is a string
    if (typeof userId !== 'string') {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const orders = await orderService.getUserOrders(parseInt(userId));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const handleGetOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    // Safety check: Fixes "string | undefined" error
    if (typeof orderId !== 'string') {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await orderService.getOrderById(parseInt(orderId));
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

export const handleCancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    if (typeof orderId !== 'string') {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    // Optionally: check user permissions here
    const cancelledOrder = await orderService.updateOrderStatus(parseInt(orderId), 'CANCELLED');
    res.json(cancelledOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};

export const handleGetAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const orders = await orderService.getAllOrders(page, limit);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
};