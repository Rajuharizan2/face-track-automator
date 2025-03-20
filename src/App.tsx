
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, ClerkLoaded } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CameraSettings from "./pages/CameraSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ClerkLoaded>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignedOut><SignIn /></SignedOut>} />
            <Route path="/sign-up" element={<SignedOut><SignUp /></SignedOut>} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <SignedIn>
                  <Dashboard />
                </SignedIn>
              }
            />
            <Route
              path="/users"
              element={
                <SignedIn>
                  <Users />
                </SignedIn>
              }
            />
            <Route
              path="/reports"
              element={
                <SignedIn>
                  <Reports />
                </SignedIn>
              }
            />
            <Route
              path="/settings"
              element={
                <SignedIn>
                  <Settings />
                </SignedIn>
              }
            />
            <Route
              path="/camera-settings"
              element={
                <SignedIn>
                  <CameraSettings />
                </SignedIn>
              }
            />
            
            {/* Fallback routes */}
            <Route
              path="/sign-in/*"
              element={<Navigate to="/sign-in" replace />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClerkLoaded>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
