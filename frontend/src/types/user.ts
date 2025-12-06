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
