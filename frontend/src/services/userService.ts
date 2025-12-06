import apiClient from "./apiClient";
import type { UserStatsResponse } from "../types/user";

export const getStats = async (): Promise<UserStatsResponse> => {
  return apiClient.get("/users/me/stats", true);
};

export const getWatchlist = async () => {
  return apiClient.get("/users/me/watchlist", true);
};

export const getActiveBids = async () => {
  return apiClient.get("/users/me/bids", true);
};

export const getWonAuctions = async () => {
  return apiClient.get("/users/me/won-auctions", true);
};

export const getMyListings = async () => {
  return apiClient.get("/users/me/listings", true);
};
