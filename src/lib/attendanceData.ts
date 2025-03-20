
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

// Mock data
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

// API simulation functions
export const getUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 500);
  });
};

export const getUser = async (id: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers.find(user => user.id === id));
    }, 500);
  });
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        ...user,
        id: `${mockUsers.length + 1}`,
      };
      mockUsers.push(newUser);
      resolve(newUser);
    }, 500);
  });
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...user };
        resolve(mockUsers[index]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

export const deleteUser = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

export const getAttendance = async (date?: string): Promise<Attendance[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (date) {
        resolve(mockAttendance.filter(a => a.date === date));
      } else {
        resolve(mockAttendance);
      }
    }, 500);
  });
};

export const getUserAttendance = async (userId: string): Promise<Attendance[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAttendance.filter(a => a.userId === userId));
    }, 500);
  });
};

export const markAttendance = async (userId: string, type: 'in' | 'out'): Promise<Attendance | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8);
      
      // Check if user already has attendance for today
      const existingIndex = mockAttendance.findIndex(a => a.userId === userId && a.date === today);
      
      if (type === 'in') {
        if (existingIndex === -1) {
          // Create new attendance record
          const newAttendance: Attendance = {
            id: `${mockAttendance.length + 1}`,
            userId,
            date: today,
            timeIn: now,
            timeOut: null,
            status: parseInt(now.split(':')[0]) >= 9 ? 'late' : 'present',
          };
          mockAttendance.push(newAttendance);
          resolve(newAttendance);
        } else {
          resolve(mockAttendance[existingIndex]);
        }
      } else if (type === 'out') {
        if (existingIndex !== -1) {
          // Update existing attendance with timeout
          mockAttendance[existingIndex].timeOut = now;
          resolve(mockAttendance[existingIndex]);
        } else {
          resolve(undefined);
        }
      }
    }, 500);
  });
};

// Export functions to generate Excel reports
export const generateDailyReport = async (date: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = mockAttendance.filter(a => a.date === date).map(attendance => {
        const user = mockUsers.find(u => u.id === attendance.userId);
        return {
          Name: user?.name || 'Unknown',
          Department: user?.department || 'Unknown',
          Date: attendance.date,
          'Time In': attendance.timeIn,
          'Time Out': attendance.timeOut || '-',
          Status: attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1),
        };
      });
      
      resolve({
        filename: `Attendance_Report_${date}.xlsx`,
        data,
      });
    }, 500);
  });
};

export const generateUserReport = async (userId: string, startDate: string, endDate: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userAttendance = mockAttendance.filter(a => {
        return a.userId === userId && a.date >= startDate && a.date <= endDate;
      });
      
      const user = mockUsers.find(u => u.id === userId);
      const data = userAttendance.map(attendance => {
        return {
          Date: attendance.date,
          'Time In': attendance.timeIn,
          'Time Out': attendance.timeOut || '-',
          Status: attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1),
        };
      });
      
      resolve({
        filename: `${user?.name}_Attendance_${startDate}_to_${endDate}.xlsx`,
        data,
      });
    }, 500);
  });
};
