/**
 * Response types for Home page endpoints
 */

/**
 * Individual auction item displayed on the home page
 */
export interface HomeAuctionItem {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  buyNowPrice?: number;
  topBidder: string;
  bidCount: number;
  endTime: string; // ISO 8601 timestamp
  timeLeft: string;
  status: string;
}

/**
 * Response for GET /api/home/sections
 * Contains three sections: ending soon, most active, and highest price
 */
export interface HomeSectionsResponse {
  endingSoon: HomeAuctionItem[];
  mostActive: HomeAuctionItem[];
  highestPrice: HomeAuctionItem[];
}
