import { Request, Response, NextFunction } from "express";
import * as userService from "../../services/user.service";

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const stats = await userService.getStats(userId);
    res.message("User stats retrieved successfully").json(stats);
  } catch (error) {
    next(error);
  }
};

export const getWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const watchlist = await userService.getWatchlist(userId);
    res.message("Watchlist retrieved successfully").json(watchlist);
  } catch (error) {
    next(error);
  }
};

export const getActiveBids = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const bids = await userService.getActiveBids(userId);
    res.message("Active bids retrieved successfully").json(bids);
  } catch (error) {
    next(error);
  }
};

export const getWonAuctions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const auctions = await userService.getWonAuctions(userId);
    res.message("Won auctions retrieved successfully").json(auctions);
  } catch (error) {
    next(error);
  }
};

export const getMyListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const listings = await userService.getMyListings(userId);
    res.message("My listings retrieved successfully").json(listings);
  } catch (error) {
    next(error);
  }
};
