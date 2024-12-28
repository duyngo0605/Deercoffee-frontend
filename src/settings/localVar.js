export const BE_ENDPOINT = 'http://localhost:5000/api/';

export const USERNAME = 'username';
export const TOKEN = 'token';

export const getMenuItems = (role) => {
  switch (role) {
    case 'admin':
      return [
        {
          title: "Quản lý tài khoản",
          icon: "manage_accounts",
          path: "/user",
        },
        {
          title: "Quản lý đơn hàng",
          icon: "receipt",
          path: "/order",
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
          path: "/shift",
          adminOnly: true,
        },
        {
          title: "Quản lý thực đơn",
          icon: "restaurant_menu",
          path: "/item-type",
          adminOnly: true,
        },
        {
          title: "Quản lý đặt bàn",
          icon: "table_restaurant",
          path: "/reservation",
        },
        {
          title: "Quản lý khuyến mãi",
          icon: "local_offer",
          path: "/voucher",
          adminOnly: true,
        },
        {
          title: "Báo cáo & Thống kê",
          icon: "assessment",
          path: "/report",
          adminOnly: true,
        },
      ];
    case 'staff':
      return [
        {
          title: "Quản lý đơn hàng",
          icon: "receipt",
          path: "/order",
        },
        {
          title: "Xem thực đơn",
          icon: "restaurant_menu",
          path: "/item-type",
        },
        {
          title: "Quản lý đặt bàn",
          icon: "table_restaurant",
          path: "/reservation",
        },
        {
          title: "Xem danh sách khuyến mãi",
          icon: "local_offer",
          path: "/voucher",
        },
      ];
    default:
      return [];
  }
};