import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// 1. Import guards
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

// 2. Import roles
import { ROLES } from "../constants/roles";

// 3. Lazy load pages
const UnderDevelopmentPage = lazy(
  () => import("../pages/Error/UnderDevelopmentPage")
);
const UnauthorizedPage = lazy(() => import("../pages/Error/Forbidden"));
const NotFoundPage = lazy(() => import("../pages/Error/NotFoundPage"));
const SignupPage = lazy(() => import("../pages/Auth/SignupPage"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const VerifyOTPPage = lazy(() => import("../pages/Auth/VerifyOTPPage"));
const HomePage = lazy(() => import("../pages/Home/HomePage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/Auth/ForgotPasswordPage")
);
const UIKitPage = lazy(() => import("../pages/Dev/UIKitPage"));
const ProductListPage = lazy(() => import("../pages/Product/ProductListPage"));
const ProductDetailPage = lazy(
  () => import("../pages/Product/ProductDetailPage")
);
const UserProfilePage = lazy(() => import("../pages/Account/UserProfilePage"));
const OtherUserProfilePage = lazy(
  () => import("../pages/Account/OtherUserProfilePage")
);
const SellerDashboardPage = lazy(
  () => import("../pages/Seller/SellerDashboardPage")
);
const CreateAuctionPage = lazy(
  () => import("../pages/Seller/CreateAuctionPage")
);
const TransactionRoomPage = lazy(
  () => import("../pages/Product/TransactionRoomPage")
);
const AdminDashboardPage = lazy(
  () => import("../pages/Admin/AdminDashboardPage")
);
const MemberIntroductionPage = lazy(
  () => import("../pages/Infomation/MemberIntroductionPage")
);
const BidderProtectionPage = lazy(
  () => import("../pages/Infomation/BidderProtectionPage")
);

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ============================================== */}
        {/* PUBLIC ROUTES (Accessible to everyone) */}
        {/* ============================================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/under-development" element={<UnderDevelopmentPage />} />

        {/* Information Routes */}
        <Route path="/info/members" element={<MemberIntroductionPage />} />
        <Route
          path="/info/bidder-protection"
          element={<BidderProtectionPage />}
        />

        {/* Dev Routes */}
        <Route path="/dev/ui-kit" element={<UIKitPage />} />

        {/* ============================================== */}
        {/* PUBLIC ONLY ROUTES (Guest users only) */}
        {/* ============================================== */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* ============================================== */}
        {/* PROTECTED ROUTES - All Authenticated Users */}
        {/* ============================================== */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.BIDDER, ROLES.SELLER, ROLES.ADMIN]}
            />
          }
        >
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/users/:id/profile" element={<OtherUserProfilePage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
        </Route>

        {/* ============================================== */}
        {/* PROTECTED ROUTES - Bidder & Seller */}
        {/* ============================================== */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.BIDDER, ROLES.SELLER]} />
          }
        >
          <Route path="/transactions/:id" element={<TransactionRoomPage />} />
        </Route>

        {/* ============================================== */}
        {/* PROTECTED ROUTES - Seller Only */}
        {/* ============================================== */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.SELLER]} />}>
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
          <Route
            path="/seller/auction/create"
            element={<CreateAuctionPage />}
          />
        </Route>

        {/* ============================================== */}
        {/* PROTECTED ROUTES - Admin Only */}
        {/* ============================================== */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>

        {/* ============================================== */}
        {/* CATCH ALL - 404 */}
        {/* ============================================== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
