import type { UserRole } from "../constants/roles";

export interface User {
  id: number;
  email: string;
  fullName: string;
  address?: string;
  isVerified: boolean;
  status: "pending_verification" | "active" | "pending_upgrade" | "suspended";
  positiveReviews: number;
  negativeReviews: number;
  roles: UserRole[];
  permissions: string[];
  createdAt: string;
  hasPassword?: boolean;
}

export interface UserStats {
  rating: number;
  likes: number;
  dislikes: number;
  auctionsWon: number;
}

export interface UserStatsResponse {
  stats: UserStats;
}

export interface MyBid {
  product_id: number;
  name: string;
  description: string;
  starting_price: number;
  current_price: number;
  buy_now_price?: number;
  thumbnail_url?: string;
  end_time: string; // Dates often string in JSON
  slug: string;
  status: string;
  bid_count: number;
  my_max_bid: number;
  current_highest_bid: number;
  highest_bidder_id: number;
}

export interface WonAuction {
  // Transaction fields
  id: number;
  product_id: number;
  buyer_id: number;
  seller_id: number;
  final_price: number;
  status: string; // transaction status (payment_pending, shipping_pending, delivered, completed, cancelled)
  created_at: string;

  // Joined fields from products table
  product_name: string;
  thumbnail_url: string;
}
