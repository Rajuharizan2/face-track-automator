
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, Settings, LogOut, Bell } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/") {
      setPageTitle("Home");
    } else {
      setPageTitle(
        pathname.substring(1).charAt(0).toUpperCase() + 
        pathname.substring(2).replace(/-/g, " ")
      );
    }
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 flex items-center px-4 md:px-6 ${
        scrolled ? "glassmorphism shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium tracking-tight animate-fade-in">
            {pageTitle}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse-light" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-scale-in">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
