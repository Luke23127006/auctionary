import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import * as adminController from "../controllers/admin.controller";
import * as categoryController from "../controllers/category.controller";
import {
  upgradeRequestActionSchema,
  suspendUserSchema,
  removeProductSchema,
  resetUserPasswordParamSchema,
} from "../dtos/requests/admin.schema";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from "../dtos/requests/category.schema";

const router = Router();

// All admin routes require authentication and admin role/permission
const adminAuth = [requireAuth, authorize("admin")];

// Overview dashboard
router.get("/overview", adminAuth, adminController.getAdminOverview);

// User management
router.get("/users", adminAuth, adminController.getAllUsers);
router.patch(
  "/users/:id/suspend",
  adminAuth,
  validate(suspendUserSchema, "params"),
  adminController.suspendUser
);
router.post(
  "/users/:id/reset-password",
  adminAuth,
  validate(resetUserPasswordParamSchema, "params"),
  adminController.resetUserPassword
);

// Upgrade request management
router.get(
  "/upgrade-requests",
  adminAuth,
  adminController.getAllUpgradeRequests
);
router.patch(
  "/upgrade-requests/:id/approve",
  adminAuth,
  validate(upgradeRequestActionSchema, "params"),
  adminController.approveUpgradeRequest
);
router.patch(
  "/upgrade-requests/:id/reject",
  adminAuth,
  validate(upgradeRequestActionSchema, "params"),
  adminController.rejectUpgradeRequest
);

// Product management
router.get("/products", adminAuth, adminController.getAllProducts);
router.delete(
  "/products/:id",
  adminAuth,
  validate(removeProductSchema, "params"),
  adminController.removeProduct
);

// Category management
router.get(
  "/categories",
  adminAuth,
  categoryController.getAllCategoriesForAdmin
);
router.get(
  "/categories/:id",
  adminAuth,
  validate(categoryIdParamSchema, "params"),
  categoryController.getCategoryById
);
router.post(
  "/categories",
  adminAuth,
  validate(createCategorySchema, "body"),
  categoryController.createCategory
);
router.patch(
  "/categories/:id",
  adminAuth,
  validate(categoryIdParamSchema, "params"),
  validate(updateCategorySchema, "body"),
  categoryController.updateCategory
);
router.delete(
  "/categories/:id",
  adminAuth,
  validate(categoryIdParamSchema, "params"),
  categoryController.deleteCategory
);

export default router;
