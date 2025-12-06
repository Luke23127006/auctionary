import { useState, useEffect } from "react";
import * as userService from "../services/userService";
import { useAuth } from "./useAuth";

export const useMyBids = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      userService
        .getActiveBids()
        .then((data) => setBids(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  return { bids, isLoading };
};
