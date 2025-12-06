import * as userRepository from "../repositories/user.repository";
import { UserStatsResponse } from "../api/dtos/responses/user.type";
import { NotFoundError } from "../errors";

export const getStats = async (userId: number): Promise<UserStatsResponse> => {
  const reviews = await userRepository.getPositiveNegativeReviewsById(userId);
  if (!reviews) {
    throw new NotFoundError("User not found");
  }

  const auctionsWon = await userRepository.countWonAuctions(userId);

  const positive = reviews.positive_reviews || 0;
  const negative = reviews.negative_reviews || 0;
  const totalReviews = positive + negative;

  let rating = 0;
  if (totalReviews > 0) {
    rating = Math.round((positive / totalReviews) * 100);
  }

  return {
    stats: {
      rating,
      likes: positive,
      dislikes: negative,
      auctionsWon,
    },
  };
};

export const getWatchlist = async (userId: number) => {
  return userRepository.getWatchlist(userId);
};

export const getActiveBids = async (userId: number) => {
  return userRepository.getActiveBids(userId);
};

export const getWonAuctions = async (userId: number) => {
  return userRepository.getWonAuctions(userId);
};

export const getMyListings = async (userId: number) => {
  return userRepository.getMyListings(userId);
};
