"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetAllOrders = exports.handleCancelOrder = exports.handleGetOrderById = exports.handleGetUserOrders = exports.handleCreateOrder = exports.handleUpdateOrderStatus = exports.handleUpdateTrackingId = void 0;
const orderService = __importStar(require("../services/order.service"));
const handleUpdateTrackingId = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { trackingId } = req.body;
        if (typeof orderId !== 'string' || !trackingId) {
            return res.status(400).json({ message: 'Order ID and trackingId are required' });
        }
        const updatedOrder = await orderService.updateOrderStatus(parseInt(orderId), 'SHIPPING', trackingId);
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update tracking ID' });
    }
};
exports.handleUpdateTrackingId = handleUpdateTrackingId;
const handleUpdateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, trackingId } = req.body;
        if (typeof orderId !== 'string' || !status) {
            return res.status(400).json({ message: 'Order ID and status are required' });
        }
        // This call now handles the loyalty points automatically inside the service
        const updatedOrder = await orderService.updateOrderStatus(parseInt(orderId), status, trackingId);
        res.json(updatedOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};
exports.handleUpdateOrderStatus = handleUpdateOrderStatus;
const handleCreateOrder = async (req, res) => {
    try {
        const { userId, address, items, totalAmount } = req.body;
        if (!userId || !address || !items || !totalAmount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const order = await orderService.createOrder(userId, address, items, totalAmount);
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create order' });
    }
};
exports.handleCreateOrder = handleCreateOrder;
const handleGetUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        // Safety check: Ensure userId exists and is a string
        if (typeof userId !== 'string') {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const orders = await orderService.getUserOrders(parseInt(userId));
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};
exports.handleGetUserOrders = handleGetUserOrders;
const handleGetOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        // Safety check: Fixes "string | undefined" error
        if (typeof orderId !== 'string') {
            return res.status(400).json({ message: 'Order ID is required' });
        }
        const order = await orderService.getOrderById(parseInt(orderId));
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch order' });
    }
};
exports.handleGetOrderById = handleGetOrderById;
const handleCancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (typeof orderId !== 'string') {
            return res.status(400).json({ message: 'Order ID is required' });
        }
        // Optionally: check user permissions here
        const cancelledOrder = await orderService.updateOrderStatus(parseInt(orderId), 'CANCELLED');
        res.json(cancelledOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to cancel order' });
    }
};
exports.handleCancelOrder = handleCancelOrder;
const handleGetAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const orders = await orderService.getAllOrders(page, limit);
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch all orders' });
    }
};
exports.handleGetAllOrders = handleGetAllOrders;
//# sourceMappingURL=order.controller.js.map