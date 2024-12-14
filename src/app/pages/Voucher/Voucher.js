import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, message } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { getVoucher, createVoucher, updateVoucher, deleteVoucher } from './services/voucherService';
import Sidebar from '../../components/Sidebar';
import './voucher.css'
import moment from 'moment';

export default function Voucher() {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Mã Voucher',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Giảm giá (%)',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date) => moment(date).format('DD/MM/YYYY'),
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
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const data = await getVoucher();
      setVouchers(data);
    } catch (error) {
      message.error('Không thể tải danh sách voucher');
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
      startDate: moment(record.startDate),
      expiryDate: moment(record.expiryDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa voucher này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteVoucher(id);
          message.success('Xóa voucher thành công');
          fetchVouchers();
        } catch (error) {
          message.error('Không thể xóa voucher');
        }
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      const formData = {
        ...values,
        startDate: values.startDate.toISOString(),
        expiryDate: values.expiryDate.toISOString(),
      };

      if (editingId) {
        await updateVoucher(editingId, formData);
        message.success('Cập nhật voucher thành công');
      } else {
        await createVoucher(formData);
        message.success('Thêm voucher thành công');
      }
      
      setIsModalVisible(false);
      fetchVouchers();
    } catch (error) {
      message.error(`Không thể ${editingId ? 'cập nhật' : 'thêm'} voucher`);
    }
  };

  return (
    <div className="voucher-page">
      <Sidebar />
      <div className="content-wrapper">
        <div className="voucher-page">
          <div className="page-header">
            <h2>Quản lý Voucher</h2>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              onClick={handleAdd}
            >
              Thêm voucher
            </Button>
          </div>

          <Table 
            columns={columns} 
            dataSource={vouchers}
            loading={loading}
            rowKey="_id"
          />
        </div>
      </div>

      <Modal
        title={editingId ? "Cập nhật voucher" : "Thêm voucher mới"}
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
            name="code"
            label="Mã Voucher"
            rules={[{ required: true, message: 'Vui lòng nhập mã voucher' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="discount"
            label="Giảm giá (%)"
            rules={[{ required: true, message: 'Vui lòng nhập giảm giá' }]}
          >
            <InputNumber 
              min={0} 
              max={100}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="expiryDate"
            label="Ngày hết hạn"
            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
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
