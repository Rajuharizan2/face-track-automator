
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-16 md:pl-[280px] transition-all duration-300 ease-in-out">
        <div className="container py-6 px-4 md:px-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
