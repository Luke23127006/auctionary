import { z } from "zod";

/**
 * Schema for creating a new category
 * - Name is required and trimmed
 * - ParentId is optional (null = main category)
 */
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters")
    .trim(),
  parentId: z.number().int().positive().optional().nullable(),
});

/**
 * Schema for updating an existing category
 * - Both fields are optional (partial update)
 */
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters")
    .trim()
    .optional(),
  parentId: z.number().int().positive().optional().nullable(),
});

/**
 * Schema for category ID parameter in URL
 */
export const categoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Export inferred types
export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;
