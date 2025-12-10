import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import {
  searchProductsSchema,
  createProductSchema,
} from "../dtos/requests/product.schema";
import { placeBidSchema } from "../dtos/requests/place-bid.schema";
import { authorize } from "../middlewares/authorize.middleware";
import * as productController from "../controllers/product.controller";
import { requireAuth } from "../middlewares/require-auth.middleware";
import multer from "multer";
import { validateMultipart } from "../middlewares/multipart.middleware";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = Router();

router.get(
  "/",
  validate(searchProductsSchema, "query"),
  productController.searchProducts
);

// remove validate temporarily
router.post(
  "/",
  upload.array("images", 10),
  requireAuth,
  validateMultipart(createProductSchema),
  productController.createProduct
);

router.get("/:id", productController.getProductDetail);

router.get("/:id/bids", productController.getProductBidHistory);

router.get("/:id/questions", productController.getProductQuestions);

router.post(
  "/:id/bid",
  requireAuth,
  authorize("auctions.bid"),
  validate(placeBidSchema, "body"),
  productController.placeBid
);

export default router;
