
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  profileImage: string;
  faceData?: any; // Would store face descriptors in a real application
}

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
  status: 'present' | 'absent' | 'late';
}

const API_URL = 'http://localhost:5000/api';

// Initialize localStorage with default data if not already set
const initLocalStorage = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
  
  if (!localStorage.getItem('attendance')) {
    localStorage.setItem('attendance', JSON.stringify(mockAttendance));
  }
};

// Call this function when the application starts
initLocalStorage();

// Add event listeners for storage changes to enable real-time updates
// This allows changes made in other tabs/windows to be reflected
window.addEventListener('storage', (event) => {
  if (event.key === 'users' || event.key === 'attendance') {
    // Dispatch a custom event that components can listen for
    window.dispatchEvent(new CustomEvent('dataUpdated', { detail: event.key }));
  }
});

export const getUsers = async (): Promise<User[]> => {
  try {
    // Try localStorage first for real-time data
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    
    // If not in localStorage, try the API
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    
    const users = await response.json();
    // Store in localStorage for offline access and real-time sync
    localStorage.setItem('users', JSON.stringify(users));
    
    return users;
  } catch (error) {
    console.error('API Error:', error);
    
    // Return mock data as fallback during development
    return mockUsers;
  }
};

export const getUser = async (id: string): Promise<User | undefined> => {
  try {
    // Try localStorage first for real-time data
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const user = users.find((u: User) => u.id === id);
      if (user) return user;
    }
    
    // If not in localStorage, try the API
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    
    // Return mock data as fallback during development
    return mockUsers.find(user => user.id === id);
  }
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
  try {
    const newUser = {
      ...user,
      id: uuidv4(),
    };
    
    // Try API first
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    
    if (!response.ok) throw new Error('Failed to add user');
    
    const savedUser = await response.json();
    
    // Update localStorage for real-time sync
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    users.push(savedUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return savedUser;
  } catch (error) {
    console.error('API Error:', error);
    
    // Mock response during development with localStorage
    const newUser = {
      ...user,
      id: uuidv4(),
    };
    
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : mockUsers;
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return newUser;
  }
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User | undefined> => {
  try {
    // Try API first
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    
    if (!response.ok) throw new Error('Failed to update user');
    
    const updatedUser = await response.json();
    
    // Update localStorage for real-time sync
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const index = users.findIndex((u: User) => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...user };
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
    
    return updatedUser;
  } catch (error) {
    console.error('API Error:', error);
    
    // Mock response during development with localStorage
    const storedUsers = localStorage.getItem('users');
    
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const index = users.findIndex((u: User) => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...user };
        localStorage.setItem('users', JSON.stringify(users));
        return users[index];
      }
    }
    
    // Fallback to memory mock data
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...user };
      return mockUsers[index];
    }
    return undefined;
  }
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    // Try API first
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete user');
    
    // Update localStorage for real-time sync
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const filteredUsers = users.filter((u: User) => u.id !== id);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
    }
    
    return true;
  } catch (error) {
    console.error('API Error:', error);
    
    // Mock response during development with localStorage
    const storedUsers = localStorage.getItem('users');
    
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const filteredUsers = users.filter((u: User) => u.id !== id);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      return true;
    }
    
    return false;
  }
};

export const getAttendance = async (date?: string): Promise<Attendance[]> => {
  try {
    // Try localStorage first for real-time data
    const storedAttendance = localStorage.getItem('attendance');
    if (storedAttendance) {
      const attendance = JSON.parse(storedAttendance);
      if (date) {
        return attendance.filter((a: Attendance) => a.date === date);
      }
      return attendance;
    }
    
    // If not in localStorage, try the API
    const url = date ? `${API_URL}/attendance?date=${date}` : `${API_URL}/attendance`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Failed to fetch attendance');
    
    const attendance = await response.json();
    // Store in localStorage for offline access
    localStorage.setItem('attendance', JSON.stringify(attendance));
    
    return attendance;
  } catch (error) {
    console.error('API Error:', error);
    
    // Return mock data as fallback during development
    if (date) {
      return mockAttendance.filter(a => a.date === date);
    }
    return mockAttendance;
  }
};

export const getUserAttendance = async (userId: string): Promise<Attendance[]> => {
  try {
    // Try localStorage first for real-time data
    const storedAttendance = localStorage.getItem('attendance');
    if (storedAttendance) {
      const attendance = JSON.parse(storedAttendance);
      return attendance.filter((a: Attendance) => a.userId === userId);
    }
    
    // If not in localStorage, try the API
    const response = await fetch(`${API_URL}/attendance/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user attendance');
    
    const attendance = await response.json();
    return attendance;
  } catch (error) {
    console.error('API Error:', error);
    
    // Return mock data as fallback during development
    return mockAttendance.filter(a => a.userId === userId);
  }
};

export const markAttendance = async (userId: string, type: 'in' | 'out'): Promise<Attendance | undefined> => {
  try {
    // Try API first
    const response = await fetch(`${API_URL}/attendance/mark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, type }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to mark attendance');
    }
    
    const attendance = await response.json();
    
    // Update localStorage for real-time sync
    const storedAttendance = localStorage.getItem('attendance');
    if (storedAttendance) {
      const attendanceList = JSON.parse(storedAttendance);
      
      if (type === 'in') {
        // Add new attendance record or update existing one
        const existingIndex = attendanceList.findIndex(
          (a: Attendance) => a.userId === userId && a.date === attendance.date
        );
        
        if (existingIndex === -1) {
          attendanceList.push(attendance);
        } else {
          attendanceList[existingIndex] = attendance;
        }
      } else if (type === 'out') {
        // Update existing attendance record with timeOut
        const existingIndex = attendanceList.findIndex(
          (a: Attendance) => a.userId === userId && a.date === attendance.date
        );
        
        if (existingIndex !== -1) {
          attendanceList[existingIndex] = attendance;
        }
      }
      
      localStorage.setItem('attendance', JSON.stringify(attendanceList));
    }
    
    return attendance;
  } catch (error) {
    console.error('API Error:', error);
    
    // Mock implementation during development with localStorage
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8);
    
    const storedAttendance = localStorage.getItem('attendance');
    let attendanceList = storedAttendance ? JSON.parse(storedAttendance) : mockAttendance;
    
    if (type === 'in') {
      const existingIndex = attendanceList.findIndex(
        (a: Attendance) => a.userId === userId && a.date === today
      );
      
      if (existingIndex === -1) {
        const status = parseInt(now.split(':')[0]) >= 9 ? 'late' : 'present';
        const newAttendance: Attendance = {
          id: uuidv4(),
          userId,
          date: today,
          timeIn: now,
          timeOut: null,
          status: status as 'present' | 'late' | 'absent',
        };
        
        attendanceList.push(newAttendance);
        localStorage.setItem('attendance', JSON.stringify(attendanceList));
        return newAttendance;
      } else {
        return attendanceList[existingIndex];
      }
    } else if (type === 'out') {
      const existingIndex = attendanceList.findIndex(
        (a: Attendance) => a.userId === userId && a.date === today
      );
      
      if (existingIndex !== -1) {
        attendanceList[existingIndex].timeOut = now;
        localStorage.setItem('attendance', JSON.stringify(attendanceList));
        return attendanceList[existingIndex];
      }
    }
    
    return undefined;
  }
};

export const generateDailyReport = async (date: string): Promise<any> => {
  try {
    // This now returns a downloadable Excel file from the server
    window.open(`${API_URL}/reports/daily/${date}`, '_blank');
    
    return {
      success: true,
      filename: `Attendance_Report_${date}.xlsx`,
    };
  } catch (error) {
    console.error('Report generation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const generateUserReport = async (userId: string, startDate: string, endDate: string): Promise<any> => {
  try {
    // This now returns a downloadable Excel file from the server
    window.open(`${API_URL}/reports/user/${userId}?startDate=${startDate}&endDate=${endDate}`, '_blank');
    
    const user = await getUser(userId);
    return {
      success: true,
      filename: `${user?.name}_Attendance_${startDate}_to_${endDate}.xlsx`,
    };
  } catch (error) {
    console.error('Report generation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    department: 'Engineering',
    role: 'Developer',
    profileImage: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Sam Williams',
    email: 'sam.williams@example.com',
    department: 'Design',
    role: 'UI/UX Designer',
    profileImage: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'Jamie Smith',
    email: 'jamie.smith@example.com',
    department: 'Marketing',
    role: 'Marketing Specialist',
    profileImage: '/placeholder.svg',
  },
  {
    id: '4',
    name: 'Taylor Brown',
    email: 'taylor.brown@example.com',
    department: 'HR',
    role: 'HR Manager',
    profileImage: '/placeholder.svg',
  },
  {
    id: '5',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    department: 'Engineering',
    role: 'QA Engineer',
    profileImage: '/placeholder.svg',
  },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

const mockAttendance: Attendance[] = [
  {
    id: '1',
    userId: '1',
    date: today,
    timeIn: '09:05:22',
    timeOut: '17:30:15',
    status: 'present',
  },
  {
    id: '2',
    userId: '2',
    date: today,
    timeIn: '09:15:47',
    timeOut: '17:45:30',
    status: 'late',
  },
  {
    id: '3',
    userId: '3',
    date: today,
    timeIn: '09:00:12',
    timeOut: null,
    status: 'present',
  },
  {
    id: '4',
    userId: '4',
    date: today,
    timeIn: '09:10:33',
    timeOut: '17:20:45',
    status: 'late',
  },
  {
    id: '5',
    userId: '5',
    date: today,
    timeIn: '08:55:19',
    timeOut: '17:05:22',
    status: 'present',
  },
  {
    id: '6',
    userId: '1',
    date: yesterday,
    timeIn: '09:02:11',
    timeOut: '17:15:30',
    status: 'present',
  },
  {
    id: '7',
    userId: '2',
    date: yesterday,
    timeIn: '09:08:45',
    timeOut: '17:30:20',
    status: 'present',
  },
];
