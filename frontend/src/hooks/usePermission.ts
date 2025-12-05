import { useAuth } from "./useAuth";

export const usePermission = () => {
  const { user } = useAuth();

  /**
   * Check if the user has a specific role.
   */
  const hasRole = (requiredRole: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(requiredRole as any);
  };

  /**
   * Check if the user has a specific permission.
   * Admins have all permissions by default.
   */
  const hasPermission = (requiredPermission: string): boolean => {
    if (!user) return false;

    const isAdmin = hasRole("admin");

    if (isAdmin) {
      return true;
    }

    return user.permissions?.includes(requiredPermission) || false;
  };

  return { hasPermission, hasRole };
};
