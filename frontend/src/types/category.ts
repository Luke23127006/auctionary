/**
 * Public-facing category node for product filters and navigation
 */
export interface CategoryNode {
  id: string;
  slug: string;
  name: string;
  children?: CategoryNode[];
}

/**
 * Admin category tree node with UI state management
 * Used in CategoryManagement.tsx for admin dashboard
 */
export interface AdminCategory {
  id: number; // Changed from string to number to match backend
  name: string;
  slug: string;
  parentId: number | null;
  subcategories?: AdminCategory[];
  expanded?: boolean; // UI-only state for tree expansion
}

/**
 * Response from GET /api/admin/categories
 */
export interface AdminCategoryListResponse {
  categories: AdminCategory[];
  stats: {
    totalCategories: number;
    mainCategories: number;
    subcategories: number;
  };
}

/**
 * Response from POST/PATCH /api/admin/categories
 */
export interface AdminCategoryResponse {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
}

/**
 * Request payload for creating a new category
 */
export interface CreateCategoryRequest {
  name: string;
  parentId?: number | null;
}

/**
 * Request payload for updating a category
 */
export interface UpdateCategoryRequest {
  name?: string;
  parentId?: number | null;
}
