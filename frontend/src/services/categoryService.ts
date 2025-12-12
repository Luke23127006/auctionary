import apiClient from "./apiClient";
import type {
  CategoryNode,
  AdminCategoryListResponse,
  AdminCategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category";

/**
 * Get all categories for public use (product filters, navigation)
 */
export const getCategories = async (): Promise<CategoryNode[]> => {
  const categoriesData: {
    id: number;
    slug: string;
    name: string;
    children?: { id: number; slug: string; name: string }[];
  }[] = await apiClient.get("/categories");

  return categoriesData.map((cat) => ({
    id: String(cat.id), // Convert numeric ID to string for Select component compatibility
    slug: cat.slug,
    name: cat.name,
    children:
      cat.children?.map((child) => ({
        id: String(child.id),
        slug: child.slug,
        name: child.name,
      })) || [],
  }));
};

// ========== ADMIN CATEGORY MANAGEMENT ==========

/**
 * Get all categories with hierarchy and stats for admin dashboard
 * GET /categories/admin
 */
export const getAllCategoriesForAdmin =
  async (): Promise<AdminCategoryListResponse> => {
    return apiClient.get("/categories/admin", true);
  };

/**
 * Create a new category
 * POST /categories/admin
 */
export const createCategory = async (
  data: CreateCategoryRequest
): Promise<AdminCategoryResponse> => {
  return apiClient.post("/categories/admin", data, true);
};

/**
 * Update an existing category
 * PATCH /categories/admin/:id
 */
export const updateCategory = async (
  id: number,
  data: UpdateCategoryRequest
): Promise<AdminCategoryResponse> => {
  return apiClient.patch(`/categories/admin/${id}`, data, true);
};

/**
 * Delete a category
 * DELETE /categories/admin/:id
 */
export const deleteCategory = async (id: number): Promise<void> => {
  return apiClient.delete(`/categories/admin/${id}`, true);
};
