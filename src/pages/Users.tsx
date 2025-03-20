
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import UserCard from "@/components/users/UserCard";
import AddUserForm from "@/components/users/AddUserForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUsers, User } from "@/lib/attendanceData";
import { Search, RefreshCw, UserPlus } from "lucide-react";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editUser, setEditUser] = useState<User | undefined>(undefined);
  
  const { 
    data: users = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });
  
  const handleSuccess = () => {
    refetch();
    setEditUser(undefined);
  };
  
  const handleEditUser = (user: User) => {
    setEditUser(user);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <AddUserForm onSuccess={handleSuccess} editUser={editUser} />
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <UserPlus className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-medium">No users found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try a different search term" : "Add your first user to get started"}
              </p>
              {!searchQuery && (
                <AddUserForm onSuccess={handleSuccess} />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onDelete={handleSuccess}
                  onEdit={handleEditUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Users;
