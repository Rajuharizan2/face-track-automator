
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Attendance, User } from "@/lib/attendanceData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AttendanceTableProps {
  attendance: Attendance[];
  users: User[];
}

const AttendanceTable = ({ attendance, users }: AttendanceTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500/10 text-green-600 border-green-600/20';
      case 'late':
        return 'bg-amber-500/10 text-amber-600 border-amber-600/20';
      case 'absent':
        return 'bg-red-500/10 text-red-600 border-red-600/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-600/20';
    }
  };
  
  const filteredAttendance = attendance.filter((record) => {
    const user = getUserById(record.userId);
    if (!user) return false;
    
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      record.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, department, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 animate-fade-in"
        />
      </div>
      
      <div className="rounded-lg border animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendance.map((record) => {
                const user = getUserById(record.userId);
                return (
                  <TableRow key={record.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex-shrink-0 overflow-hidden border">
                        <img 
                          src={user?.profileImage || '/placeholder.svg'} 
                          alt={user?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{user?.name || 'Unknown'}</span>
                    </TableCell>
                    <TableCell>{user?.department || 'Unknown'}</TableCell>
                    <TableCell>{record.timeIn}</TableCell>
                    <TableCell>{record.timeOut || '—'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(record.status)} capitalize`}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceTable;
