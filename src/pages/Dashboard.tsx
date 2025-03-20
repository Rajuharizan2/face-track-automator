
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import FaceDetection from "@/components/attendance/FaceDetection";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers, getAttendance, User, Attendance } from "@/lib/attendanceData";
import { CalendarDays, UserCheck, UserX, Clock } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Mock data for sandbox testing with correct types
const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", department: "Engineering", role: "Developer", profileImage: "/placeholder.svg" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", department: "Design", role: "UI Designer", profileImage: "/placeholder.svg" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", department: "Marketing", role: "Manager", profileImage: "/placeholder.svg" }
];

const mockAttendance: Attendance[] = [
  { id: "a1", userId: "1", date: new Date().toISOString().split("T")[0], timeIn: "09:00", timeOut: "17:00", status: "present" },
  { id: "a2", userId: "2", date: new Date().toISOString().split("T")[0], timeIn: "09:15", timeOut: "17:30", status: "late" }
];

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [useMockData, setUseMockData] = useState(false);
  
  // Detect if we're in a sandbox environment
  useEffect(() => {
    // Check if we're in the sandbox environment
    const isSandbox = window.location.hostname.includes('lovableproject.com');
    setUseMockData(isSandbox);
  }, []);
  
  const { 
    data: users = useMockData ? mockUsers : [], 
    isLoading: isLoadingUsers,
    error: usersError
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    enabled: !useMockData,
  });
  
  const { 
    data: attendance = useMockData ? mockAttendance : [], 
    isLoading: isLoadingAttendance, 
    refetch: refetchAttendance,
    error: attendanceError
  } = useQuery({
    queryKey: ["attendance", selectedDate],
    queryFn: () => getAttendance(selectedDate),
    enabled: !useMockData,
  });
  
  const displayedUsers = useMockData ? mockUsers : users;
  const displayedAttendance = useMockData ? mockAttendance : attendance;
  
  const presentCount = displayedAttendance.filter(a => a.status === "present").length;
  const lateCount = displayedAttendance.filter(a => a.status === "late").length;
  const absentCount = displayedUsers.length - (presentCount + lateCount);
  
  return (
    <AppLayout>
      <div className="grid gap-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        {useMockData && (
          <Alert>
            <AlertTitle>Test Environment Detected</AlertTitle>
            <AlertDescription>
              Using mock data for demonstration. In a production environment, this would connect to a real database.
            </AlertDescription>
          </Alert>
        )}
        
        {(usersError || attendanceError) && !useMockData && (
          <Alert variant="destructive">
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Could not connect to the backend server. Please make sure the server is running at http://localhost:5000.
            </AlertDescription>
          </Alert>
        )}
        
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
            <FaceDetection 
              users={displayedUsers} 
              onAttendanceMarked={() => refetchAttendance()} 
            />
          </TabsContent>
          <TabsContent value="records" className="pt-4 animate-fade-in">
            <AttendanceTable attendance={displayedAttendance} users={displayedUsers} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
