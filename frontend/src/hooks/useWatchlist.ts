import { useState, useEffect } from "react";
import * as userService from "../services/userService";
import { useAuth } from "./useAuth";

export const useWatchlist = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      userService
        .getWatchlist()
        .then((data) => setWatchlist(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  return { watchlist, isLoading };
};
