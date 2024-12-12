// src/app/pages/Shift/Shift.js
import React, { useState, useEffect } from 'react';
import { message, Popconfirm } from 'antd';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getEmployee } from '../Employee/services/employeeService';
import { getShift, createShift, deleteShift } from './services/shiftService';
import Sidebar from '../../components/Sidebar';
import './shift.css';
import moment from 'moment';
import 'moment/locale/vi';
import { WeekNavigation } from './components/WeekNavigation';
import { EmployeeList } from './components/EmployeeList';

import { SHIFTS, formatShiftsData, createShiftData } from './shiftStore';


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
      const formattedShifts = formatShiftsData(data);
      setShifts(formattedShifts);
    } catch (error) {
      message.error('Không thể tải ca làm việc');
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, draggableId } = result;
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

      const shiftKey = `${date}-${shiftId}`;
      const existingEmployees = shifts[shiftKey] || [];
      
      const isDuplicate = existingEmployees.some(emp => emp.employeeId === employee._id);
      if (isDuplicate) {
        message.error('Nhân viên này đã được phân công vào ca làm việc này!');
        return;
      }

      const shiftData = createShiftData(date, shift, employee._id);
      await createShift(shiftData);
      message.success('Phân ca thành công');
      
      await fetchShifts();
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
            <WeekNavigation currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="shift-layout">
            <EmployeeList employees={employees} />

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