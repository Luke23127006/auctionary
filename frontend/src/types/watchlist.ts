import type { Product } from "./product";

export interface WatchlistProduct extends Product {}

export interface WatchlistResponse {
  products: WatchlistProduct[];
}
