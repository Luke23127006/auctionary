import { useState, useEffect } from "react";
import * as homeService from "../services/homeService";
import type { HomeSections } from "../types/home";

interface UseHomeSectionsReturn {
  sections: HomeSections | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching home page sections
 * Backend already provides isNewArrival (createdAt < 1 day)
 */
export const useHomeSections = (): UseHomeSectionsReturn => {
  const [sections, setSections] = useState<HomeSections | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await homeService.getHomeSections();

      setSections(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load home sections"
      );
      console.error("Failed to fetch home sections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return {
    sections,
    isLoading,
    error,
    refetch: fetchSections,
  };
};
