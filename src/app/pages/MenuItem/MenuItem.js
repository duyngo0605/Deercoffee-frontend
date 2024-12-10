import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem } from './services/menuItemService';
import { getItemType } from '../ItemType/services/itemTypeService';
import ImageUploader from '../../components/ImageUploader';
import Sidebar from '../../components/Sidebar';
import './menuItem.css';

const MenuItem = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const typeId = queryParams.get('typeId');

    const [menuItems, setMenuItems] = useState([]);
    const [itemTypes, setItemTypes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const getCurrentTypeName = () => {
        const currentType = itemTypes.find(type => type._id === typeId);
        return currentType?.name;
    };

    useEffect(() => {
        fetchMenuItems();
        fetchItemTypes();
    }, [typeId]);

    const fetchMenuItems = async (id = '') => {
        try {
            const data = await getMenuItem(id);
            if (typeId) {
                setMenuItems(data.filter(item => item.itemType === typeId));
            } else {
                setMenuItems(data);
            }
        } catch (error) {
            message.error('Không thể tải danh sách món ăn');
        }
    };

    const fetchItemTypes = async () => {
        try {
            const data = await getItemType();
            setItemTypes(data);
        } catch (error) {
            message.error('Không thể tải danh sách loại món');
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        if (typeId) {
            form.setFieldsValue({ itemType: typeId });
        }
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingId(record._id);
        form.setFieldsValue({
            name: record.name,
            price: record.price,
            itemType: record.itemType,
            image: record.image
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteMenuItem(id);
            message.success('Xóa món thành công');
            fetchMenuItems();
        } catch (error) {
            message.error('Xóa món thất bại');
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (editingId) {
                await updateMenuItem(editingId, values);
                message.success('Cập nhật món thành công');
            } else {
                await createMenuItem(values);
                message.success('Thêm món thành công');
            }
            setIsModalVisible(false);
            fetchMenuItems();
        } catch (error) {
            message.error('Thao tác thất bại');
        } finally {
            setLoading(false);
        }
    };

    const clearFilter = () => {
        navigate('/menu-item');
        fetchMenuItems();
    };

    return (
        <div className="menuitem-page">
            <Sidebar />
            <div className="content-wrapper">
                <div className="page-header">
                    <div className="header-left">
                        <h2>Quản lý thực đơn</h2>   
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Thêm món mới
                    </Button>
                </div>

                <div className="menu-item-grid">
                    {menuItems.map(item => (
                        <Card
                            key={item._id}
                            className="menu-item-card"
                            cover={
                                <img
                                    alt={item.name}
                                    src={item.image || 'https://via.placeholder.com/200'}
                                    className="menu-item-image"
                                />
                            }
                            actions={[
                                <div className="menu-item-actions">
                                    <EditOutlined key="edit" onClick={() => handleEdit(item)} />
                                    <DeleteOutlined key="delete" onClick={() => handleDelete(item._id)} />
                                </div>
                            ]}
                        >
                            <Card.Meta
                                title={<div className="menu-item-name">{item.name}</div>}
                                description={
                                    <p className="menu-item-price">{item.price.toLocaleString('vi-VN')} đ</p>
                                }
                            />
                        </Card>
                    ))}
                </div>

                <Modal
                    title={editingId ? "Sửa món" : "Thêm món mới"}
                    open={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                        form.resetFields();
                    }}
                    footer={null}
                >
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            name="name"
                            label="Tên món"
                            rules={[{ required: true, message: 'Vui lòng nhập tên món' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="image"
                            label="Hình ảnh"
                            valuePropName="value"
                            trigger="onChange"
                        >
                            <ImageUploader />
                        </Form.Item>

                        <Form.Item
                            name="itemType"
                            label="Loại món"
                            rules={[{ required: true, message: 'Vui lòng chọn loại món' }]}
                        >
                            <Select disabled={typeId && !editingId}>
                                {itemTypes.map(type => (
                                    <Select.Option key={type._id} value={type._id}>
                                        {type.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item className="form-buttons">
                            <Button onClick={() => {
                                setIsModalVisible(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default MenuItem;
