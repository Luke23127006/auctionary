import type { Product } from "./product";

export type WatchlistProduct = Product;

export interface WatchlistResponse {
  products: WatchlistProduct[];
}
