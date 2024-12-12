// src/app/pages/Shift/Shift.js
import React, { useState, useEffect } from 'react';
import { Card, Button, message, Popconfirm } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getEmployee } from '../Employee/services/employeeService';
import { getShift, createShift, deleteShift } from './services/shiftService';
import Sidebar from '../../components/Sidebar';
import './shift.css';

const SHIFTS = [
  { id: 'morning', name: 'Ca sáng', startTime: '06:00', endTime: '11:00' },
  { id: 'afternoon', name: 'Ca chiều', startTime: '11:00', endTime: '18:00' },
  { id: 'evening', name: 'Ca tối', startTime: '18:00', endTime: '22:00' },
];

export default function Shift() {
  const [currentWeek, setCurrentWeek] = useState(moment());
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState({});
  
  useEffect(() => {
    fetchEmployees();
    fetchShifts();
  }, [currentWeek]);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployee();
      setEmployees(data);
    } catch (error) {
      message.error('Không thể tải danh sách nhân viên');
    }
  };

  const fetchShifts = async () => {
    try {
      const data = await getShift();
      // Chuyển đổi dữ liệu từ API thành format state
      const formattedShifts = {};
      data.forEach(shift => {
        const date = moment(shift.scheduledStartTime).format('YYYY-MM-DD');
        const startHour = moment(shift.scheduledStartTime).hour();
        let shiftId;
        
        if (startHour === 6) shiftId = 'morning';
        else if (startHour === 11) shiftId = 'afternoon';
        else if (startHour === 18) shiftId = 'evening';
        
        const key = `${date}-${shiftId}`;
        if (!formattedShifts[key]) {
          formattedShifts[key] = [];
        }
        formattedShifts[key].push({
          _id: shift._id,
          name: shift.employee.name,
          employeeId: shift.employee._id
        });
      });
      setShifts(formattedShifts);
    } catch (error) {
      message.error('Không thể tải ca làm việc');
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    try {
      const parts = destination.droppableId.split('-');
      const shiftId = parts[parts.length - 1];
      const date = parts.slice(0, -1).join('-');
      
      const shift = SHIFTS.find(s => s.id === shiftId);
      const employee = employees.find(emp => emp._id === draggableId);

      if (!shift || !employee) {
        message.error('Không tìm thấy thông tin ca làm việc hoặc nhân viên');
        return;
      }

      // Tạo thời gian bắt đầu và kết thúc
      const startHour = parseInt(shift.startTime.split(':')[0]);
      const endHour = parseInt(shift.endTime.split(':')[0]);

      const shiftData = {
        employee: employee._id,
        scheduledStartTime: moment(date).hour(startHour).minute(0).second(0).toDate(),
        scheduledEndTime: moment(date).hour(endHour).minute(0).second(0).toDate(),
        hoursWorked: 0
      };

      console.log('API Request:', shiftData);
      const response = await createShift(shiftData);
      console.log('API Response:', response);

      message.success('Phân ca thành công');
      
      setShifts(prev => ({
        ...prev,
        [destination.droppableId]: [
          ...(prev[destination.droppableId] || []),
          { _id: Date.now(), name: employee.name, employeeId: employee._id }
        ]
      }));

      fetchShifts();
      
    } catch (error) {
      console.error('Error in handleDragEnd:', error);
      message.error('Phân ca thất bại: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      await deleteShift(shiftId);
      message.success('Xóa ca làm việc thành công');
      fetchShifts(); // Refresh lại danh sách ca làm
    } catch (error) {
      message.error('Không thể xóa ca làm việc');
    }
  };

  const renderWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(moment(currentWeek).startOf('week').add(i, 'days'));
    }
    return days;
  };

  return (
    <div className="shift-page">
      <Sidebar />
      <div className="content-wrapper">
        <div className="page-header">
          <div className="header-left">
            <h2>Quản lý ca làm việc</h2>
            <div className="week-navigation">
              <Button onClick={() => setCurrentWeek(prev => moment(prev).subtract(1, 'week'))}>&lt;</Button>
              <span>
                {moment(currentWeek).startOf('week').format('DD/MM')} 
                - 
                {moment(currentWeek).endOf('week').format('DD/MM/YYYY')}
              </span>
              <Button onClick={() => setCurrentWeek(prev => moment(prev).add(1, 'week'))}>&gt;</Button>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="shift-layout">
            <div className="employee-list">
              <h3>Danh sách nhân viên</h3>
              <Droppable droppableId="employees">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="employee-droppable"
                  >
                    {employees.map((employee, index) => (
                      <Draggable
                        key={employee._id}
                        draggableId={employee._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="employee-item"
                          >
                            {employee.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="schedule-grid">
              <div className="time-slots">
                {SHIFTS.map(shift => (
                  <div key={shift.id} className="time-slot-header">
                    {shift.name} ({shift.startTime} - {shift.endTime})
                  </div>
                ))}
              </div>

              {renderWeekDays().map((day, dayIndex) => (
                <div key={day.format('YYYY-MM-DD')} className="day-column">
                  <div className="day-header">
                    {day.format('dddd DD/MM')}
                  </div>
                  {SHIFTS.map(shift => (
                    <Droppable
                      key={`${day.format('YYYY-MM-DD')}-${shift.id}`}
                      droppableId={`${day.format('YYYY-MM-DD')}-${shift.id}`}
                    >
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="shift-slot"
                        >
                          {shifts[`${day.format('YYYY-MM-DD')}-${shift.id}`]?.map((employee, index) => (
                            <Popconfirm
                              key={employee._id || index}
                              title="Xóa ca làm việc"
                              description="Bạn có chắc chắn muốn xóa ca làm việc này?"
                              onConfirm={() => handleDeleteShift(employee._id)}
                              okText="Xóa"
                              cancelText="Hủy"
                            >
                              <div className="assigned-employee">
                                {employee.name}
                              </div>
                            </Popconfirm>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}