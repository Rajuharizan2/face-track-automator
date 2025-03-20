
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, UserCheck, FileText, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-fade-in');
      elements.forEach((el, index) => {
        setTimeout(() => {
          (el as HTMLElement).style.opacity = '1';
        }, index * 100);
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/30">
      <header className="container max-w-7xl mx-auto py-6 px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">FA</span>
            </div>
            <span className="font-medium text-xl">FaceAttend</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Login
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-4xl w-full space-y-12 text-center">
          <section className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight opacity-0 animate-fade-in transition-opacity duration-300">
              Automated Face Recognition
              <br />
              <span className="text-primary">Attendance System</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in transition-opacity duration-300" style={{transitionDelay: '100ms'}}>
              Streamline your attendance tracking with our powerful yet simple facial recognition system.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4 opacity-0 animate-fade-in transition-opacity duration-300" style={{transitionDelay: '200ms'}}>
              <Button size="lg" onClick={() => navigate('/dashboard')} className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
                View Demo
              </Button>
            </div>
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 opacity-0 animate-fade-in transition-opacity duration-300" style={{transitionDelay: '300ms'}}>
            <div className="bg-card shadow-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 mx-auto">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Face Recognition</h3>
              <p className="text-muted-foreground">
                Accurate and fast facial recognition for attendance marking.
              </p>
            </div>
            
            <div className="bg-card shadow-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 mx-auto">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-muted-foreground">
                Add, edit, and manage users with intuitive controls.
              </p>
            </div>
            
            <div className="bg-card shadow-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 mx-auto">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Generation</h3>
              <p className="text-muted-foreground">
                Generate detailed attendance reports in Excel format.
              </p>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="container max-w-7xl mx-auto py-6 px-4 md:px-6 border-t opacity-0 animate-fade-in transition-opacity duration-300" style={{transitionDelay: '400ms'}}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">FA</span>
            </div>
            <span className="font-medium">FaceAttend</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FaceAttend. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
