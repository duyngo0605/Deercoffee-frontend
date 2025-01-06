import React, { useState, useEffect } from 'react';
import { Card, Button, InputNumber, message, Select, Row, Col, Tabs, Input, Modal } from 'antd';
import { PlusOutlined, MinusOutlined, SearchOutlined } from '@ant-design/icons';
import { sMenuItems, sItemTypes, sLoading, fetchMenuData } from './homeStore';
import Sidebar from '../../components/Sidebar';
import { createOrder } from '../Order/services/orderService';
import { getVoucher } from '../Voucher/services/voucherService';
import './home.css';
import Loading from '../../components/Loading/Loading';
import html2pdf from 'html2pdf.js';

const { Option } = Select;
const { TabPane } = Tabs;

export default function Home() {
  const menuItems = sMenuItems.use();
  const itemTypes = sItemTypes.use();
  const loading = sLoading.use();
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [tableNumber, setTableNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const tables = Array.from({ length: 20 }, (_, i) => i + 1);

  useEffect(() => {
    if (menuItems.length === 0 || itemTypes.length === 0) {
      fetchMenuData();
    }
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const data = await getVoucher();
      setVouchers(data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  const handleAddItem = (item) => {
    const existingItem = selectedItems.find((i) => i._id === item._id);
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity === 0) {
      setSelectedItems(selectedItems.filter((item) => item._id !== itemId));
    } else {
      setSelectedItems(
        selectedItems.map((item) =>
          item._id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    if (selectedVoucher)
      return subtotal - (subtotal * selectedVoucher.discount) / 100;
    else
      return subtotal;
  };

  const handleCreateOrder = async () => {
    if (selectedItems.length === 0) {
      message.warning('Vui lòng chọn ít nhất một món');
      return;
    }

    try {
      const orderData = {
        table: tableNumber,
        items: selectedItems.map((item) => ({
          item: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: calculateTotal(),
        voucher: selectedVoucher,
        finalAmount: calculateTotal(),
        status: 'pending'
      };

      const createdOrder = await createOrder(orderData);
      setOrderDetails(createdOrder);
      setIsModalVisible(true);
      message.success('Tạo đơn hàng thành công');
    } catch (error) {
      console.error('Error creating order:', error);
      message.error('Tạo đơn hàng thất bại');
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedItems([]);
    setSelectedVoucher();
  };

  const filterItemsBySearch = (items) => {
    if (!searchText) return items;
    const normalizedSearch = searchText.toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');

    return items.filter((item) => {
      const normalizedName = item.name.toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
      return normalizedName.includes(normalizedSearch);
    });
  };

  const renderMenuItems = (typeId) => {
    let filteredItems = typeId
      ? menuItems.filter((item) => item.itemType === typeId)
      : menuItems;

    filteredItems = filterItemsBySearch(filteredItems);

    return (
      <Row gutter={[16, 16]}>
        {filteredItems.map((item) => (
          <Col span={8} key={item._id}>
            <Card
              hoverable
              onClick={(e) => handleAddItem(item, e)}
              cover={item.image && <img alt={item.name} src={item.image} />}
            >
              <Card.Meta
                title={item.name}
                description={`${item.price.toLocaleString('vi-VN')}`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const checkVoucherDate = (voucher) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const expiryDate = new Date(voucher.expiryDate);
    return now >= startDate && now < expiryDate;
  };

  const handleVoucherChange = (voucher) => {
    if (voucher) {
      setSelectedVoucher(voucher);
    } else {
      setSelectedVoucher();
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById('invoice-content');
    const opt = {
      margin: 1,
      filename: `hoa-don-ban-${orderDetails.table}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="home">
      {loading ? <Loading /> : <></>}
      <Sidebar />
      <div className="main-content">
        <Row gutter={24}>
          <Col span={16}>
            <div className="menu-items">
              <div className="menu-header">
                <h2>Danh sách món</h2>
                <Input
                  placeholder="Tìm kiếm món..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                  allowClear
                />
              </div>
              <Tabs defaultActiveKey="all">
                <TabPane tab="Tất cả" key="all">
                  {renderMenuItems()}
                </TabPane>
                {itemTypes.map((type) => (
                  <TabPane tab={type.name} key={type._id}>
                    {renderMenuItems(type._id)}
                  </TabPane>
                ))}
              </Tabs>
            </div>
          </Col>
          <Col span={8}>
            <div className="order-summary">
              <h2>Hóa đơn</h2>
              <div className="table-select">
                <Select
                  value={tableNumber}
                  onChange={setTableNumber}
                  style={{ width: '100%', marginBottom: '1rem' }}
                >
                  {tables.map((num) => (
                    <Option key={num} value={num}>
                      Bàn {num}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="selected-items">
                {selectedItems.map((item) => (
                  <div key={item._id} className="selected-item">
                    <span>{item.name}</span>
                    <div className="quantity-control">
                      <Button
                        icon={<MinusOutlined />}
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      />
                      <InputNumber
                        min={0}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(item._id, value)}
                      />
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      />
                    </div>
                    <span>{(item.price * item.quantity).toLocaleString('vi-VN')}</span>
                  </div>
                ))}
              </div>
              <div className="total">
                <div>
                  <Select
                    style={{ width: '100%', marginBottom: '1rem' }}
                    allowClear
                    onChange={(value) => {
                      const voucher = vouchers.find((v) => v._id === value);
                      handleVoucherChange(voucher);
                    }}
                  >
                    {vouchers.map((item) => (
                      <Option
                        key={item._id}
                        value={item._id}
                        disabled={!checkVoucherDate(item)}
                      >
                        {item.code}
                      </Option>
                    ))}
                  </Select>
                </div>
                <h3 className="totalHeading">
                  Tổng cộng (trước giảm giá):{' '}
                  <span className="totalAmount">
                    {selectedItems
                      .reduce((total, item) => total + item.price * item.quantity, 0)
                      .toLocaleString('vi-VN')}
                  </span>
                </h3>
                <h3 className="totalHeading">
                  Giảm giá: <span className="totalAmount">{selectedVoucher ? selectedVoucher.discount : 0}%</span>
                </h3>
                <h3 className="totalHeading">
                  Thành tiền: <span className="totalAmount">{calculateTotal().toLocaleString('vi-VN')}</span>
                </h3>
                <Button
                  type="primary"
                  block
                  onClick={handleCreateOrder}
                  disabled={selectedItems.length === 0}
                >
                  Tạo đơn hàng
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      
      <Modal
        title="Chi tiết hóa đơn"
        open={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="export" type="primary" onClick={handleExportPDF} style={{ marginRight: 8 }}>
            Xuất PDF
          </Button>,
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>
        ]}
      >
        {orderDetails && (
          <div className="invoice-details" id="invoice-content">
            <div className="invoice-header">
              <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>DEER COFFEE</h1>
              <p style={{ textAlign: 'center', margin: '5px 0' }}>123 Nguyễn Văn A, Quận 1, TP.HCM</p>
              <p style={{ textAlign: 'center', margin: '5px 0' }}>Hotline: 0123 456 789</p>
              <h2 style={{ textAlign: 'center', margin: '20px 0' }}>HÓA ĐƠN THANH TOÁN</h2>
            </div>
            <div className="invoice-info">
              <p><strong>Bàn số:</strong> {orderDetails.table}</p>
              <p><strong>Thời gian:</strong> {new Date(orderDetails.orderDate).toLocaleString('vi-VN')}</p>
            </div>
            <div className="order-items">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Tên món</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price?.toLocaleString('vi-VN')} đ</td>
                      <td>{(item.price * item.quantity)?.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="invoice-summary">
              <div className="summary-row">
                <span>Tổng cộng:</span>
                <span><strong>{selectedItems
                  .reduce((total, item) => total + item.price * item.quantity, 0)
                  .toLocaleString('vi-VN')}</strong></span>
              </div>
              {orderDetails.voucher && (
                <>
                  <div className="summary-row">
                    <span>Mã giảm giá ({selectedVoucher?.code}):</span>
                    <span><strong>{selectedVoucher?.discount}%</strong></span>
                  </div>
                  <div className="summary-row">
                    <span>Thành tiền:</span>
                    <span><strong>{calculateTotal().toLocaleString('vi-VN')}</strong></span>
                  </div>
                </>
              )}
            </div>
            <div className="invoice-footer">
              <p style={{ textAlign: 'center', marginTop: '30px' }}>Cảm ơn quý khách và hẹn gặp lại!</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
