import jwt from "jsonwebtoken";
import { envConfig } from "../../configs/env.config";

export const userIdentifier = (req: any, _res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      envConfig.JWT_ACCESS_SECRET as string
    );

    req.user = decoded;
    next();
  } catch (error) {
    next();
  }
};