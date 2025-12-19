import db from "../database/db";

export interface TransactionInfo {
  id: number;
  product_id: number;
  buyer_id: number | null;
  seller_id: number;
}

export const findTransactionByProductId = async (
  productId: number
): Promise<TransactionInfo | null> => {
  const transaction = await db("transactions")
    .where({ product_id: productId })
    .select("id", "product_id", "buyer_id", "seller_id")
    .first();

  return transaction || null;
};

export const findTransactionsByProductIds = async (
  productIds: number[]
): Promise<TransactionInfo[]> => {
  if (productIds.length === 0) {
    return [];
  }

  const transactions = await db("transactions")
    .whereIn("product_id", productIds)
    .select("id", "product_id", "buyer_id", "seller_id");

  return transactions;
};
