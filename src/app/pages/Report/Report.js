import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { getRevenueByDay, getRevenueByMonth, getRevenueByYear, getMostOrderedMenuItemsByDay, getMostOrderedMenuItemsByMonth, getMostOrderedMenuItemsByYear } from './services/reportService';
import Sidebar from '../../components/Sidebar';
import './report.css'

const Report = () => {
  const [revenueData, setRevenueData] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedYear, setSelectedYear] = useState(dayjs());
  const [menuItems, setMenuItems] = useState({
    daily: [],
    monthly: [],
    yearly: []
  });

  const handleFetchDailyRevenue = (date) => {
    const data = {
      date: date.format('YYYY-MM-DD')
    };
    
    getRevenueByDay(data)
      .then(result => {
        setRevenueData(prev => ({ ...prev, daily: result }));
      })
      .catch(error => {
        console.error('Lỗi khi lấy doanh thu theo ngày:', error);
      });
  };

  const handleFetchMonthlyRevenue = (date) => {
    const data = {
      year: date.year(),
      month: date.month() + 1
    };

    getRevenueByMonth(data)
      .then(result => {
        setRevenueData(prev => ({ ...prev, monthly: result }));
      })
      .catch(error => {
        console.error('Lỗi khi lấy doanh thu theo tháng:', error);
      });
  };

  const handleFetchYearlyRevenue = (date) => {
    const data = {
      year: date.year()
    };

    getRevenueByYear(data)
      .then(result => {
        setRevenueData(prev => ({ ...prev, yearly: result }));
      })
      .catch(error => {
        console.error('Lỗi khi lấy doanh thu theo năm:', error);
      });
  };

  const handleFetchDailyMenuItems = (date) => {
    const data = {
      date: date.format('YYYY-MM-DD')
    };
    
    getMostOrderedMenuItemsByDay(data)
      .then(result => {
        setMenuItems(prev => ({ ...prev, daily: result }));
      })
      .catch(error => {
        console.error('Lỗi khi lấy danh sách món ăn theo ngày:', error);
      });
  };

  const handleFetchMonthlyMenuItems = (date) => {
    const data = {
      year: date.year(),
      month: date.month() + 1
    };

    getMostOrderedMenuItemsByMonth(data)
      .then(result => {
        setMenuItems(prev => ({ ...prev, monthly: result }));
      })
      .catch(error => {
        console.error('Lỗi khi lấy danh sách món ăn theo tháng:', error);
      });
  };

  const handleFetchYearlyMenuItems = (date) => {
    const data = {
      year: date.year()
    };

    getMostOrderedMenuItemsByYear(data)
      .then(result => {
        setMenuItems(prev => ({ ...prev, yearly: result }));
      })
      .catch(error => {
        console.error('Lỗi khi lấy danh sách món ăn theo năm:', error);
      });
  };

  useEffect(() => {
    handleFetchDailyRevenue(selectedDate);
    handleFetchMonthlyRevenue(selectedMonth);
    handleFetchYearlyRevenue(selectedYear);
    handleFetchDailyMenuItems(selectedDate);
    handleFetchMonthlyMenuItems(selectedMonth);
    handleFetchYearlyMenuItems(selectedYear);
  }, [selectedDate, selectedMonth, selectedYear]);

  const renderMenuItems = (items) => (
    <div className="menu-item-list">
      {items.slice(0, 5).map((item, index) => (
        <div key={item._id} className="menu-item-card">
          <img 
            src={item.image} 
            alt={item.name} 
            className="menu-item-image"
          />
          <div>
            <Typography variant="body1" style={{ marginBottom: '4px' }}>
              {item.name}
            </Typography>
            <Typography variant="body2">
              Số lượng: {item.quantity}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="report-page">
      <Sidebar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Báo Cáo Doanh Thu</h2>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3}>
            {/* Date Pickers */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Chọn Ngày
                  </Typography>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    format="DD/MM/YYYY"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Chọn Tháng
                  </Typography>
                  <DatePicker
                    value={selectedMonth}
                    onChange={(newValue) => setSelectedMonth(newValue)}
                    views={['month', 'year']}
                    format="MM/YYYY"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Chọn Năm
                  </Typography>
                  <DatePicker
                    value={selectedYear}
                    onChange={(newValue) => setSelectedYear(newValue)}
                    views={['year']}
                    format="YYYY"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Revenue Display */}
            <Grid item xs={12} md={4}>
              <Card className="revenue-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Doanh Thu Theo Ngày
                  </Typography>
                  <Typography variant="h5">
                    {revenueData.daily.toLocaleString('vi-VN')} VNĐ
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="revenue-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Doanh Thu Theo Tháng
                  </Typography>
                  <Typography variant="h5">
                    {revenueData.monthly.toLocaleString('vi-VN')} VNĐ
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="revenue-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Doanh Thu Theo Năm
                  </Typography>
                  <Typography variant="h5">
                    {revenueData.yearly.toLocaleString('vi-VN')} VNĐ
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </LocalizationProvider>

        {/* Menu Items Section */}
        <Grid container spacing={3} style={{ marginTop: '24px' }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Món Ăn Bán Chạy Theo Ngày
                </Typography>
                {renderMenuItems(menuItems.daily)}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Món Ăn Bán Chạy Theo Tháng
                </Typography>
                {renderMenuItems(menuItems.monthly)}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Món Ăn Bán Chạy Theo Năm
                </Typography>
                {renderMenuItems(menuItems.yearly)}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Report;
