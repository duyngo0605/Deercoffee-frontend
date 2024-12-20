import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './sidebar.css';
import { getMenuItems } from '../../../settings/localVar';
import { jwtDecode } from 'jwt-decode';
import { TOKEN } from '../../../settings/localVar';
import { logoutService } from '../../pages/Login/services/loginService';

export default function Sidebar() {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem(TOKEN);
  const user = token ? jwtDecode(token) : null;
  const menuItems = user ? getMenuItems(user?.role) : null;

  const getAvatar = (role) => {
    return role === 'admin' 
      ? `${process.env.PUBLIC_URL}/adminAvatar.png`
      : `${process.env.PUBLIC_URL}/staffAvatar.png`;
  };

  const handleItemClick = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleLogout = () => {
    logoutService(navigate);
  };

  if (!user) {
    return <></>;
  }

  return (
    <div className="sidebar">
      <div className="user-profile">
        <img 
          src={getAvatar(user?.role)} 
          alt={user?.username} 
          className="user-avatar"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = `${process.env.PUBLIC_URL}/defaultAvatar.png`; // Fallback image
          }}
        />
        <div className="user-info">
          <h3>{user?.username}</h3>
          <span className="user-role">{user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="nav-item-container">
            {item?.subItems ? (
              <div className={`nav-item ${expandedItem === index ? 'expanded' : ''}`}>
                <div 
                  className="nav-item-header"
                  onClick={() => handleItemClick(index)}
                >
                  <span className="material-icons">{item?.icon}</span>
                  <span>{item?.title}</span>
                  <span className="material-icons arrow">
                    {expandedItem === index ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                {expandedItem === index && (
                  <div className="sub-items">
                    {item?.subItems?.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem?.path}
                        className={`sub-item ${location?.pathname === subItem?.path ? 'active' : ''}`}
                      >
                        {subItem?.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item?.path}
                className={`nav-item ${location?.pathname === item?.path ? 'active' : ''}`}
              >
                <span className="material-icons">{item?.icon}</span>
                <span>{item?.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/logout" className="logout-button" onClick={handleLogout}>
          <span className="material-icons" >logout</span>
          <span>Đăng xuất</span>
        </Link>
      </div>
    </div>
  );
}