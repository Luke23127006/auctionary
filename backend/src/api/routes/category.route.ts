import { Router } from "express";
import * as categoryController from "../controllers/category.controller";

const router = Router();

// Public route - Get all categories (for product filters, navigation)
router.get("/", categoryController.getAllCategories);

export default router;
