export const authorize = (requiredPermission: string) => {
  return (req: any, res: any, next: any) => {
    try {
      const user = req.user;

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User info missing" });
      }

      if (user.roles?.includes("ADMIN")) {
        return next();
      }

      if (!user.permissions?.includes(requiredPermission)) {
        return res.status(403).json({
          message:
            "Forbidden: You don't have permission to perform this action.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
