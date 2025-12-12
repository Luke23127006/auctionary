import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from "../dtos/requests/category.schema";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

// Public route - Get all categories (for product filters, navigation)
router.get("/", categoryController.getAllCategories);

// Admin routes - Category management
router.get(
  "/admin",
  requireAuth,
  authorize("categories.read"),
  categoryController.getAllCategoriesForAdmin
);

router.get(
  "/admin/:id",
  requireAuth,
  authorize("categories.read"),
  validate(categoryIdParamSchema, "params"),
  categoryController.getCategoryById
);

router.post(
  "/admin",
  requireAuth,
  authorize("categories.create"),
  validate(createCategorySchema, "body"),
  categoryController.createCategory
);

router.patch(
  "/admin/:id",
  requireAuth,
  authorize("categories.update"),
  validate(categoryIdParamSchema, "params"),
  validate(updateCategorySchema, "body"),
  categoryController.updateCategory
);

router.delete(
  "/admin/:id",
  requireAuth,
  authorize("categories.delete"),
  validate(categoryIdParamSchema, "params"),
  categoryController.deleteCategory
);

export default router;
