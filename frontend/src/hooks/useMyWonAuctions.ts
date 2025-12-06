import { useState, useEffect } from "react";
import * as userService from "../services/userService";
import { useAuth } from "./useAuth";

export const useMyWonAuctions = () => {
  const { user } = useAuth();
  const [wonAuctions, setWonAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      userService
        .getWonAuctions()
        .then((data) => setWonAuctions(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  return { wonAuctions, isLoading };
};
