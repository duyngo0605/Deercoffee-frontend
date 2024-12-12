import React from 'react';
import { Button } from 'antd';
import moment from 'moment';

export const WeekNavigation = ({ currentWeek, setCurrentWeek }) => (
  <div className="week-navigation">
    <Button 
      className="nav-button"
      onClick={() => setCurrentWeek(prev => moment(prev).subtract(1, 'week'))}
    >
      &lt;
    </Button>
    <span className="week-label">
      {moment(currentWeek).startOf('week').format('DD/MM')} 
      - 
      {moment(currentWeek).endOf('week').format('DD/MM/YYYY')}
    </span>
    <Button 
      className="nav-button"
      onClick={() => setCurrentWeek(prev => moment(prev).add(1, 'week'))}
    >
      &gt;
    </Button>
  </div>
); 