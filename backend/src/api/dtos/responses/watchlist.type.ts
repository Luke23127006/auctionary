import type { ProductListCardProps } from "./product.type";

export interface WatchlistProduct extends ProductListCardProps {}

export interface WatchlistResponse {
  products: WatchlistProduct[];
}
