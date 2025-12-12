import * as categoryRepository from "../repositories/category.repository";
import {
  Category,
  AdminCategoryListResponse,
  AdminCategoryResponse,
} from "../api/dtos/responses/category.type";
import {
  mapToCategories,
  mapToAdminCategoryListResponse,
  mapToAdminCategoryResponse,
} from "../mappers/category.mapper";
import { toSlug } from "../utils/slug.util";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../api/dtos/requests/category.schema";
import { NotFoundError, BadRequestError } from "../errors";

const MAX_CATEGORY_DEPTH = 1; // 0 = root, 1 = subcategory (2 levels total)

/**
 * Get all categories for public display (product filters, navigation)
 */
export const getAllCategories = async (): Promise<Category[]> => {
  const rawCategories = await categoryRepository.getAllCategories();
  return mapToCategories(rawCategories);
};

// ========== ADMIN CATEGORY MANAGEMENT ==========

/**
 * Get all categories with hierarchy and stats for admin dashboard
 */
export const getAllCategoriesForAdmin =
  async (): Promise<AdminCategoryListResponse> => {
    const [rawCategories, rawStats] = await Promise.all([
      categoryRepository.getAllCategoriesForAdmin(),
      categoryRepository.getCategoryStats(),
    ]);

    return mapToAdminCategoryListResponse(rawCategories, rawStats);
  };

/**
 * Create a new category with auto-generated slug
 */
export const createCategory = async (
  data: CreateCategoryRequest
): Promise<AdminCategoryResponse> => {
  // Generate slug from name
  const slug = toSlug(data.name);

  // Validate: Check if name already exists
  const nameExists = await categoryRepository.categoryNameExists(data.name);
  if (nameExists) {
    throw new BadRequestError(
      `Category with name "${data.name}" already exists`
    );
  }

  // Validate: Check if generated slug already exists
  const slugAlreadyExists = await categoryRepository.slugExists(slug);
  if (slugAlreadyExists) {
    throw new BadRequestError(
      `A category with similar name already exists (slug: ${slug})`
    );
  }

  // Validate: If parentId provided, check if parent exists
  if (data.parentId) {
    const parentCategory = await categoryRepository.findCategoryById(
      data.parentId
    );

    if (!parentCategory) {
      throw new NotFoundError(
        `Parent category with ID ${data.parentId} not found`
      );
    }

    // Validate: Check depth limit (parent must be root category)
    const parentDepth = await categoryRepository.getCategoryDepth(
      data.parentId
    );
    if (parentDepth >= MAX_CATEGORY_DEPTH) {
      throw new BadRequestError(
        `Cannot create subcategory: maximum nesting depth (${
          MAX_CATEGORY_DEPTH + 1
        } levels) reached`
      );
    }
  }

  // Create category
  const rawCategory = await categoryRepository.createCategory({
    name: data.name.trim(),
    slug,
    parent_id: data.parentId ?? null,
  });

  return mapToAdminCategoryResponse(rawCategory);
};

/**
 * Update an existing category
 */
export const updateCategory = async (
  categoryId: number,
  data: UpdateCategoryRequest
): Promise<AdminCategoryResponse> => {
  // Check if category exists
  const existingCategory = await categoryRepository.findCategoryById(
    categoryId
  );

  if (!existingCategory) {
    throw new NotFoundError(`Category with ID ${categoryId} not found`);
  }

  const updates: {
    name?: string;
    slug?: string;
    parent_id?: number | null;
  } = {};

  // Handle name update
  if (data.name !== undefined) {
    const trimmedName = data.name.trim();

    // Check if new name conflicts with existing
    const nameExists = await categoryRepository.categoryNameExists(
      trimmedName,
      categoryId
    );
    if (nameExists) {
      throw new BadRequestError(
        `Category with name "${trimmedName}" already exists`
      );
    }

    const newSlug = toSlug(trimmedName);

    // Check if new slug conflicts
    const slugAlreadyExists = await categoryRepository.slugExists(
      newSlug,
      categoryId
    );
    if (slugAlreadyExists) {
      throw new BadRequestError(
        `A category with similar name already exists (slug: ${newSlug})`
      );
    }

    updates.name = trimmedName;
    updates.slug = newSlug;
  }

  // Handle parent_id update
  if (data.parentId !== undefined) {
    // Allow setting parentId to null (make it root category)
    if (data.parentId === null) {
      // Check if this category has subcategories - if yes, can't make it a child itself
      const hasChildren = await categoryRepository.hasSubcategories(categoryId);
      if (hasChildren) {
        // Actually, making a parent into a root is fine. This check was wrong.
        // We should allow it. So remove this validation.
      }

      updates.parent_id = null;
    } else {
      // Validate: Check if new parent exists
      const newParent = await categoryRepository.findCategoryById(
        data.parentId
      );
      if (!newParent) {
        throw new NotFoundError(
          `Parent category with ID ${data.parentId} not found`
        );
      }

      // Validate: Prevent circular reference
      const wouldCreateCycle =
        await categoryRepository.wouldCreateCircularReference(
          categoryId,
          data.parentId
        );
      if (wouldCreateCycle) {
        throw new BadRequestError(
          "Cannot set parent: would create circular reference"
        );
      }

      // Validate: Check depth limit
      const newParentDepth = await categoryRepository.getCategoryDepth(
        data.parentId
      );
      if (newParentDepth >= MAX_CATEGORY_DEPTH) {
        throw new BadRequestError(
          `Cannot move category: maximum nesting depth (${
            MAX_CATEGORY_DEPTH + 1
          } levels) would be exceeded`
        );
      }

      // Validate: Ensure category has no subcategories if moving to be a child
      const hasChildren = await categoryRepository.hasSubcategories(categoryId);
      if (hasChildren) {
        throw new BadRequestError(
          "Cannot move category with subcategories. Please delete or reassign subcategories first."
        );
      }

      updates.parent_id = data.parentId;
    }
  }

  // Perform update if there are changes
  if (Object.keys(updates).length === 0) {
    // No changes, return existing
    return mapToAdminCategoryResponse(existingCategory);
  }

  const updatedCategory = await categoryRepository.updateCategory(
    categoryId,
    updates
  );

  return mapToAdminCategoryResponse(updatedCategory);
};

/**
 * Delete a category by ID
 */
export const deleteCategory = async (categoryId: number): Promise<void> => {
  // Check if category exists
  const category = await categoryRepository.findCategoryById(categoryId);
  if (!category) {
    throw new NotFoundError(`Category with ID ${categoryId} not found`);
  }

  // Check if category has products
  const productCount = await categoryRepository.countProductsInCategory(
    categoryId
  );
  if (productCount > 0) {
    throw new BadRequestError(
      `Cannot delete category: ${productCount} product(s) are using this category. Please reassign products first.`
    );
  }

  // Check if category has subcategories
  const hasChildren = await categoryRepository.hasSubcategories(categoryId);
  if (hasChildren) {
    throw new BadRequestError(
      "Cannot delete category with subcategories. Please delete subcategories first."
    );
  }

  // Perform deletion
  await categoryRepository.deleteCategoryById(categoryId);
};

/**
 * Get a single category by ID for admin
 */
export const getCategoryById = async (
  categoryId: number
): Promise<AdminCategoryResponse> => {
  const rawCategory = await categoryRepository.findCategoryById(categoryId);

  if (!rawCategory) {
    throw new NotFoundError(`Category with ID ${categoryId} not found`);
  }

  return mapToAdminCategoryResponse(rawCategory);
};
