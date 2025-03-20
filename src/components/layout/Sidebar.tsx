
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, LayoutDashboard, Users, FileText, Settings, ClipboardCheck } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Attendance",
    href: "/dashboard",
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[280px] border-r bg-card shadow-sm transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <NavLink to="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">FA</span>
            </div>
            <span className="font-medium text-xl">FaceAttend</span>
          </NavLink>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)] py-4">
          <nav className="grid gap-2 px-4">
            <div className="px-2 py-2">
              <h3 className="text-sm font-medium text-muted-foreground tracking-tight mb-2">
                Navigation
              </h3>
              <div className="grid gap-1.5">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-secondary text-accent-foreground"
                          : "hover:bg-secondary/50 text-muted-foreground"
                      )
                    }
                  >
                    {item.icon}
                    {item.title}
                  </NavLink>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="px-2 py-2">
              <h3 className="text-sm font-medium text-muted-foreground tracking-tight mb-2">
                Reports
              </h3>
              <div className="grid gap-1.5">
                <Button variant="ghost" className="justify-start h-9 px-3 font-normal text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  Daily Report
                </Button>
                <Button variant="ghost" className="justify-start h-9 px-3 font-normal text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  Weekly Report
                </Button>
                <Button variant="ghost" className="justify-start h-9 px-3 font-normal text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  Monthly Report
                </Button>
              </div>
            </div>
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;
