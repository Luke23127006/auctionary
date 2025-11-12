import type { UserRole } from "../constants/roles"; // 1. Import kiểu UserRole
// 1. Import kiểu UserRole

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole; // 2. Thêm trường 'role'
  // ... các trường khác từ API
}
