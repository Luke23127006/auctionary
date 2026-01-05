import { useState, useEffect, useCallback } from "react";
import * as categoryService from "../services/categoryService";
import type {
  AdminCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category";
import { notify } from "../utils/notify";

interface AdminCategoriesState {
  categories: AdminCategory[];
  stats: {
    totalCategories: number;
    mainCategories: number;
    subcategories: number;
  };
  loading: boolean;
  error: string | null;
}

export const useAdminCategories = () => {
  const [state, setState] = useState<AdminCategoriesState>({
    categories: [],
    stats: {
      totalCategories: 0,
      mainCategories: 0,
      subcategories: 0,
    },
    loading: false,
    error: null,
  });

  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );

  /**
   * Fetch all categories with stats
   */
  const fetchCategories = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const result = await categoryService.getAllCategoriesForAdmin();

      setState({
        categories: result.categories,
        stats: result.stats,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to load categories",
      }));
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Toggle category expansion state (UI only)
   */
  const toggleExpanded = useCallback((categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  /**
   * Create a new category
   */
  const handleCreate = useCallback(
    async (data: CreateCategoryRequest) => {
      try {
        await categoryService.createCategory(data);
        notify.success("Category created successfully!");
        await fetchCategories(); // Refresh list
      } catch (error: any) {
        console.error("Failed to create category:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to create category";
        notify.error(errorMessage);
        throw error; // Re-throw for component to handle (e.g., keep dialog open)
      }
    },
    [fetchCategories]
  );

  /**
   * Update an existing category
   */
  const handleUpdate = useCallback(
    async (id: number, data: UpdateCategoryRequest) => {
      try {
        await categoryService.updateCategory(id, data);
        notify.success("Category updated successfully!");
        await fetchCategories(); // Refresh list
      } catch (error: any) {
        console.error("Failed to update category:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update category";
        notify.error(errorMessage);
        throw error;
      }
    },
    [fetchCategories]
  );

  /**
   * Delete a category
   */
  const handleDelete = useCallback(
    async (id: number, name: string) => {
      try {
        await categoryService.deleteCategory(id);
        notify.success(`Category "${name}" deleted successfully!`);
        await fetchCategories(); // Refresh list
      } catch (error: any) {
        console.error("Failed to delete category:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete category";
        notify.error(errorMessage);
        throw error;
      }
    },
    [fetchCategories]
  );

  /**
   * Manual refetch (useful after errors)
   */
  const refetch = useCallback(() => {
    return fetchCategories();
  }, [fetchCategories]);

  return {
    categories: state.categories,
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    expandedCategories,
    toggleExpanded,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  };
};
