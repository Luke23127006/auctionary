import { verifyUserOwnership } from "../../services/transaction.service";
import { ForbiddenError, NotFoundError } from "../../errors";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number | string;
    roles?: string[];
    permissions?: string[];
  };
}

export const verifyTransactionOwnership = async (request: any, response: any, next: any) => {

  try {
    let userId = (request as AuthenticatedRequest).user?.id;
    const transactionId = request.params.id;

    await verifyUserOwnership(Number(userId), Number(transactionId));
    next();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(404).json({ message: error.message });
    }
    if (error instanceof ForbiddenError) {
      return response.status(403).json({ message: error.message });
    }
    return response.status(500).json({ message: "Internal server error" });
  }
};
