import { Category } from '@/state/api'

/**
 * Get all subcategories for a specific parent category by category name
 * @param categories - All available categories
 * @param parentCategoryName - The name of the parent category
 * @returns Array of subcategories filtered by parent category name
 */
export const getSubcategoriesByParentName = (
  categories: Category[],
  parentCategoryName: string
): Category[] => {
  // Find the parent category by name
  const parentCategory = categories.find(
    (cat) => cat.name.toLowerCase() === parentCategoryName.toLowerCase()
  )

  if (!parentCategory) {
    return []
  }

  // Filter categories that have this parent category's ID
  return categories.filter((cat) => cat.parentId === parentCategory.id)
}

/**
 * Get all subcategories (only display categories with a parentId)
 * @param categories - All available categories
 * @returns Array of all subcategories
 */
export const getAllSubcategories = (categories: Category[]): Category[] => {
  return categories.filter((cat) => cat.parentId !== null && cat.parentId !== undefined)
}

/**
 * Get all parent categories (only display categories without a parentId)
 * @param categories - All available categories
 * @returns Array of all parent categories
 */
export const getAllParentCategories = (categories: Category[]): Category[] => {
  return categories.filter((cat) => cat.parentId === null || cat.parentId === undefined)
}

/**
 * Format categories as a hierarchical structure
 * @param categories - All available categories
 * @returns Object with parent categories as keys and their subcategories as values
 */
export const formatCategoriesHierarchy = (
  categories: Category[]
): Record<string, Category[]> => {
  const hierarchy: Record<string, Category[]> = {}

  const parentCategories = getAllParentCategories(categories)

  parentCategories.forEach((parent) => {
    const subcategories = getSubcategoriesByParentName(categories, parent.name)
    hierarchy[parent.name] = subcategories
  })

  return hierarchy
}
