
const fs = require('fs');
const path = require('path');

// Data file paths
const USERS_FILE = path.join(__dirname, '../data/users.json');
const ATTENDANCE_FILE = path.join(__dirname, '../data/attendance.json');

// Make sure data directory exists
const ensureDirectoryExists = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

// Initialize data files if they don't exist
const initializeDataFiles = () => {
  ensureDirectoryExists(USERS_FILE);
  ensureDirectoryExists(ATTENDANCE_FILE);
  
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(ATTENDANCE_FILE)) {
    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify([]));
  }
};

// Initialize on load
initializeDataFiles();

// User data operations
const getUsersData = async () => {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
};

const getUserById = async (id) => {
  const users = await getUsersData();
  return users.find(user => user.id === id);
};

const saveUserData = async (user) => {
  const users = await getUsersData();
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  return user;
};

const updateUserData = async (id, updatedUser) => {
  const users = await getUsersData();
  const index = users.findIndex(user => user.id === id);
  
  if (index !== -1) {
    users[index] = updatedUser;
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return updatedUser;
  }
  
  return null;
};

const deleteUserData = async (id) => {
  const users = await getUsersData();
  const filteredUsers = users.filter(user => user.id !== id);
  fs.writeFileSync(USERS_FILE, JSON.stringify(filteredUsers, null, 2));
  return true;
};

// Attendance data operations
const getAttendanceRecords = async () => {
  const data = fs.readFileSync(ATTENDANCE_FILE, 'utf8');
  return JSON.parse(data);
};

const getAttendanceByDate = async (date) => {
  const records = await getAttendanceRecords();
  return records.filter(record => record.date === date);
};

const getUserAttendanceRecords = async (userId, startDate = null, endDate = null) => {
  const records = await getAttendanceRecords();
  return records.filter(record => {
    const matchesUser = record.userId === userId;
    
    if (!matchesUser) return false;
    if (!startDate && !endDate) return true;
    
    const recordDate = record.date;
    if (startDate && endDate) {
      return recordDate >= startDate && recordDate <= endDate;
    } else if (startDate) {
      return recordDate >= startDate;
    } else if (endDate) {
      return recordDate <= endDate;
    }
    
    return true;
  });
};

const saveAttendanceRecord = async (record) => {
  const records = await getAttendanceRecords();
  records.push(record);
  fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(records, null, 2));
  return record;
};

const updateAttendanceRecord = async (id, updatedRecord) => {
  const records = await getAttendanceRecords();
  const index = records.findIndex(record => record.id === id);
  
  if (index !== -1) {
    records[index] = updatedRecord;
    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(records, null, 2));
    return updatedRecord;
  }
  
  return null;
};

module.exports = {
  getUsersData,
  getUserById,
  saveUserData,
  updateUserData,
  deleteUserData,
  getAttendanceRecords,
  getAttendanceByDate,
  getUserAttendanceRecords,
  saveAttendanceRecord,
  updateAttendanceRecord
};
