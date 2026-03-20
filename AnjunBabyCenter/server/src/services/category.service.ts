import prisma from "../../prisma";

export const createCategory = (data: {
    name: string;
    parentId?: number;
    imageUrl?: string;
}) => {
    return prisma.category.create({
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

export const getAllCategories = () => {
    return prisma.category.findMany({
        include: {
            children: true,
            parent: true
        }
    });
};

export const getCategoryById = (id: number) => {
    return prisma.category.findUnique({
        where: { id }
    });
};

export const updateCategory = (id: number, data: {
    name?: string;
    parentId?: number | null;
    imageUrl?: string;
}) => {
    // Validation: Prevent a category from being its own parent
    if (id === data.parentId) {
        throw new Error("A category cannot be its own parent.");
    }

    const dataForUpdate: any = {
        name: data.name,
        imageUrl: data.imageUrl,
    };

    // Connect to new parent, disconnect if parentId is null, or do nothing if undefined
    if (data.parentId) {
        dataForUpdate.parent = { connect: { id: data.parentId } };
    } else if (data.parentId === null) {
        dataForUpdate.parent = { disconnect: true };
    }

    return prisma.category.update({
        where: { id },
        data: dataForUpdate,
    });
};

// --- UPDATED DELETE LOGIC ---
export const deleteCategory = async (id: number) => {
    // 1. Fetch category with its relations
    const category = await prisma.category.findUnique({
        where: { id },
        include: { 
            children: { select: { id: true } }, // More efficient check
            products: { select: { id: true } }  // More efficient check
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
    return prisma.category.delete({
        where: { id }
    });
};