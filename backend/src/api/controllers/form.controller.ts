import { Request, Response, NextFunction } from "express";
import * as formService from "../../services/form.service";
import { formatResponse } from "../../utils/response.util";
import { logger } from "../../utils/logger.util";

export const getProductSchema = async (
  _request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await formService.getProductSchema();
    formatResponse(response, 200, result);
  } catch (error) {
    logger.error("FormController", "Failed to get product schema", error);
    next(error);
  }
};
