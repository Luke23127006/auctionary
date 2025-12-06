export interface UserStats {
  rating: number; // percentage (0-100)
  likes: number; // positive_reviews
  dislikes: number; // negative_reviews
  auctionsWon: number;
}

export interface UserStatsResponse {
  stats: UserStats;
}
