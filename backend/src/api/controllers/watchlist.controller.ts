import * as watchlistService from "../../services/watchlist.service";
import { NextFunction, Request, Response } from "express";

export const getWatchlist = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = (request as any).user.id;
    const watchlist = await watchlistService.getWatchlist(userId);
    response
      .status(200)
      .message("Watchlist retrieved successfully")
      .json(watchlist);
  } catch (error) {
    next(error);
  }
};

export const addProductToWatchlist = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = (request as any).user.id;
    const { productId } = request.body;
    const addedProductId = await watchlistService.addProductToWatchlist(
      userId,
      productId
    );
    response
      .status(201)
      .message("Product added to watchlist successfully")
      .json(addedProductId);
  } catch (error) {
    next(error);
  }
};

export const removeProductFromWatchlist = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = (request as any).user.id;
    const productId = Number(request.params.productId);
    const removedProductId = await watchlistService.removeProductFromWatchlist(
      userId,
      productId
    );
    response
      .status(200)
      .message("Product removed from watchlist successfully")
      .json(removedProductId);
  } catch (error) {
    next(error);
  }
};
