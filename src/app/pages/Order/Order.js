import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message, Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
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
  const [searchText, setSearchText] = useState('');
  const [searchDate, setSearchDate] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrder();
      const sortedOrders = data.sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(sortedOrders);
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

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesText = searchText
        ? order.items.some(item => 
            item.name.toLowerCase().includes(searchText.toLowerCase())
          )
        : true;

      const matchesDate = searchDate
        ? moment(order.orderDate).format('YYYY-MM-DD') === searchDate.format('YYYY-MM-DD')
        : true;

      return matchesText && matchesDate;
    });
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
      sorter: {
        compare: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
        multiple: 1
      },
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend']
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
              <button
                className="order-action-btn complete"
                onClick={() => handleStatusChange(record._id, 'completed')}
              >
                Hoàn thành
              </button>
              <button
                className="order-action-btn cancel"
                onClick={() => handleStatusChange(record._id, 'cancelled')}
              >
                Hủy
              </button>
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
        
        <div className="search-container">
          <Input
            placeholder="Tìm theo tên món..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="search-input"
          />
          <DatePicker
            placeholder="Chọn ngày"
            onChange={date => setSearchDate(date)}
            format="DD/MM/YYYY"
            className="date-picker"
          />
        </div>

        <Table
          columns={columns}
          dataSource={getFilteredOrders()}
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
