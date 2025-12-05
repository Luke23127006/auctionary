import type { UserRole } from "../constants/roles"; // 1. Import kiểu UserRole
// 1. Import kiểu UserRole

export interface User {
  id: number;
  email: string;
  fullName: string;
  address?: string;
  isVerified: boolean;
  status: "pending_verification" | "active" | "pending_upgrade" | "suspended";
  positiveReviews: number;
  negativeReviews: number;
  roles: UserRole[]; // Array of roles like ['bidder', 'seller']
  permissions: string[]; // Array of permissions like ['create_auction', 'update_auction']
  createdAt: string;
}
