import { Router } from "express";
import * as watchlistController from "../controllers/watchlist.controller";
import { requireAuth } from "../middlewares/require-auth.middleware";

const router = Router();

router.get("/", requireAuth, watchlistController.getWatchlist);
router.post("/", requireAuth, watchlistController.addProductToWatchlist);
router.delete(
  "/:productId",
  requireAuth,
  watchlistController.removeProductFromWatchlist
);

export default router;
