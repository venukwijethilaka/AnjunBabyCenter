import prisma from "../../prisma";
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

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      items: { include: { product: { include: { images: true } } } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateOrderStatus = async (orderId: number, status: string, trackingId?: string) => {
  const updateData: any = { status };
  if (status === 'SHIPPING' && trackingId) updateData.trackingId = trackingId;

  return await prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: { items: { include: { product: { include: { images: true } } } } },
  });
};