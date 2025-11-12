import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Hook useAuth
import type { UserRole } from "../constants/roles"; // Import kiểu Role

// 1. ĐỊNH NGHĨA PROPS MÀ COMPONENT SẼ NHẬN
// Đây chính là phần code đang "thiếu" của bạn
interface ProtectedRouteProps {
  allowedRoles: UserRole[]; // Ví dụ: ['seller', 'admin']
}

// 2. Component nhận props
const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  // 3. Kiểm tra đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. KIỂM TRA QUYỀN (RBAC)
  // So sánh role của user với mảng 'allowedRoles' được truyền vào
  const hasPermission = user && allowedRoles.includes(user.role);

  if (hasPermission) {
    // 5. CÓ QUYỀN: Cho phép đi tiếp
    return <Outlet />;
  } else {
    // 6. KHÔNG CÓ QUYỀN: "Đá" về trang Cấm truy cập
    return <Navigate to="/unauthorized" replace />;
  }
};

export default ProtectedRoute;
