
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import FaceDetection from "@/components/attendance/FaceDetection";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers, getAttendance } from "@/lib/attendanceData";
import { CalendarDays, UserCheck, UserX, Clock } from "lucide-react";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  
  const { data: attendance = [], isLoading: isLoadingAttendance, refetch: refetchAttendance } = useQuery({
    queryKey: ["attendance", selectedDate],
    queryFn: () => getAttendance(selectedDate),
  });
  
  const presentCount = attendance.filter(a => a.status === "present").length;
  const lateCount = attendance.filter(a => a.status === "late").length;
  const absentCount = users.length - (presentCount + lateCount);
  
  return (
    <AppLayout>
      <div className="grid gap-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="animate-scale-in" style={{ animationDelay: '50ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <h3 className="text-2xl font-bold">{presentCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Late</p>
                  <h3 className="text-2xl font-bold">{lateCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-scale-in" style={{ animationDelay: '150ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
                  <UserX className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent</p>
                  <h3 className="text-2xl font-bold">{absentCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-scale-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <h3 className="text-2xl font-bold">
                    {new Date().toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="attendance" className="animate-fade-in">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="attendance">Mark Attendance</TabsTrigger>
            <TabsTrigger value="records">Attendance Records</TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="pt-4 animate-fade-in">
            <FaceDetection users={users} onAttendanceMarked={() => refetchAttendance()} />
          </TabsContent>
          <TabsContent value="records" className="pt-4 animate-fade-in">
            <AttendanceTable attendance={attendance} users={users} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
