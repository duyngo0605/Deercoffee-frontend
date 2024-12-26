import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, InputNumber, DatePicker, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getReservation, createReversation, updateReversation, deleteReversation } from './services/reservationService';
import Sidebar from '../../components/Sidebar';
import moment from 'moment';
import './reservation.css';
import Loading from '../../components/Loading/Loading';

const Reservation = () => {
    const [reservations, setReservations] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const data = await getReservation();
            setReservations(data);
        } catch (error) {
            message.error('Lấy danh sách đặt bàn thất bại');
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingId(record._id);
        form.setFieldsValue({
            ...record,
            reservationDate: moment(record.reservationDate)
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa đặt bàn này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteReversation(id);
                    message.success('Xóa đặt bàn thành công');
                    fetchReservations();
                } catch (error) {
                    message.error('Xóa đặt bàn thất bại');
                }
            },
        });
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (editingId) {
                await updateReversation(editingId, values);
                message.success('Cập nhật đặt bàn thành công');
            } else {
                await createReversation(values);
                message.success('Thêm đặt bàn thành công');
            }
            setIsModalVisible(false);
            fetchReservations();
        } catch (error) {
            message.error('Thao tác thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reservation-page">
            {loading && <Loading />}
            <Sidebar />
            <div className="content-wrapper">
                <div className="page-header">
                    <div className="header-left">
                        <h2>Quản lý đặt bàn</h2>   
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Thêm đặt bàn
                    </Button>
                </div>

                <div className="reservation-grid">
                    {reservations.map(item => (
                        <Card
                            key={item._id}
                            className="reservation-card"
                            onClick={() => handleEdit(item)}
                        >
                            <div className="reservation-date">
                                {moment(item.reservationDate).format('DD/MM/YYYY HH:mm')}
                            </div>
                            <Card.Meta
                                title={<div className="customer-name">{item.customerName}</div>}
                                description={
                                    <div className="reservation-info">
                                        <p>Số người: {item.numberOfPeople}</p>
                                        <p>SĐT: {item.phoneNumber}</p>
                                    </div>
                                }
                            />
                            <div className="card-actions">
                                <EditOutlined onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(item);
                                }} />
                                <DeleteOutlined onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item._id);
                                }} />
                            </div>
                        </Card>
                    ))}
                </div>

                <Modal
                    title={editingId ? "Sửa đặt bàn" : "Thêm đặt bàn mới"}
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
                            name="reservationDate"
                            label="Ngày giờ đặt bàn"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày giờ' }]}
                        >
                            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
                        </Form.Item>

                        <Form.Item
                            name="customerName"
                            label="Tên khách hàng"
                            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="phoneNumber"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                        >
                            <Input style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="numberOfPeople"
                            label="Số người"
                            rules={[{ required: true, message: 'Vui lòng nhập số người' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="notes"
                            label="Ghi chú"
                        >
                            <Input.TextArea />
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

export default Reservation;