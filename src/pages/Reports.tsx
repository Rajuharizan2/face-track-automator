
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import ReportGenerator from "@/components/reports/ReportGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers, getAttendance, Attendance } from "@/lib/attendanceData";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FileSpreadsheet, BarChart3 } from "lucide-react";

const Reports = () => {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  
  const { data: attendance = [] } = useQuery({
    queryKey: ["all-attendance"],
    queryFn: () => getAttendance(),
  });
  
  // Process data for the weekly attendance chart
  const getDayAttendance = (date: string, status: string) => {
    return attendance.filter(
      (a) => a.date === date && a.status === status
    ).length;
  };
  
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };
  
  const weeklyData = getLast7Days().map((date) => {
    return {
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      present: getDayAttendance(date, "present"),
      late: getDayAttendance(date, "late"),
      absent: users.length - (getDayAttendance(date, "present") + getDayAttendance(date, "late")),
    };
  });
  
  // Process data for the department attendance chart
  const getDepartmentData = () => {
    // Get unique departments
    const departments = [...new Set(users.map((user) => user.department))];
    
    return departments.map((dept) => {
      // Get users in this department
      const deptUsers = users.filter((user) => user.department === dept);
      const deptUserIds = deptUsers.map((user) => user.id);
      
      // Count today's attendance for this department
      const today = new Date().toISOString().split("T")[0];
      const todayAttendance = attendance.filter(
        (a) => a.date === today && deptUserIds.includes(a.userId)
      );
      
      const present = todayAttendance.filter((a) => a.status === "present").length;
      const late = todayAttendance.filter((a) => a.status === "late").length;
      const absent = deptUsers.length - (present + late);
      
      return {
        department: dept,
        present,
        late,
        absent,
      };
    });
  };
  
  const departmentData = getDepartmentData();

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-scale-in" style={{ animationDelay: '50ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Weekly Attendance
              </CardTitle>
              <CardDescription>
                Attendance trends over the past 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#4ade80" name="Present" />
                    <Bar dataKey="late" fill="#fbbf24" name="Late" />
                    <Bar dataKey="absent" fill="#f87171" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Department Attendance
              </CardTitle>
              <CardDescription>
                Today's attendance by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="department" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#4ade80" name="Present" />
                    <Bar dataKey="late" fill="#fbbf24" name="Late" />
                    <Bar dataKey="absent" fill="#f87171" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 lg:col-span-1">
            <ReportGenerator users={users} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
