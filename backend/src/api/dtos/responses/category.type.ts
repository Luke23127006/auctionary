/**
 * Category response for public-facing category lists (e.g., filters, dropdowns)
 * Used in product listing pages and category navigation
 */
export interface Category {
  id: number;
  slug: string;
  name: string;
  children: {
    id: number;
    slug: string;
    name: string;
  }[];
}

/**
 * Admin category tree node with hierarchical structure
 * Used in admin dashboard for category management
 */
export interface AdminCategoryTreeNode {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  subcategories: AdminCategoryTreeNode[];
}

/**
 * Response for GET /admin/categories (list all with hierarchy)
 */
export interface AdminCategoryListResponse {
  categories: AdminCategoryTreeNode[];
  stats: {
    totalCategories: number;
    mainCategories: number;
    subcategories: number;
  };
}

/**
 * Response for POST/PATCH /admin/categories (single category)
 */
export interface AdminCategoryResponse {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
}
