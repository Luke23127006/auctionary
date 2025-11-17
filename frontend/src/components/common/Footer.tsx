import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Import CSS

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Cột 1: Về Auctionary */}
        <div className="footer-section about">
          <h3 className="footer-logo">Auctionary</h3>
          <p>
            Nền tảng đấu giá trực tuyến đáng tin cậy nhất. Tìm kiếm, đặt giá, và
            chiến thắng các sản phẩm độc đáo.
          </p>
        </div>

        {/* Cột 2: Các liên kết nhanh */}
        <div className="footer-section links">
          <h4>Điều Hướng</h4>
          <ul>
            <li>
              <Link to="/">Trang Chủ</Link>
            </li>
            <li>
              <Link to="/categories">Các Danh Mục</Link>
            </li>
            <li>
              <Link to="/how-it-works">Cách Thức Hoạt Động</Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Pháp lý & Hỗ trợ */}
        <div className="footer-section legal">
          <h4>Hỗ Trợ</h4>
          <ul>
            <li>
              <Link to="/about-us">Về Chúng Tôi</Link>
            </li>
            <li>
              <Link to="/contact">Liên Hệ</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Chính Sách Bảo Mật</Link>
            </li>
            <li>
              <Link to="/terms-of-service">Điều Khoản Dịch Vụ</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Dòng cuối cùng: Copyright */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Auctionary. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
