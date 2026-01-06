export interface SellerDashboardStats {
  activeAuctions: number;
  totalBids: number;
  totalRevenue: number;
  avgBidTime: number; // days
}

export type ProductStatus =
  | "active"
  | "removed"
  | "sold"
  | "expired"
  | "pending";

export interface SellerDashboardListing {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  categoryName: string;
  startPrice: number;
  currentPrice: number;
  bidCount: number;
  endTime: string;
  status: ProductStatus;
  createdAt: string;
  transactionStatus:
    | "payment_pending"
    | "shipping_pending"
    | "delivered"
    | "completed"
    | "cancelled"
    | null;
  transactionId: number | null;
}

export interface SellerDashboardData {
  stats: SellerDashboardStats;
  listings: SellerDashboardListing[];
}
