export const ROLES = {
  BIDDER: "bidder",
  SELLER: "seller",
  ADMIN: "admin",
} as const; // 'as const' giúp TypeScript hiểu đây là các giá trị cố định

// Tạo một kiểu (Type) từ các giá trị trên
export type UserRole = (typeof ROLES)[keyof typeof ROLES]; // "bidder" | "seller" | "admin"
