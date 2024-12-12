import React from 'react';
import { Button } from 'antd';
import moment from 'moment';

export const WeekNavigation = ({ currentWeek, setCurrentWeek }) => (
  <div className="week-navigation">
    <Button onClick={() => setCurrentWeek(prev => moment(prev).subtract(1, 'week'))}>&lt;</Button>
    <span>
      {moment(currentWeek).startOf('week').format('DD/MM')} 
      - 
      {moment(currentWeek).endOf('week').format('DD/MM/YYYY')}
    </span>
    <Button onClick={() => setCurrentWeek(prev => moment(prev).add(1, 'week'))}>&gt;</Button>
  </div>
); 