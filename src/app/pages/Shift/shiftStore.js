import moment from 'moment';

export const SHIFTS = [
    { id: 'morning', name: 'Ca sáng', startTime: '06:00', endTime: '11:00' },
    { id: 'afternoon', name: 'Ca chiều', startTime: '11:00', endTime: '18:00' },
    { id: 'evening', name: 'Ca tối', startTime: '18:00', endTime: '22:00' },
  ];

export const formatShiftsData = (shiftsData) => {
  const formattedShifts = {};
  shiftsData.forEach(shift => {
    const date = moment(shift.scheduledStartTime).format('YYYY-MM-DD');
    const startHour = moment(shift.scheduledStartTime).hour();
    let shiftId = getShiftIdByHour(startHour);
    
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
  return formattedShifts;
};

export const getShiftIdByHour = (hour) => {
  if (hour === 6) return 'morning';
  if (hour === 11) return 'afternoon';
  if (hour === 18) return 'evening';
  return null;
};

export const createShiftData = (date, shift, employeeId) => {
  const startHour = parseInt(shift.startTime.split(':')[0]);
  const endHour = parseInt(shift.endTime.split(':')[0]);

  return {
    employee: employeeId,
    scheduledStartTime: moment(date).hour(startHour).minute(0).second(0).toDate(),
    scheduledEndTime: moment(date).hour(endHour).minute(0).second(0).toDate(),
    hoursWorked: 0
  };
};