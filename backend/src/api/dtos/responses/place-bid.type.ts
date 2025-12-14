export interface PlaceBidResponse {
  status: "winning" | "outbid";
  currentPrice: number;
  currentWinnerId: number;
  bidCount: number;
}
