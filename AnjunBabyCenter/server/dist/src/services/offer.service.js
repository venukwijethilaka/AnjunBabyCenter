"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOffer = exports.updateOffer = exports.createOffer = exports.getActiveOffer = exports.getAllOffers = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const getAllOffers = async (includeAll = false) => {
    if (includeAll) {
        return prisma_1.default.promotionalOffer.findMany({
            orderBy: { createdAt: 'desc' },
            include: { product: { include: { images: true } } }
        });
    }
    return prisma_1.default.promotionalOffer.findMany({
        where: { isActive: true, endDate: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
        include: { product: { include: { images: true } } }
    });
};
exports.getAllOffers = getAllOffers;
const getActiveOffer = async () => {
    // Finds the first active offer that hasn't expired yet
    return prisma_1.default.promotionalOffer.findFirst({
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
exports.getActiveOffer = getActiveOffer;
const createOffer = async (data) => {
    return prisma_1.default.promotionalOffer.create({
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
exports.createOffer = createOffer;
const updateOffer = async (id, data) => {
    return prisma_1.default.promotionalOffer.update({
        where: { id },
        data: {
            ...data,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
        },
    });
};
exports.updateOffer = updateOffer;
const deleteOffer = async (id) => {
    return prisma_1.default.promotionalOffer.delete({
        where: { id },
    });
};
exports.deleteOffer = deleteOffer;
//# sourceMappingURL=offer.service.js.map