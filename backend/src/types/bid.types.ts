export interface HighestBidder {
  currentPrice: number;
  highestBidder: {
    id: number;
    fullName: string;
    positiveReviews: number;
    negativeReviews: number;
  };
}

export interface BidHistoryItem {
  createdAt: Date;
  bidderName: string;
  amount: number;
}
