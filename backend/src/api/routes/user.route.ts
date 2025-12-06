import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth.middleware";
import * as userController from "../controllers/user.controller";

const router = Router();

router.get("/me/stats", requireAuth, userController.getStats);
router.get("/me/watchlist", requireAuth, userController.getWatchlist);
router.get("/me/bids", requireAuth, userController.getActiveBids);
router.get("/me/won-auctions", requireAuth, userController.getWonAuctions);
router.get("/me/listings", requireAuth, userController.getMyListings);

router.patch("/me/profile", requireAuth, userController.updateProfile);
router.patch("/me/email", requireAuth, userController.updateEmail);
router.patch("/me/password", requireAuth, userController.changePassword);

export default router;
