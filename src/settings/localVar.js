export const BE_ENDPOINT = 'http://localhost:5000/api/';

export const USERNAME = 'username';
export const TOKEN = 'token';

export const getMenuItems = (role) => {
  switch (role) {
    case 'admin':
      return [
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
          path: "/item-type",
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
      ];
    case 'staff':
      return [
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
        {
          title: 'Menu',
          icon: 'restaurant_menu',
          path: '/menu-item'
        },
      ];
    default:
      return [];
  }
};
