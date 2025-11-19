import prisma from "../database/prisma";
import * as userRepo from "./user.repository";

/**
 * Tìm một tài khoản xã hội dựa trên provider và providerId
 */
export const findSocialAccount = async (
  provider: string,
  providerId: string
) => {
  return prisma.social_accounts.findUnique({
    where: {
      provider_provider_id: {
        provider,
        provider_id: providerId,
      },
    },
    include: { users: true },
  });
};

/**
 * Tạo một liên kết tài khoản xã hội mới
 */
export const createSocialAccount = async (data: {
  userId: number;
  provider: string;
  providerId: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
}) => {
  return prisma.social_accounts.create({
    data: {
      user_id: data.userId,
      provider: data.provider,
      provider_id: data.providerId,
      email: data.email,
      name: data.name,
      avatar_url: data.avatarUrl,
    },
  });
};

/**
 * Tìm hoặc tạo mới User và Social Account
 * Đây là logic phức tạp mà chúng ta tách ra từ Service
 */
const mapUserToResponse = (user: any) => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    address: user.address,
    isVerified: user.is_verified,
    status: user.status,
    positiveReviews: user.positive_reviews,
    negativeReviews: user.negative_reviews,
    password: user.password,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

export const findOrCreateUserFromSocial = async (
  provider: string,
  providerId: string,
  email: string,
  name: string | null,
  avatarUrl: string | null
) => {
  let socialAccount = await findSocialAccount(provider, providerId);

  if (socialAccount) {
    return mapUserToResponse(socialAccount.users);
  }

  let user = await userRepo.findByEmail(email);

  if (!user) {
    const newUser = {
      email,
      full_name: name || "New User",
      is_verified: true,
      status: "active",
    };
    user = await userRepo.createUser(newUser);
  }

  if (!user) {
    return null;
  }

  await createSocialAccount({
    userId: user.id,
    provider,
    providerId,
    email,
    name,
    avatarUrl,
  });

  return user;
};
