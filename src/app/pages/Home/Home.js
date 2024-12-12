import React, { useState, useEffect } from 'react';
import { Card, Button, InputNumber, message, Select, Row, Col, Tabs, Input } from 'antd';
import { PlusOutlined, MinusOutlined, SearchOutlined } from '@ant-design/icons';
import { sMenuItems, sItemTypes, sLoading, fetchMenuData } from './homeStore';
import Sidebar from '../../components/Sidebar';
import { getMenuItem } from '../MenuItem/services/menuItemService';
import { getItemType } from '../ItemType/services/itemTypeService';
import { createOrder } from '../Order/services/orderService';
import './home.css';
import Loading from '../../components/Loading/Loading';

const { Option } = Select;
const { TabPane } = Tabs;

export default function Home() {
  const menuItems = sMenuItems.use();
  const itemTypes = sItemTypes.use();
  const loading = sLoading.use();
  const [selectedItems, setSelectedItems] = useState([]);
  const [tableNumber, setTableNumber] = useState(1);
  const [searchText, setSearchText] = useState('');

  const tables = Array.from({ length: 20 }, (_, i) => i + 1);

  useEffect(() => {
    if (menuItems.length === 0 || itemTypes.length === 0) {
      fetchMenuData();
    }
  }, [menuItems.length, itemTypes.length]);

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
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCreateOrder = async () => {
    if (selectedItems.length === 0) {
      message.warning('Vui lòng chọn ít nhất một món');
      return;
    }

    try {
      const orderData = {
        table: tableNumber,
        items: selectedItems.map(item => ({
          item: item._id,
          name: item.name,
          quantity: item.quantity
        })),
        totalAmount: calculateTotal(),
        status: 'pending'
      };

      await createOrder(orderData);
      message.success('Tạo đơn hàng thành công');
      setSelectedItems([]);
    } catch (error) {
      console.error('Error creating order:', error);
      message.error('Tạo đơn hàng thất bại');
    }
  };

  const filterItemsBySearch = (items) => {
    if (!searchText) return items;
    const normalizedSearch = searchText.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    
    return items.filter(item => {
      const normalizedName = item.name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return normalizedName.includes(normalizedSearch);
    });
  };

  const renderMenuItems = (typeId) => {
    let filteredItems = typeId 
      ? menuItems.filter(item => item.itemType === typeId)
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

  return (
    <div className="home">
      {loading ? <Loading /> : (<></>)}
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
                {itemTypes.map(type => (
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
                  {tables.map(num => (
                    <Option key={num} value={num}>Bàn {num}</Option>
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
                <h3>Tổng cộng: {calculateTotal().toLocaleString('vi-VN')}</h3>
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
    </div>
  );
}