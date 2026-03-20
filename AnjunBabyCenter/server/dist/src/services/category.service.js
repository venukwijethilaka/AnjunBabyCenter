"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const createCategory = (data) => {
    return prisma_1.default.category.create({
        data: {
            name: data.name,
            imageUrl: data.imageUrl ?? null,
            ...(data.parentId && {
                parent: {
                    connect: { id: Number(data.parentId) }
                }
            })
        }
    });
};
exports.createCategory = createCategory;
const getAllCategories = () => {
    return prisma_1.default.category.findMany({
        include: {
            children: true,
            parent: true
        }
    });
};
exports.getAllCategories = getAllCategories;
const getCategoryById = (id) => {
    return prisma_1.default.category.findUnique({
        where: { id }
    });
};
exports.getCategoryById = getCategoryById;
const updateCategory = (id, data) => {
    // Validation: Prevent a category from being its own parent
    if (id === data.parentId) {
        throw new Error("A category cannot be its own parent.");
    }
    const dataForUpdate = {
        name: data.name,
        imageUrl: data.imageUrl,
    };
    // Connect to new parent, disconnect if parentId is null, or do nothing if undefined
    if (data.parentId) {
        dataForUpdate.parent = { connect: { id: data.parentId } };
    }
    else if (data.parentId === null) {
        dataForUpdate.parent = { disconnect: true };
    }
    return prisma_1.default.category.update({
        where: { id },
        data: dataForUpdate,
    });
};
exports.updateCategory = updateCategory;
// --- UPDATED DELETE LOGIC ---
const deleteCategory = async (id) => {
    // 1. Fetch category with its relations
    const category = await prisma_1.default.category.findUnique({
        where: { id },
        include: {
            children: { select: { id: true } }, // More efficient check
            products: { select: { id: true } } // More efficient check
        }
    });
    if (!category) {
        throw new Error("Category not found");
    }
    // 2. Prevent deletion if it has sub-categories
    if (category.children.length > 0) {
        throw new Error("Cannot delete a category that has sub-categories. Please reassign or delete them first.");
    }
    // 3. Prevent deletion if products are linked to it
    if (category.products.length > 0) {
        throw new Error("Cannot delete a category that contains products. Reassign or delete the products first.");
    }
    // 4. Perform the deletion
    return prisma_1.default.category.delete({
        where: { id }
    });
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.service.js.map