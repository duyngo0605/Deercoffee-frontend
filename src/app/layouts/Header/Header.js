import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearUserInfo } from "../../pages/Login/loginStore";
import "./Header.css";
import { logoutService } from "../../pages/Login/services/loginService";
import { jwtDecode } from 'jwt-decode';
import { TOKEN } from "../../../settings/localVar";

export default function Header() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logoutService(navigate);
  };

  const user = jwtDecode(localStorage.getItem(TOKEN));
  
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img 
            src={`${process.env.PUBLIC_URL}/deerCoffeeLogo.png`} 
            alt="Deer Coffee Logo" 
          />
          <span className="brand-title">Deer Coffee</span>
        </Link>
       
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/products" className="nav-link">Sản phẩm</Link>
          <Link to="/about" className="nav-link">Về chúng tôi</Link>
          <Link to="/contact" className="nav-link">Liên hệ</Link>
        </nav>

        <div className="auth-buttons">
          {user && user.username ? (
            <>
              <span className="user-name">{user.username}</span>
              <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
            </>
          ) : (
            <Link to="/login" className="login-btn">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
}
