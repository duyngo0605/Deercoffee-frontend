import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message } from 'antd';
import { getOrder, updateOrder } from './services/orderService';
import Sidebar from '../../components/Sidebar';
import './order.css';

const statusColors = {
  pending: 'processing',
  completed: 'success',
  cancelled: 'error'
};

const statusLabels = {
  pending: 'Đang làm',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrder();
      setOrders(data);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      message.success('Cập nhật trạng thái thành công');
      fetchOrders(); // Refresh danh sách
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const columns = [
    {
      title: 'Bàn số',
      dataIndex: 'table',
      key: 'table',
    },
    {
      title: 'Món đặt',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <ul className="order-items-list">
          {items.map((item, index) => (
            <li key={index}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `${amount.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <a onClick={() => handleStatusChange(record._id, 'completed')}>
                Hoàn thành
              </a>
              <a onClick={() => handleStatusChange(record._id, 'cancelled')}>
                Hủy
              </a>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="order-page">
      <Sidebar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Danh sách đơn hàng</h2>
        </div>
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng số ${total} đơn hàng`,
          }}
        />
      </div>
    </div>
  );
}
