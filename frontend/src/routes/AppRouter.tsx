import { Routes, Route } from "react-router-dom";

// 1. Import các "gác cổng"
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

// 2. Import các vai trò (ROLES)
import { ROLES } from "../constants/roles";

// 3. Import các trang
import UnderDevelopmentPage from "../pages/UnderDevelopmentPage"; // Trang đang phát triển
import UnauthorizedPage from "../pages/UnauthorizedPage"; // Trang 403
import NotFoundPage from "../pages/NotFoundPage"; // Trang 404

// (Import các trang thật của bạn)
// import HomePage from "../pages/HomePage";
// import LoginPage from "../pages/LoginPage";
// import ProfilePage from "../pages/ProfilePage";
// import AdminDashboard from "../pages/AdminDashboard";

const AppRouter = () => {
  return (
    <Routes>
      {/* ============================================== */}
      {/* TUYẾN ĐƯỜNG CÔNG KHAI (Guest, Bidder, Seller, Admin) */}
      {/* ============================================== */}
      <Route path="/" element={<UnderDevelopmentPage /* <HomePage /> */ />} />
      <Route path="/auction/:id" element={<UnderDevelopmentPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />{" "}
      {/* Trang 403 */}
      <Route path="*" element={<NotFoundPage />} /> {/* Trang 404 */}
      {/* ============================================== */}
      {/* TUYẾN ĐƯỜNG CÔNG KHAI (CHỈ CHO KHÁCH) */}
      {/* ============================================== */}
      <Route element={<PublicOnlyRoute />}>
        <Route
          path="/login"
          element={<UnderDevelopmentPage /* <LoginPage /> */ />}
        />
        <Route
          path="/register"
          element={<UnderDevelopmentPage /* <RegisterPage /> */ />}
        />
      </Route>
      {/* ============================================== */}
      {/* TUYẾN ĐƯỜG ĐƯỢC BẢO VỆ (RBAC) */}
      {/* ============================================== */}
      {/* --- Cần ít nhất là BIDDER (Tức là tất cả user đã login) --- */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.BIDDER, ROLES.SELLER, ROLES.ADMIN]}
          />
        }
      >
        <Route
          path="/profile"
          element={<UnderDevelopmentPage /* <ProfilePage /> */ />}
        />
        {/* (Các trang đấu giá, xem bid history...) */}
      </Route>
      {/* --- Cần ít nhất là SELLER (Seller và Admin có thể vào) --- */}
      <Route
        element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN]} />}
      >
        <Route path="/my-auctions" element={<UnderDevelopmentPage />} />
        <Route path="/auctions/new" element={<UnderDevelopmentPage />} />
      </Route>
      {/* --- Chỉ dành cho ADMIN --- */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin/dashboard" element={<UnderDevelopmentPage />} />
        <Route path="/admin/users" element={<UnderDevelopmentPage />} />
        <Route path="/admin/categories" element={<UnderDevelopmentPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
