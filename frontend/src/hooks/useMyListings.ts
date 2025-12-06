import { useState, useEffect } from "react";
import * as userService from "../services/userService";
import { useAuth } from "./useAuth";

export const useMyListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      userService
        .getMyListings()
        .then((data) => setListings(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  return { listings, isLoading };
};
