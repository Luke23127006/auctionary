import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { searchProductSchema, createProductSchema } from "../schemas/product.schema";
import * as productController from "../controllers/product.controller";

const router = Router();

router.get("/", validate(searchProductSchema, 'query'), productController.searchProducts);
router.post("/", validate(createProductSchema, 'body'), productController.createProduct);
export default router;