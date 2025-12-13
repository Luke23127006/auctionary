import { useState, useEffect } from "react";
import * as adminService from "../services/adminService";
import type { UpgradeRequest } from "../types/admin";
import { toast } from "sonner";

export const useUpgradeRequests = () => {
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getAllUpgradeRequests();
      setRequests(response.requests);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch upgrade requests";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to fetch upgrade requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveRequest = async (requestId: number, userName: string) => {
    try {
      await adminService.approveUpgradeRequest(requestId);
      toast.success(`Approved seller request for ${userName}!`);
      // Refresh requests list
      await fetchRequests();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to approve request";
      toast.error(errorMessage);
      console.error("Failed to approve request:", err);
    }
  };

  const handleRejectRequest = async (requestId: number, userName: string) => {
    try {
      await adminService.rejectUpgradeRequest(requestId);
      toast.error(`Rejected seller request for ${userName}`);
      // Refresh requests list
      await fetchRequests();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reject request";
      toast.error(errorMessage);
      console.error("Failed to reject request:", err);
    }
  };

  return {
    requests,
    isLoading,
    error,
    refreshRequests: fetchRequests,
    handleApproveRequest,
    handleRejectRequest,
  };
};
