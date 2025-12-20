import apiClient from "./apiClient";
import type { TransactionDetailResponse } from "../types/transaction";
import type {
  PaymentSubmitData,
  ShippingSubmitData,
  DeliveryConfirmData,
  ReviewSubmitData,
} from "../types/transactionActions";

/**
 * Get transaction details by ID
 * @param transactionId - Transaction ID
 * @returns Promise<TransactionResponse> - Full transaction data
 */
export const getTransactionById = async (
  transactionId: number
): Promise<TransactionDetailResponse> => {
  // apiClient.get() already unwraps { success: true, data: {...} } → returns data directly
  const data = await apiClient.get<TransactionDetailResponse>(
    `/transactions/${transactionId}`,
    true // requires authentication
  );
  return data;
};

/**
 * Submit payment proof and shipping info (Buyer - Step 1)
 * @param transactionId - Transaction ID
 * @param data - Payment proof file and shipping info
 * @returns Promise<TransactionDetailResponse> - Updated transaction
 */
export const submitPayment = async (
  transactionId: number,
  data: PaymentSubmitData
): Promise<TransactionDetailResponse> => {
  const formData = new FormData();
  formData.append("paymentProof", data.paymentProof);
  formData.append("shippingFullName", data.shippingInfo.fullName);
  formData.append("shippingAddress", data.shippingInfo.address);
  formData.append("shippingCity", data.shippingInfo.city);
  formData.append("shippingPhoneNumber", data.shippingInfo.phone);

  const response = await apiClient.post<TransactionDetailResponse>(
    `/transactions/${transactionId}/payment`,
    formData,
    true
  );
  return response;
};

/**
 * Confirm payment and upload shipping proof (Seller - Step 2)
 * @param transactionId - Transaction ID
 * @param data - Shipping proof file and payment confirmation
 * @returns Promise<TransactionDetailResponse> - Updated transaction
 */
export const confirmAndShip = async (
  transactionId: number,
  data: ShippingSubmitData
): Promise<TransactionDetailResponse> => {
  const formData = new FormData();
  formData.append("shippingProof", data.shippingProof);
  formData.append("paymentConfirmed", data.paymentConfirmed.toString());

  const response = await apiClient.post<TransactionDetailResponse>(
    `/transactions/${transactionId}/shipping`,
    formData,
    true
  );
  return response;
};

/**
 * Confirm delivery received (Buyer - Step 3)
 * @param transactionId - Transaction ID
 * @param data - Delivery confirmation
 * @returns Promise<TransactionDetailResponse> - Updated transaction
 */
export const confirmDelivery = async (
  transactionId: number,
  data: DeliveryConfirmData
): Promise<TransactionDetailResponse> => {
  const response = await apiClient.post<TransactionDetailResponse>(
    `/transactions/${transactionId}/delivery`,
    data,
    true
  );
  return response;
};

/**
 * Submit review (Buyer/Seller - Step 4)
 * @param transactionId - Transaction ID
 * @param data - Review rating and comment
 * @returns Promise<TransactionDetailResponse> - Updated transaction
 */
export const submitReview = async (
  transactionId: number,
  data: ReviewSubmitData
): Promise<TransactionDetailResponse> => {
  const response = await apiClient.post<TransactionDetailResponse>(
    `/transactions/${transactionId}/review`,
    data,
    true
  );
  return response;
};
