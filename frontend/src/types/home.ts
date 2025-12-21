/**
 * Type definitions for Home page
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
  isHot?: boolean; // Client-side calculated (bidCount >= 15)
}

/**
 * All sections for the home page
 */
export interface HomeSections {
  endingSoon: HomeAuctionItem[];
  mostActive: HomeAuctionItem[];
  highestPrice: HomeAuctionItem[];
}

/**
 * API Response structure for home sections endpoint
 */
export interface HomeSectionsResponse {
  success: boolean;
  data: HomeSections;
  message?: string;
}
