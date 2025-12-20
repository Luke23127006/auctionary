import * as TransactionRepository from '../repositories/transaction.repository';
import { ForbiddenError, NotFoundError } from '../errors';
import { TransactionDetailResponse, TransactionMessage } from '../api/dtos/responses/transaction.type';
import { mapTransactionDetailToResponse } from '../mappers/transaction.mapper';

export const verifyUserOwnership = async (userId: number, transactionId: number): Promise<void> => {
  const transaction = await TransactionRepository.findTransactionById(transactionId);

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

  if (transaction.buyer_id !== userId && transaction.seller_id !== userId) {
    throw new ForbiddenError('User does not own this transaction');
  }
}

/**
 * Get full transaction details with all related information
 * @param transactionId - Transaction ID
 * @returns Promise<TransactionDetailResponse> - Complete transaction data in camelCase
 */
export const getTransactionDetail = async (transactionId: number): Promise<TransactionDetailResponse> => {
  // Fetch transaction detail with JOINs
  const transactionRaw = await TransactionRepository.findTransactionDetailById(transactionId);

  if (!transactionRaw) {
    throw new NotFoundError('Transaction not found');
  }

  // Fetch transaction messages separately
  const messagesRaw = await TransactionRepository.findTransactionMessages(transactionId);

  // Map messages to camelCase
  const messages: TransactionMessage[] = messagesRaw.map(msg => ({
    id: msg.id,
    senderId: msg.sender_id,
    content: msg.content,
    createdAt: msg.created_at,
  }));

  // Use mapper to transform snake_case → camelCase
  return mapTransactionDetailToResponse(transactionRaw, messages);
}