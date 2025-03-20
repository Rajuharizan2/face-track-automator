
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { User, deleteUser } from "@/lib/attendanceData";
import { Edit, MoreVertical, Trash2, UserX, Camera } from "lucide-react";

interface UserCardProps {
  user: User;
  onDelete: () => void;
  onEdit: (user: User) => void;
}

const UserCard = ({ user, onDelete, onEdit }: UserCardProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      setDeleteDialogOpen(false);
      toast({
        title: "User deleted",
        description: `${user.name} has been removed successfully.`,
      });
      onDelete();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
    }
  };

  return (
    <Card className="h-full overflow-hidden group animate-fade-in">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <Badge className="mb-2" variant="outline">
            {user.role}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] animate-scale-in">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDeleteDialogOpen(true)} 
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="flex flex-col items-center mt-2">
          <div className="relative h-24 w-24 mb-4 rounded-full overflow-hidden border-4 border-background shadow-sm">
            <img
              src={user.profileImage || '/placeholder.svg'}
              alt={user.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
          <div className="w-full flex justify-center gap-1 items-center">
            <Badge variant="secondary" className="font-normal">
              {user.department}
            </Badge>
          </div>
          
          <div className="w-full mt-4 pt-4 border-t flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 text-xs" 
              onClick={() => onEdit(user)}
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 text-xs text-destructive hover:text-destructive" 
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {user.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <UserX className="h-8 w-8" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserCard;
