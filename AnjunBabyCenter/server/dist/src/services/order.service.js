"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getOrderById = exports.getUserOrders = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const createOrder = async (userId, address, items, totalAmount) => {
    const order = await prisma_1.default.order.create({
        data: {
            userId,
            totalAmount,
            status: 'PENDING',
            address,
            items: {
                create: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
        include: { items: { include: { product: { include: { images: true } } } } },
    });
    const cart = await prisma_1.default.cart.findUnique({ where: { userId } });
    if (cart) {
        await prisma_1.default.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return order;
};
exports.createOrder = createOrder;
const getUserOrders = async (userId) => {
    return await prisma_1.default.order.findMany({
        where: { userId },
        include: { items: { include: { product: { include: { images: true } } } } },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getUserOrders = getUserOrders;
const getOrderById = async (orderId) => {
    return await prisma_1.default.order.findUnique({
        where: { id: orderId },
        include: {
            items: { include: { product: { include: { images: true } } } },
            user: { select: { id: true, name: true, email: true } },
        },
    });
};
exports.getOrderById = getOrderById;
const getAllOrders = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
        prisma_1.default.order.findMany({
            skip,
            take: limit,
            include: {
                items: { include: { product: { include: { images: true } } } },
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma_1.default.order.count()
    ]);
    return { data: orders, total, page, limit, totalPages: Math.ceil(total / limit) };
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (orderId, status, trackingId) => {
    const updateData = { status };
    // Set tracking ID if we are moving to SHIPPING status
    if (status === 'SHIPPING' && trackingId) {
        updateData.trackingId = trackingId;
    }
    // 1. Perform the update and return the order data
    const updatedOrder = await prisma_1.default.order.update({
        where: { id: orderId },
        data: updateData,
        include: { items: { include: { product: { include: { images: true } } } } },
    });
    // 2. Award Points ONLY if the status is DELIVERED
    if (status === 'DELIVERED') {
        // Math: 1 point for every 1000 units spent
        // Using Number() ensures totalAmount is treated as a numeric value
        const earnedPoints = Math.floor(Number(updatedOrder.totalAmount) / 1000);
        if (earnedPoints > 0) {
            await prisma_1.default.user.update({
                where: { id: updatedOrder.userId },
                data: {
                    loyaltyPoints: {
                        increment: earnedPoints
                    }
                }
            });
            console.log(`User ${updatedOrder.userId} earned ${earnedPoints} loyalty points.`);
        }
    }
    return updatedOrder;
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.service.js.map