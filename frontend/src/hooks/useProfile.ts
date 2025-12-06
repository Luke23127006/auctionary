import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import * as userService from "../services/userService";
import type { UserStats } from "../types/user";

export const useProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await userService.getStats();
        setStats(response.stats);
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
        setError("Failed to load user statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { user, stats, isLoading, error };
};
