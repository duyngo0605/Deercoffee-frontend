import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, UnorderedListOutlined, PlusOutlined } from '@ant-design/icons';
import { getItemType, createItemType, updateItemType, deleteItemType } from './services/itemTypeService';
import Sidebar from '../../components/Sidebar';
import './itemType.css';
import { useNavigate } from 'react-router-dom';

export default function ItemType() {
  const navigate = useNavigate();
  const [itemTypes, setItemTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchItemTypes();
  }, []);

  const fetchItemTypes = async () => {
    setLoading(true);
    try {
      const data = await getItemType();
      setItemTypes(data);
    } catch (error) {
      message.error('Không thể tải danh sách loại món');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (itemType) => {
    setEditingId(itemType._id);
    form.setFieldsValue(itemType);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteItemType(id);
      message.success('Xóa loại món thành công');
      fetchItemTypes();
    } catch (error) {
      message.error('Không thể xóa loại món');
    }
  };

  const handleViewItems = (itemType) => {
    navigate(`/menu-item?typeId=${itemType._id}`);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await updateItemType(editingId, values);
        message.success('Cập nhật loại món thành công');
      } else {
        await createItemType(values);
        message.success('Thêm loại món thành công');
      }
      
      setIsModalVisible(false);
      fetchItemTypes();
    } catch (error) {
      message.error(`Không thể ${editingId ? 'cập nhật' : 'thêm'} loại món`);
    }
  };

  return (
    <div className="itemtype-page">
      <Sidebar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Quản lý loại món</h2>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm loại món
          </Button>
        </div>

        <div className="itemtype-list">
          {itemTypes.map(itemType => (
            <div key={itemType._id} className="itemtype-item">
              <div className="item-name">
                <h3>{itemType.name}</h3>
              </div>
              <div className="item-actions">
                <Button 
                  icon={<UnorderedListOutlined />} 
                  onClick={() => handleViewItems(itemType)}
                  title="Xem danh sách món"
                >
                  Xem món
                </Button>
                <Button 
                  icon={<EditOutlined />} 
                  onClick={() => handleEdit(itemType)}
                  title="Sửa loại món"
                >
                  Sửa
                </Button>
                <Button 
                  icon={<DeleteOutlined />} 
                  danger
                  onClick={() => handleDelete(itemType._id)}
                  title="Xóa loại món"
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Modal
          title={editingId ? "Cập nhật loại món" : "Thêm loại món mới"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Tên loại món"
              rules={[{ required: true, message: 'Vui lòng nhập tên loại món' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item className="form-buttons">
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
} 