import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { verifyTransactionOwnership } from "../middlewares/transaction.middleware";
import { validate } from "../middlewares/validate.middleware";
import { TransactionPaymentProofUploadSchema } from "../dtos/requests/transaction.schema";
import * as TransactionController from "../controllers/transaction.controller";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = Router();

router.get(
  "/:id",
  requireAuth,
  verifyTransactionOwnership,
  TransactionController.getTransactionDetail
);

router.post(
  "/:id/payment",
  upload.single("paymentProof"),
  requireAuth,
  verifyTransactionOwnership,
  validate(TransactionPaymentProofUploadSchema, "body"),
  TransactionController.uploadPaymentProof
);

export default router;