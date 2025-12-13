import { Knex } from "knex";
import db from "../database/db";

export const createBid = async (
  productId: number,
  bidderId: number,
  amount: number,
  trx?: Knex.Transaction
) => {
  const [bid] = await (trx || db)("bids")
    .insert({
      product_id: productId,
      bidder_id: bidderId,
      amount: amount,
    })
    .returning("*");
  return bid;
};

export const upsertAutoBid = async (
  productId: number,
  bidderId: number,
  maxAmount: number,
  trx?: Knex.Transaction
) => {
  const [autoBid] = await (trx || db)("auto_bids")
    .insert({
      product_id: productId,
      bidder_id: bidderId,
      max_amount: maxAmount,
    })
    .onConflict(["product_id", "bidder_id"])
    .merge(["max_amount"])
    .returning("*");
  return autoBid;
};

export const getAutoBidsByProductId = async (
  productId: number,
  trx?: Knex.Transaction
) => {
  return (trx || db)("auto_bids")
    .where({ product_id: productId })
    .orderBy("max_amount", "desc")
    .orderBy("created_at", "asc");
};

export const getHighestBid = async (
  productId: number,
  trx?: Knex.Transaction
) => {
  return (trx || db)("bids")
    .where({ product_id: productId })
    .orderBy("amount", "desc")
    .first();
};
