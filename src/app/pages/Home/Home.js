import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { sUserInfo } from '../Login/loginStore';
import './home.css';

export default function Home() {
  const userInfo = sUserInfo.use();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userInfo || !userInfo.username) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const user = {
    name: userInfo.username,
    role: userInfo.role,
  };

  const menuItems = [
    // Menu items cho Staff
    {
      title: "Quản lý đơn hàng",
      icon: "receipt",
      path: "/orders",
      subItems: [
        { title: "Tạo đơn hàng", path: "/orders/new" },
        { title: "Danh sách đơn hàng", path: "/orders/list" },
      ]
    },
    {
      title: "Thanh toán",
      icon: "payment",
      path: "/payment",
    },
    {
      title: "Thống kê đơn hàng",
      icon: "analytics",
      path: "/statistics",
    },

    // Menu items cho Admin
    ...(user.role === "admin" ? [
      {
        title: "Quản lý nhân viên",
        icon: "people",
        path: "/employee",
        adminOnly: true,
      },
      {
        title: "Quản lý ca làm việc",
        icon: "schedule",
        path: "/shifts",
        adminOnly: true,
      },
      {
        title: "Quản lý thực đơn",
        icon: "restaurant_menu",
        path: "/menu",
        adminOnly: true,
      },
      {
        title: "Khuyến mãi",
        icon: "local_offer",
        path: "/promotions",
        adminOnly: true,
      },
      {
        title: "Báo cáo & Thống kê",
        icon: "assessment",
        path: "/reports",
        adminOnly: true,
        subItems: [
          { title: "Doanh thu", path: "/reports/revenue" },
          { title: "Hiệu suất", path: "/reports/performance" },
          { title: "Sở thích khách hàng", path: "/reports/preferences" },
        ]
      },
    ] : []),
  ];

  return (
    <div className="home">
      <Sidebar user={user} menuItems={menuItems} />
      <div className="main-content">
      </div>
    </div>
  );
}