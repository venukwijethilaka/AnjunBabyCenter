import prisma from "../../prisma";

export const getAllBanners = async () => {
  return prisma.banner.findMany({
    orderBy: { displayOrder: 'asc' },
  });
};

export const getActiveBanners = async (position?: string) => {
  const whereClause: any = { isActive: true };
  if (position) {
    whereClause.bannerPosition = position;
  }
  return prisma.banner.findMany({
    where: whereClause,
    orderBy: { displayOrder: 'asc' },
  });
};

export const getBannerById = async (id: number) => {
  return prisma.banner.findUnique({
    where: { id },
  });
};

export const createBanner = async (data: any) => {
  return prisma.banner.create({
    data: {
      ...data,
      isSlider: data.isSlider || false,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

export const updateBanner = async (id: number, data: any) => {
  return prisma.banner.update({
    where: { id },
    data,
  });
};

export const deleteBanner = async (id: number) => {
  return prisma.banner.delete({
    where: { id },
  });
};