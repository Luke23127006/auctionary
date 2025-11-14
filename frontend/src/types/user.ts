import type { UserRole } from "../constants/roles"; // 1. Import kiểu UserRole
// 1. Import kiểu UserRole

export interface User {
  id: number;
  email: string;
  full_name: string;
  address?: string;
  is_verified: boolean;
  status: "pending_verification" | "active" | "pending_upgrade" | "suspended";
  positive_reviews: number;
  negative_reviews: number;
  roles: UserRole[]; // Array of roles like ['bidder', 'seller']
  created_at: string;
}
