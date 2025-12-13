import apiClient from "./apiClient";
import type {
  AdminUserListResponse,
  UpgradeRequestListResponse,
  UpgradeRequestActionResponse,
  SuspendUserResponse,
} from "../types/admin";

/**
 * Get all users for admin management
 */
export const getAllUsers = async (): Promise<AdminUserListResponse> => {
  return apiClient.get("/admin/users", true);
};

/**
 * Get all upgrade requests
 */
export const getAllUpgradeRequests =
  async (): Promise<UpgradeRequestListResponse> => {
    return apiClient.get("/admin/upgrade-requests", true);
  };

/**
 * Approve an upgrade request
 */
export const approveUpgradeRequest = async (
  requestId: number
): Promise<UpgradeRequestActionResponse> => {
  return apiClient.patch(
    `/admin/upgrade-requests/${requestId}/approve`,
    {},
    true
  );
};

/**
 * Reject an upgrade request
 */
export const rejectUpgradeRequest = async (
  requestId: number
): Promise<UpgradeRequestActionResponse> => {
  return apiClient.patch(
    `/admin/upgrade-requests/${requestId}/reject`,
    {},
    true
  );
};

/**
 * Suspend a user account
 */
export const suspendUser = async (
  userId: number
): Promise<SuspendUserResponse> => {
  return apiClient.patch(`/admin/users/${userId}/suspend`, {}, true);
};
