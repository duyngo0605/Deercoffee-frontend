import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getUser, createUser, updateUser, deleteUser } from './services/userService';
import { getEmployee } from '../Employee/services/employeeService'; // Thêm service để lấy danh sách nhân viên
import Sidebar from '../../components/Sidebar';
import './user.css';
import Loading from '../../components/Loading/Loading';

const { Option } = Select;

const User = () => {
    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasAdmin, setHasAdmin] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchEmployees();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUser();
            setUsers(data);
            setHasAdmin(data.some(user => user.role === 'admin'));
        } catch (error) {
            message.error('Lấy danh sách tài khoản thất bại');
        }
    };

    const fetchEmployees = async () => {
        try {
            const data = await getEmployee();
            setEmployees(data);
        } catch (error) {
            message.error('Lấy danh sách nhân viên thất bại');
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        if (hasAdmin) {
            form.setFieldsValue({ role: 'staff' });
        }
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingId(record._id);
        form.setFieldsValue({
            username: record.username,
            role: record.role,
            employee: record.employee?._id
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        const userToDelete = users.find(user => user._id === id);
        if (userToDelete.role === 'admin') {
            message.error('Không thể xóa tài khoản admin');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa tài khoản này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteUser(id);
                    message.success('Xóa tài khoản thành công');
                    fetchUsers();
                } catch (error) {
                    message.error('Xóa tài khoản thất bại');
                }
            },
        });
    };

    const handleSubmit = async (values) => {
        // Kiểm tra username trùng
        const isUsernameTaken = users.some(user => 
            user.username === values.username && user._id !== editingId
        );
        
        if (isUsernameTaken) {
            message.error('Tên đăng nhập đã tồn tại');
            return;
        }

        // Kiểm tra admin
        if (!editingId && values.role === 'admin' && hasAdmin) {
            message.error('Chỉ được phép tồn tại một tài khoản admin');
            return;
        }

        setLoading(true);
        try {
            if (editingId) {
                await updateUser(editingId, values);
                message.success('Cập nhật tài khoản thành công');
            } else {
                await createUser(values);
                message.success('Thêm tài khoản thành công');
            }
            setIsModalVisible(false);
            fetchUsers();
        } catch (error) {
            message.error('Thao tác thất bại');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'admin' ? 'red' : 'green'}>
                    {role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                </Tag>
            ),
        },
        {
            title: 'Nhân viên',
            dataIndex: 'employee',
            key: 'employee',
            render: (employee) => employee?.name || 'Chưa gán nhân viên'
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <div className="table-actions">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    {record.role !== 'admin' && (
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDelete(record._id)}
                        />
                    )}
                </div>
            ),
        },
    ];

    // Lọc danh sách nhân viên chưa được gán tài khoản
    const getAvailableEmployees = (currentEmployeeId) => {
        const usedEmployeeIds = users
            .filter(user => user._id !== editingId) // Loại trừ user đang được chỉnh sửa
            .map(user => user.employee?._id)
            .filter(Boolean);
        
        return employees.filter(emp => 
            !usedEmployeeIds.includes(emp._id) || emp._id === currentEmployeeId
        );
    };

    return (
        <div className="user-page">
            {loading && <Loading />}
            <Sidebar />
            <div className="content-wrapper">
                <div className="page-header">
                    <div className="header-left">
                        <h2>Quản lý người dùng</h2>   
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Thêm người dùng
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng số ${total} người dùng`
                    }}
                />

                <Modal
                    title={editingId ? "Sửa người dùng" : "Thêm người dùng mới"}
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
                            name="username"
                            label="Tên đăng nhập"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                                { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        {!editingId && (
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        )}

                        <Form.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                        >
                            <Select disabled={hasAdmin && (!editingId || (editingId && users.find(u => u._id === editingId)?.role !== 'admin'))}>
                                <Option value="staff">Nhân viên</Option>
                                <Option value="admin">Quản trị viên</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="employee"
                            label="Nhân viên"
                        >
                            <Select allowClear>
                                {getAvailableEmployees(form.getFieldValue('employee')).map(emp => (
                                    <Option key={emp._id} value={emp._id}>
                                        {emp.name}
                                    </Option>
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

export default User;