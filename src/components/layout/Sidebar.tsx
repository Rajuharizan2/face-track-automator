
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  Settings,
  Cctv
} from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
}

// Navigation items with labels and icons
const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Users',
    href: '/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: <FileBarChart className="h-5 w-5" />,
  },
  {
    title: 'Camera Settings',
    href: '/camera-settings',
    icon: <Cctv className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Sidebar({ className, isOpen }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div
      className={cn(
        "h-full flex-col border-r bg-background transition-all duration-300",
        isOpen ? "flex w-64" : "hidden md:flex w-16",
        className,
      )}
    >
      {/* Logo area */}
      <div className={cn(
        "flex h-14 items-center border-b px-4",
        isOpen ? "justify-between" : "justify-center"
      )}>
        {isOpen ? (
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">FaceAttend</span>
          </Link>
        ) : (
          <Link to="/" className="flex items-center justify-center">
            <span className="font-bold text-lg">FA</span>
          </Link>
        )}
      </div>

      {/* Navigation links */}
      <ScrollArea className="flex-1 pt-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link key={index} to={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isOpen ? "px-4" : "px-0 justify-center"
                )}
                size={isOpen ? "default" : "icon"}
              >
                {item.icon}
                {isOpen && <span className="ml-2">{item.title}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* User profile section */}
      <div className={cn(
        "flex items-center border-t p-4",
        isOpen ? "justify-between" : "justify-center"
      )}>
        <UserButton
          afterSignOutUrl="/"
        />
        {isOpen && (
          <div className="ml-2 text-sm">
            <p className="font-medium">Account</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
