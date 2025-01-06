import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { getRevenueByDay, getRevenueByMonth, getRevenueByYear, getMostOrderedMenuItemsByDay, getMostOrderedMenuItemsByMonth, getMostOrderedMenuItemsByYear } from './services/reportService';
import Sidebar from '../../components/Sidebar';
import './report.css'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';

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
    <div className="report-menu-item-list">
      {items.slice(0, 5).map((item, index) => (
        <div key={item._id} className="report-menu-item-card">
          <img 
            src={item.image} 
            alt={item.name} 
            className="report-menu-item-image"
          />
          <div>
            <Typography className="report-typography report-typography-body1" style={{ marginBottom: '4px' }}>
              {item.name}
            </Typography>
            <Typography className="report-typography report-typography-body2">
              Số lượng: {item.quantity}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );

  const exportMonthlyReport = async (date) => {
    try {
      const data = {
        year: date.year(),
        month: date.month() + 1
      };
      
      // Lấy số ngày trong tháng
      const daysInMonth = date.daysInMonth();
      let totalRevenue = 0;
      const dailyRevenues = [];

      // Lấy doanh thu cho từng ngày trong tháng
      for (let day = 1; day <= daysInMonth; day++) {
        const dailyData = {
          date: dayjs(`${data.year}-${data.month}-${day}`).format('YYYY-MM-DD')
        };
        try {
          const revenue = await getRevenueByDay(dailyData);
          dailyRevenues.push({
            date: `${day}/${data.month}/${data.year}`,
            revenue: revenue
          });
          totalRevenue += revenue;
        } catch (error) {
          dailyRevenues.push({
            date: `${day}/${data.month}/${data.year}`,
            revenue: 0
          });
        }
      }

      const menuItems = await getMostOrderedMenuItemsByMonth(data);
      
      // Tạo worksheet cho doanh thu
      const revenueData = [
        [`Báo Cáo Doanh Thu Chi Tiết Tháng ${data.month}/${data.year}`],
        ['Ngày', 'Doanh Thu (VNĐ)'],
        ...dailyRevenues.map(item => [item.date, item.revenue.toLocaleString('vi-VN')]),
        ['', ''],
        ['Tổng doanh thu', totalRevenue.toLocaleString('vi-VN')]
      ];

      // Tạo worksheet cho món ăn bán chạy
      const menuItemsData = [
        ['Danh Sách Món Ăn Bán Chạy'],
        ['Tên món', 'Số lượng đã bán'],
        ...menuItems.map(item => [item.name, item.quantity])
      ];

      // Tạo workbook và thêm các worksheet
      const wb = XLSX.utils.book_new();
      const ws1 = XLSX.utils.aoa_to_sheet(revenueData);
      const ws2 = XLSX.utils.aoa_to_sheet(menuItemsData);
      
      // Định dạng độ rộng cột
      ws1['!cols'] = [{ wch: 15 }, { wch: 20 }];
      ws2['!cols'] = [{ wch: 30 }, { wch: 15 }];
      
      XLSX.utils.book_append_sheet(wb, ws1, "Doanh Thu");
      XLSX.utils.book_append_sheet(wb, ws2, "Món Ăn Bán Chạy");
      
      XLSX.writeFile(wb, `Bao_Cao_Thang_${data.month}_${data.year}.xlsx`);
    } catch (error) {
      console.error('Lỗi khi xuất báo cáo:', error);
    }
  };

  const exportYearlyReport = async (date) => {
    try {
      const data = {
        year: date.year()
      };
      
      let totalRevenue = 0;
      const monthlyRevenues = [];

      // Lấy doanh thu cho từng tháng trong năm
      for (let month = 1; month <= 12; month++) {
        const monthlyData = {
          year: data.year,
          month: month
        };
        try {
          const revenue = await getRevenueByMonth(monthlyData);
          monthlyRevenues.push({
            month: `Tháng ${month}/${data.year}`,
            revenue: revenue
          });
          totalRevenue += revenue;
        } catch (error) {
          monthlyRevenues.push({
            month: `Tháng ${month}/${data.year}`,
            revenue: 0
          });
        }
      }

      const menuItems = await getMostOrderedMenuItemsByYear(data);
      
      // Tạo worksheet cho doanh thu
      const revenueData = [
        [`Báo Cáo Doanh Thu Chi Tiết Năm ${data.year}`],
        ['Tháng', 'Doanh Thu (VNĐ)'],
        ...monthlyRevenues.map(item => [item.month, item.revenue.toLocaleString('vi-VN')]),
        ['', ''],
        ['Tổng doanh thu', totalRevenue.toLocaleString('vi-VN')]
      ];

      // Tạo worksheet cho món ăn bán chạy
      const menuItemsData = [
        ['Danh Sách Món Ăn Bán Chạy Trong Năm'],
        ['Tên món', 'Số lượng đã bán'],
        ...menuItems.map(item => [item.name, item.quantity])
      ];

      // Tạo workbook và thêm các worksheet
      const wb = XLSX.utils.book_new();
      const ws1 = XLSX.utils.aoa_to_sheet(revenueData);
      const ws2 = XLSX.utils.aoa_to_sheet(menuItemsData);
      
      // Định dạng độ rộng cột
      ws1['!cols'] = [{ wch: 15 }, { wch: 20 }];
      ws2['!cols'] = [{ wch: 30 }, { wch: 15 }];
      
      XLSX.utils.book_append_sheet(wb, ws1, "Doanh Thu");
      XLSX.utils.book_append_sheet(wb, ws2, "Món Ăn Bán Chạy");
      
      XLSX.writeFile(wb, `Bao_Cao_Nam_${data.year}.xlsx`);
    } catch (error) {
      console.error('Lỗi khi xuất báo cáo:', error);
    }
  };

  return (
    <div className="report-page">
      <Sidebar />
      <div className="report-content-wrapper">
        <div className="report-page-header">
          <h2>Báo Cáo Doanh Thu</h2>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3}>
            {/* Date Pickers */}
            <Grid item xs={12} md={4}>
              <Card className="report-card">
                <CardContent className="report-card-content">
                  <Typography className="report-typography report-typography-h6">
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
              <Card className="report-card">
                <CardContent className="report-card-content">
                  <Typography className="report-typography report-typography-h6">
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
              <Card className="report-card">
                <CardContent className="report-card-content">
                  <Typography className="report-typography report-typography-h6">
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
              <Card className="report-card">
                <CardContent className="report-card-content">
                  <Typography className="report-typography report-typography-h6">
                    Doanh Thu Theo Ngày
                  </Typography>
                  <Typography className="report-typography report-typography-h5">
                    {revenueData.daily.toLocaleString('vi-VN')} VNĐ
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="report-card">
                <CardContent className="report-card-content">
                  <Typography className="report-typography report-typography-h6">
                    Doanh Thu Theo Tháng
                  </Typography>
                  <Typography className="report-typography report-typography-h5">
                    {revenueData.monthly.toLocaleString('vi-VN')} VNĐ
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => exportMonthlyReport(selectedMonth)}
                    fullWidth
                  >
                    Xuất Báo Cáo
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="report-card">
                <CardContent className="report-card-content">
                  <Typography className="report-typography report-typography-h6">
                    Doanh Thu Theo Năm
                  </Typography>
                  <Typography className="report-typography report-typography-h5">
                    {revenueData.yearly.toLocaleString('vi-VN')} VNĐ
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => exportYearlyReport(selectedYear)}
                    fullWidth
                  >
                    Xuất Báo Cáo
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </LocalizationProvider>

        {/* Menu Items Section */}
        <Grid container spacing={3} className="report-grid-container">
          <Grid item xs={12} md={4}>
            <Card className="report-card">
              <CardContent className="report-card-content">
                <Typography className="report-typography report-typography-h6">
                  Món Ăn Bán Chạy Theo Ngày
                </Typography>
                {renderMenuItems(menuItems.daily)}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="report-card">
              <CardContent className="report-card-content">
                <Typography className="report-typography report-typography-h6">
                  Món Ăn Bán Chạy Theo Tháng
                </Typography>
                {renderMenuItems(menuItems.monthly)}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="report-card">
              <CardContent className="report-card-content">
                <Typography className="report-typography report-typography-h6">
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
