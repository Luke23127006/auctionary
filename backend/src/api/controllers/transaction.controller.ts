import * as TransactionService from '../../services/transaction.service';
import { Request, Response, NextFunction } from 'express';

export const getTransactionDetail = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const transactionId = Number(request.params.id);
    const transaction = await TransactionService.getTransactionDetail(transactionId);
    response.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
}