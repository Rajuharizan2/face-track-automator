
const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const { getAttendanceByDate, getUserAttendanceRecords, getUsersData, getUserById } = require('../utils/database');

// Generate daily attendance report
router.get('/daily/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    
    const attendanceRecords = await getAttendanceByDate(date);
    const users = await getUsersData();
    
    // Create Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daily Attendance');
    
    // Add headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Time In', key: 'timeIn', width: 12 },
      { header: 'Time Out', key: 'timeOut', width: 12 },
      { header: 'Status', key: 'status', width: 12 }
    ];
    
    // Style headers
    worksheet.getRow(1).font = { bold: true };
    
    // Add data
    for (const record of attendanceRecords) {
      const user = users.find(u => u.id === record.userId);
      
      if (user) {
        worksheet.addRow({
          name: user.name,
          department: user.department,
          date: record.date,
          timeIn: record.timeIn || '-',
          timeOut: record.timeOut || '-',
          status: record.status.charAt(0).toUpperCase() + record.status.slice(1)
        });
      }
    }
    
    // Add users who were absent
    const presentUserIds = attendanceRecords.map(record => record.userId);
    const absentUsers = users.filter(user => !presentUserIds.includes(user.id));
    
    for (const user of absentUsers) {
      worksheet.addRow({
        name: user.name,
        department: user.department,
        date: date,
        timeIn: '-',
        timeOut: '-',
        status: 'Absent'
      });
    }
    
    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Attendance_Report_${date}.xlsx`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating daily report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate user attendance report
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ message: 'User ID, start date, and end date are required' });
    }
    
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const attendanceRecords = await getUserAttendanceRecords(userId, startDate, endDate);
    
    // Create Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('User Attendance');
    
    // Add user info
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = `Attendance Report: ${user.name} (${user.department})`;
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    
    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').value = `Period: ${startDate} to ${endDate}`;
    worksheet.getCell('A2').font = { italic: true };
    worksheet.getCell('A2').alignment = { horizontal: 'center' };
    
    // Add headers
    worksheet.addRow([]);
    const headerRow = worksheet.addRow(['Date', 'Day', 'Time In', 'Time Out', 'Duration', 'Status']);
    headerRow.font = { bold: true };
    
    // Style headers
    worksheet.columns = [
      { key: 'date', width: 15 },
      { key: 'day', width: 12 },
      { key: 'timeIn', width: 12 },
      { key: 'timeOut', width: 12 },
      { key: 'duration', width: 12 },
      { key: 'status', width: 12 }
    ];
    
    // Add data
    for (const record of attendanceRecords) {
      const recordDate = new Date(record.date);
      const day = recordDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      let duration = '-';
      if (record.timeIn && record.timeOut) {
        const timeIn = new Date(`${record.date}T${record.timeIn}`);
        const timeOut = new Date(`${record.date}T${record.timeOut}`);
        const durationMs = timeOut - timeIn;
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        duration = `${hours}h ${minutes}m`;
      }
      
      worksheet.addRow({
        date: record.date,
        day: day,
        timeIn: record.timeIn || '-',
        timeOut: record.timeOut || '-',
        duration: duration,
        status: record.status.charAt(0).toUpperCase() + record.status.slice(1)
      });
    }
    
    // Generate statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
    const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
    const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
    
    worksheet.addRow([]);
    worksheet.addRow(['Summary', '', '', '', '', '']);
    worksheet.addRow(['Present', presentDays, `${(presentDays / totalDays * 100).toFixed(2)}%`, '', '', '']);
    worksheet.addRow(['Late', lateDays, `${(lateDays / totalDays * 100).toFixed(2)}%`, '', '', '']);
    worksheet.addRow(['Absent', absentDays, `${(absentDays / totalDays * 100).toFixed(2)}%`, '', '', '']);
    worksheet.addRow(['Total', totalDays, '100%', '', '', '']);
    
    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${user.name}_Attendance_${startDate}_to_${endDate}.xlsx`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating user report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
