import { Request, Response, NextFunction } from "express";
import * as categoryService from "../../services/category.service";
import { logger } from "../../utils/logger.util";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryIdParam,
} from "../dtos/requests/category.schema";

/**
 * Get all categories for public use (product filters)
 */
export const getAllCategories = async (
  _request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await categoryService.getAllCategories();
    response.status(200).json(result);
  } catch (error) {
    logger.error("CategoryController", "Failed to get all categories", error);
    next(error);
  }
};

// ========== ADMIN CATEGORY MANAGEMENT ==========

/**
 * Get all categories with hierarchy and stats for admin dashboard
 * GET /api/admin/categories
 */
export const getAllCategoriesForAdmin = async (
  _request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await categoryService.getAllCategoriesForAdmin();
    response.status(200).json(result);
  } catch (error) {
    logger.error("CategoryController", "Failed to get admin categories", error);
    next(error);
  }
};

/**
 * Get a single category by ID
 * GET /api/admin/categories/:id
 */
export const getCategoryById = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params as unknown as CategoryIdParam;
    const result = await categoryService.getCategoryById(id);
    response.status(200).json(result);
  } catch (error) {
    logger.error("CategoryController", "Failed to get category by ID", error);
    next(error);
  }
};

/**
 * Create a new category
 * POST /api/admin/categories
 */
export const createCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = request.body as CreateCategoryRequest;
    const result = await categoryService.createCategory(body);

    response.status(201).message("Category created successfully").json(result);
  } catch (error) {
    logger.error("CategoryController", "Failed to create category", error);
    next(error);
  }
};

/**
 * Update an existing category
 * PATCH /api/admin/categories/:id
 */
export const updateCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params as unknown as CategoryIdParam;
    const body = request.body as UpdateCategoryRequest;
    const result = await categoryService.updateCategory(id, body);

    response.status(200).message("Category updated successfully").json(result);
  } catch (error) {
    logger.error("CategoryController", "Failed to update category", error);
    next(error);
  }
};

/**
 * Delete a category
 * DELETE /api/admin/categories/:id
 */
export const deleteCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params as unknown as CategoryIdParam;
    await categoryService.deleteCategory(id);

    response.status(200).message("Category deleted successfully").json(null);
  } catch (error) {
    logger.error("CategoryController", "Failed to delete category", error);
    next(error);
  }
};
