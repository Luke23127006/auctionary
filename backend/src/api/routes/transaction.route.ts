import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { verifyTransactionOwnership } from "../middlewares/transaction.middleware";
import * as TransactionController from "../controllers/transaction.controller";

const router = Router();

router.get(
  "/:id",
  requireAuth,
  verifyTransactionOwnership,
  TransactionController.getTransactionDetail
)

export default router;