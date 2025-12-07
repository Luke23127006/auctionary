import { WatchlistResponse } from "../api/dtos/responses/watchlist.type";
import { mapToProductListCard } from "../mappers/product.mapper";
import * as watchlistRepo from "../repositories/watchlist.repository";

export const getWatchlist = async (
  userId: number
): Promise<WatchlistResponse> => {
  const watchlistProducts = await watchlistRepo.getWatchlist(userId);

  const response: WatchlistResponse = {
    products: watchlistProducts.map((product) => ({
      ...mapToProductListCard(product),
    })),
  };

  return response;
};

export const addProductToWatchlist = async (
  userId: number,
  productId: number
): Promise<number> => {
  const response = await watchlistRepo.addProductToWatchlist(userId, productId);
  return response[0];
};

export const removeProductFromWatchlist = async (
  userId: number,
  productId: number
): Promise<number> => {
  const response = await watchlistRepo.removeProductFromWatchlist(
    userId,
    productId
  );
  return response[0];
};
