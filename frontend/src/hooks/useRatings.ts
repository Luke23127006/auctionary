import { useState, useEffect } from "react";
import * as userService from "../services/userService";
import type { RatingItem, RatingSummary } from "../types/user";

export const useRatings = (role: "buyer" | "seller" | "all" = "all") => {
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [summary, setSummary] = useState<RatingSummary>({
    totalPositive: 0,
    totalNegative: 0,
    positivePercentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await userService.getRatings(role);
        setRatings(response.ratings);
        setSummary(response.summary);
      } catch (err) {
        console.error("Failed to fetch ratings:", err);
        setError("Failed to load ratings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [role]);

  return { ratings, summary, isLoading, error };
};
