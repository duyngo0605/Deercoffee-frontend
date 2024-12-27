import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { logoutService } from "../../pages/Login/services/loginService";
import { jwtDecode } from 'jwt-decode';
import { TOKEN } from "../../../settings/localVar";

export default function Header() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logoutService(navigate);
  };

  const token = localStorage.getItem(TOKEN);
  const user = token ? jwtDecode(token) : null;
  
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
          <Link to="/" className="nav-link">Tạo đơn hàng</Link>
          <Link to="/menu-item" className="nav-link">Thực đơn</Link>
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
