import { BadRequestError, NotFoundError } from "../errors";
import db from "../database/db";
import * as bidRepository from "../repositories/bid.repository";
import * as productRepository from "../repositories/product.repository";
import * as bidMapper from "../mappers/bid.mapper";
import { PlaceBidResponse } from "../api/dtos/responses/place-bid.type";

export const placeBid = async (
  productId: number,
  userId: number,
  amount: number
): Promise<PlaceBidResponse> => {
  return await db.transaction(async (trx) => {
    const product = await productRepository.getProductBidInfo(productId, trx);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.status !== "active") {
      throw new BadRequestError("Cannot place bid on inactive product");
    }

    const currentPrice = Number(product.current_price);
    const stepPrice = Number(product.step_price);
    const startPrice = Number(product.start_price);

    let minAcceptableBid = startPrice;
    if (product.highest_bidder_id) {
      minAcceptableBid = currentPrice + stepPrice;
    }

    if (amount < minAcceptableBid) {
      throw new BadRequestError(`Bid must be at least ${minAcceptableBid}`);
    }

    await bidRepository.upsertAutoBid(productId, userId, amount, trx);

    const autoBids = await bidRepository.getAutoBidsByProductId(productId, trx);

    if (autoBids.length === 0) {
      throw new Error("Failed to process bid: No auto bids found");
    }

    const winner = autoBids[0];
    const runnerUp = autoBids[1];

    if (runnerUp && runnerUp.bidder_id === userId) {
      await bidRepository.createBid(
        productId,
        userId,
        Number(runnerUp.max_amount),
        trx
      );

      await productRepository.increaseProductBidCount(
        productId,
        trx
      );
    }

    let newPrice = startPrice;

    if (runnerUp) {
      const priceToBeatRunnerUp = Number(runnerUp.max_amount) + stepPrice;
      newPrice = Math.min(priceToBeatRunnerUp, Number(winner.max_amount));
      newPrice = Math.max(newPrice, startPrice);
    } else {
      newPrice = startPrice;
    }

    newPrice = Math.max(newPrice, currentPrice);

    const currentHighestBid = await bidRepository.getHighestBid(productId, trx);
    let shouldCreateBid = false;

    if (!currentHighestBid) {
      shouldCreateBid = true;
    } else {
      const currentRecordedPrice = Number(currentHighestBid.amount);
      if (newPrice > currentRecordedPrice) {
        shouldCreateBid = true;
      } else if (winner.bidder_id !== currentHighestBid.bidder_id) {
        shouldCreateBid = true;
      }
    }

    if (shouldCreateBid) {
      await bidRepository.createBid(
        productId,
        winner.bidder_id,
        newPrice,
        trx
      );

      await productRepository.updateProductBidStats(
        productId,
        winner.bidder_id,
        newPrice,
        trx
      );
    }

    const bidCount = await productRepository.getProductBidCount(productId, trx);

    return bidMapper.toPlaceBidResponse(
      winner.bidder_id === userId ? "winning" : "outbid",
      newPrice,
      winner.bidder_id,
      bidCount
    );
  });
};
