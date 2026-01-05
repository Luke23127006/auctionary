import { RatingItem } from "../api/dtos/responses/user.type";

/**
 * Raw rating data from database (snake_case)
 */
interface RatingRaw {
  transaction_id: number;
  transaction_date: string;
  completed_at: string | null;
  rating: 1 | -1;
  comment: string | null;
  reviewer_id: number;
  reviewer_full_name: string;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_thumbnail_url: string | null;
  final_price: string; // numeric from DB comes as string
  user_role: "buyer" | "seller";
}

/**
 * Map raw rating data from DB (snake_case) to API response format (camelCase)
 * @param raw - Raw rating data from database
 * @returns RatingItem in camelCase
 */
export const mapRatingToResponse = (raw: RatingRaw): RatingItem => {
  return {
    transactionId: raw.transaction_id,
    transactionDate: raw.transaction_date,
    completedAt: raw.completed_at,
    rating: raw.rating,
    comment: raw.comment,
    reviewer: {
      id: raw.reviewer_id,
      fullName: raw.reviewer_full_name,
    },
    product: {
      id: raw.product_id,
      name: raw.product_name,
      slug: raw.product_slug,
      thumbnailUrl: raw.product_thumbnail_url,
    },
    finalPrice: Number(raw.final_price),
    userRole: raw.user_role,
  };
};
