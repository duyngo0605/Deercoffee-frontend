import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, message } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import moment from 'moment';
import './employee.css';
import { getEmployee, createEmployee, updateEmployee, deleteEmployee } from './services/employeeService';
import { getMenuItems } from '../../../settings/localVar';
import Sidebar from '../../components/Sidebar';
import { jwtDecode } from 'jwt-decode';
import { TOKEN } from "../../../settings/localVar";

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = jwtDecode(localStorage.getItem(TOKEN));

  const menuItems = getMenuItems(user.role);

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Năm sinh',
      dataIndex: 'yearOfBirth',
      key: 'yearOfBirth',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startedDate',
      key: 'startedDate',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Lương theo giờ',
      dataIndex: 'hourlyRate',
      key: 'hourlyRate',
      render: (rate) => `${rate.toLocaleString()} VNĐ/giờ`,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div className="action-buttons">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployee();
      setEmployees(data);
    } catch (error) {
      message.error('Không thể tải danh sách nhân viên');
    }
    setLoading(false);
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
      startedDate: moment(record.startedDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      message.success('Xóa nhân viên thành công');
      fetchEmployees();
    } catch (error) {
      message.error('Không thể xóa nhân viên');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = {
        ...values,
        startedDate: values.startedDate.toISOString(),
      };

      if (editingId) {
        await updateEmployee(editingId, formData);
        message.success('Cập nhật nhân viên thành công');
      } else {
        await createEmployee(formData);
        message.success('Thêm nhân viên thành công');
      }
      
      setIsModalVisible(false);
      fetchEmployees();
    } catch (error) {
      message.error(`Không thể ${editingId ? 'cập nhật' : 'thêm'} nhân viên`);
    }
  };

  return (
    <div className="employee-page">
      <Sidebar user={user} menuItems={menuItems} />
      <div className="content-wrapper">
        <div className="employee-page">
            <div className="page-header">
            <h2>Quản lý nhân viên</h2>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              onClick={handleAdd}
            >
              Thêm nhân viên
            </Button>
            </div>

            <Table 
              columns={columns} 
              dataSource={employees}
              loading={loading}
              rowKey="_id"
            />
        </div>
      </div>
     
      

      <Modal
        title={editingId ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}
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
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="position"
            label="Vị trí"
            rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="yearOfBirth"
            label="Năm sinh"
            rules={[{ required: true, message: 'Vui lòng nhập năm sinh' }]}
          >
            <InputNumber 
              min={1950} 
              max={2010}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="startedDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="hourlyRate"
            label="Lương theo giờ (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập lương theo giờ' }]}
          >
            <InputNumber
              min={0}
              step={1000}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
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
  );
} 