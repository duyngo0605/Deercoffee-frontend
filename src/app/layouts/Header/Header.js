import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { sUserInfo, clearUserInfo } from "../../pages/Login/loginStore";
import "./Header.css";
import { logoutService } from "../../pages/Login/services/loginService";

export default function Header() {
  const navigate = useNavigate();
  const userInfo = sUserInfo.use();
  
  const handleLogout = () => {
    logoutService(navigate);
    clearUserInfo();
  };
  
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate("/")}>
          <span className="logo-text">Logo</span>
        </div>
        
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/products" className="nav-link">Sản phẩm</Link>
          <Link to="/about" className="nav-link">Về chúng tôi</Link>
          <Link to="/contact" className="nav-link">Liên hệ</Link>
        </nav>

        <div className="auth-buttons">
          {userInfo && userInfo.username ? (
            <>
              <span className="user-name">{userInfo.username}</span>
              <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Đăng nhập</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
