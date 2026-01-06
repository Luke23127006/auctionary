export interface SellerDashboardStats {
  activeAuctions: number;
  totalBids: number;
  totalRevenue: number;
  avgBidTime: number; // In hours or days, backend calculation
}

export interface SellerDashboardListingResult {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  categoryName: string;
  startPrice: number;
  currentPrice: number;
  bidCount: number;
  endTime: Date;
  status: "active" | "pending" | "sold" | "unsold";
  createdAt: Date;
  transactionStatus:
    | "payment_pending"
    | "shipping_pending"
    | "delivered"
    | "completed"
    | "cancelled"
    | null;
  transactionId: number | null;
}

export interface SellerDashboardResponse {
  stats: SellerDashboardStats;
  listings: SellerDashboardListingResult[];
}
