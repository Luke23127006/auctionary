export interface UserStats {
  rating: number; // percentage (0-100)
  likes: number; // positive_reviews
  dislikes: number; // negative_reviews
  auctionsWon: number;
}

export interface UserStatsResponse {
  stats: UserStats;
}

export interface MyBid {
  // Product fields (partial/key ones)
  product_id: number;
  name: string;
  description: string;
  starting_price: number;
  current_price: number; // This might be from product table, but query also returns calculated max bid
  buy_now_price?: number;
  thumbnail_url?: string;
  end_time: Date;
  slug: string;
  status: string;

  // Bid specific fields from query
  my_max_bid: number;
  current_highest_bid: number;
  highest_bidder_id: number;
}

export interface WonAuction {
  order_id: number;
  product_id: number;
  winner_id: number;
  amount: number;
  created_at: Date;
  payment_status: string;
  shipping_status: string;

  // Joined fields
  product_name: string;
  thumbnail_url: string;
}
