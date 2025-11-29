import { useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import { AdminOverview } from "../../components/auction/AdminOverview";
import { CategoryManagement } from "../../components/auction/CategoryManagement";
import { UserManagement } from "../../components/auction/UserManagement";
import { ProductManagement } from "../../components/auction/ProductManagement";

type AdminPage = "overview" | "categories" | "users" | "products";

export default function App() {
  const [currentPage, setCurrentPage] = useState<AdminPage>("overview");

  return (
    <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === "overview" && <AdminOverview />}
      {currentPage === "categories" && <CategoryManagement />}
      {currentPage === "users" && <UserManagement />}
      {currentPage === "products" && <ProductManagement />}
    </AdminLayout>
  );
}
