"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBannerById = exports.getActiveBanners = exports.getAllBanners = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const getAllBanners = async () => {
    return prisma_1.default.banner.findMany({
        orderBy: { displayOrder: 'asc' },
    });
};
exports.getAllBanners = getAllBanners;
const getActiveBanners = async (position) => {
    const whereClause = { isActive: true };
    if (position) {
        whereClause.bannerPosition = position;
    }
    return prisma_1.default.banner.findMany({
        where: whereClause,
        orderBy: { displayOrder: 'asc' },
    });
};
exports.getActiveBanners = getActiveBanners;
const getBannerById = async (id) => {
    return prisma_1.default.banner.findUnique({
        where: { id },
    });
};
exports.getBannerById = getBannerById;
const createBanner = async (data) => {
    return prisma_1.default.banner.create({
        data: {
            ...data,
            isSlider: data.isSlider || false,
            displayOrder: data.displayOrder || 0,
            isActive: data.isActive !== undefined ? data.isActive : true,
        },
    });
};
exports.createBanner = createBanner;
const updateBanner = async (id, data) => {
    return prisma_1.default.banner.update({
        where: { id },
        data,
    });
};
exports.updateBanner = updateBanner;
const deleteBanner = async (id) => {
    return prisma_1.default.banner.delete({
        where: { id },
    });
};
exports.deleteBanner = deleteBanner;
//# sourceMappingURL=banner.service.js.map