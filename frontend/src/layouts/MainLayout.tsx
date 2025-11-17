import React from "react";
import Header from "../components/common/Header"; // Import Header
import Footer from "../components/common/Footer"; // Import Footer
import "./MainLayout.css"; // Import CSS cho layout

interface MainLayoutProps {
  children: React.ReactNode; // 'children' sẽ là component trang của bạn (ví dụ: HomePage)
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      {/* Header sẽ luôn ở trên cùng */}
      <Header />

      {/* 'main-content' là nơi nội dung trang của bạn sẽ được render */}
      <main className="main-content">{children}</main>

      {/* Footer sẽ luôn ở dưới cùng */}
      <Footer />
    </div>
  );
};

export default MainLayout;
