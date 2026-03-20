import prisma from "../../prisma";
import { sendEmail } from "./user.service";
import { getOrderStatusEmailHTML } from "../utils/emailTemplates";

export const createOrder = async (userId: number, address: any, items: any[], totalAmount: number) => {
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      status: 'PENDING',
      address,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: { include: { product: { include: { images: true } } } } },
  });

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  return order;
};

export const getUserOrders = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: { include: { images: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getOrderById = async (orderId: number) => {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: { include: { images: true } } } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

export const getAllOrders = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      include: {
        items: { include: { product: { include: { images: true } } } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count()
  ]);

  return { data: orders, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const updateOrderStatus = async (orderId: number, status: string, trackingId?: string) => {
  const updateData: any = { status };

  // Set tracking ID if we are moving to SHIPPING status
  if (status === 'SHIPPING' && trackingId) {
    updateData.trackingId = trackingId;
  }

  // 1. Perform the update and return the order data
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: {
      items: { include: { product: { include: { images: true } } } },
      user: { select: { id: true, name: true, email: true } }
    },
  });

  // 1.5 Send Email Notification
  if (updatedOrder.user && updatedOrder.user.email) {
    await sendEmail(
      updatedOrder.user.email,
      `Order #${updatedOrder.id} Status Update`,
      getOrderStatusEmailHTML(updatedOrder.id, status, trackingId)
    );
  }

  // 2. Award Points ONLY if the status is DELIVERED
  if (status === 'DELIVERED') {
    // Math: 1 point for every 1000 units spent
    // Using Number() ensures totalAmount is treated as a numeric value
    const earnedPoints = Math.floor(Number(updatedOrder.totalAmount) / 1000);

    if (earnedPoints > 0) {
      await prisma.user.update({
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