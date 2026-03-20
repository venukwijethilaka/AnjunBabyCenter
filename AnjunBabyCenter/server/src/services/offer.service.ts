import prisma from "../../prisma";

export const getAllOffers = async (includeAll = false) => {
  if (includeAll) {
    return prisma.promotionalOffer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: { include: { images: true } } }
    });
  }
  return prisma.promotionalOffer.findMany({
    where: { isActive: true, endDate: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
    include: { product: { include: { images: true } } }
  });
};

export const getActiveOffer = async () => {
  // Finds the first active offer that hasn't expired yet
  return prisma.promotionalOffer.findFirst({
    where: {
      isActive: true,
      endDate: { gt: new Date() } // Ensures the offer hasn't expired
    },
    include: {
      product: {
        include: { images: true }
      }
    }
  });
};

export const createOffer = async (data: any) => {
  return prisma.promotionalOffer.create({
    data: {
      title: data.title,
      description: data.description,
      offerPrice: data.offerPrice,
      endDate: new Date(data.endDate),
      isActive: data.isActive !== undefined ? data.isActive : true,
      productId: data.productId,
    },
  });
};

export const updateOffer = async (id: number, data: any) => {
  return prisma.promotionalOffer.update({
    where: { id },
    data: {
      ...data,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
};

export const deleteOffer = async (id: number) => {
  return prisma.promotionalOffer.delete({
    where: { id },
  });
};