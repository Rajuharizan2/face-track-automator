
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { 
  saveAttendanceRecord, 
  getAttendanceRecords, 
  getUserAttendanceRecords,
  getAttendanceByDate,
  updateAttendanceRecord
} = require('../utils/database');
const { getUserById } = require('../utils/database');

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    let records;
    
    if (date) {
      records = await getAttendanceByDate(date);
    } else {
      records = await getAttendanceRecords();
    }
    
    res.json(records);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance records for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const records = await getUserAttendanceRecords(userId, startDate, endDate);
    res.json(records);
  } catch (error) {
    console.error('Error fetching user attendance records:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark attendance (time in or time out)
router.post('/mark', async (req, res) => {
  try {
    const { userId, type } = req.body;
    
    if (!userId || !type) {
      return res.status(400).json({ message: 'User ID and attendance type are required' });
    }
    
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
    
    const existingRecords = await getAttendanceByDate(today);
    const userRecord = existingRecords.find(record => record.userId === userId);
    
    if (type === 'in') {
      if (userRecord && userRecord.timeIn) {
        return res.status(400).json({ 
          message: 'User has already marked attendance for today',
          record: userRecord
        });
      }
      
      const isLate = now.getHours() >= 9;
      
      const newRecord = {
        id: uuidv4(),
        userId,
        date: today,
        timeIn: currentTime,
        timeOut: null,
        status: isLate ? 'late' : 'present',
        createdAt: now.toISOString()
      };
      
      await saveAttendanceRecord(newRecord);
      res.status(201).json(newRecord);
    } else if (type === 'out') {
      if (!userRecord) {
        return res.status(400).json({ message: 'No time-in record found for today' });
      }
      
      if (userRecord.timeOut) {
        return res.status(400).json({
          message: 'User has already marked time out for today',
          record: userRecord
        });
      }
      
      const updatedRecord = {
        ...userRecord,
        timeOut: currentTime,
        updatedAt: now.toISOString()
      };
      
      await updateAttendanceRecord(userRecord.id, updatedRecord);
      res.json(updatedRecord);
    } else {
      res.status(400).json({ message: 'Invalid attendance type' });
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
