
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl">FaceAttend</span>
        </div>

        <nav className="flex gap-4">
          <SignedIn>
            <Button asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </header>

      <main className="container pt-20 pb-16">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">
              Secure Attendance System
            </div>
            <h1 className="text-4xl font-bold lg:text-6xl">
              Facial Recognition Attendance
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Securely track attendance using facial recognition technology.
              Deploy multiple cameras, integrate with IP cameras, and automate
              your attendance system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <SignedIn>
                <Button asChild size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </SignedIn>
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg">Get Started</Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="outline" size="lg">Sign In</Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>

          <div className="mx-auto lg:mx-0 lg:order-last">
            <img
              src="/og-image.png"
              alt="Dashboard Preview"
              className="rounded-xl shadow-xl"
              width={550}
              height={400}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-12 mt-20">
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Accurate Recognition</h3>
            <p className="text-muted-foreground">
              Advanced facial recognition algorithms for accurate and reliable
              attendance tracking.
            </p>
          </div>

          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Multiple Camera Support</h3>
            <p className="text-muted-foreground">
              Connect multiple webcams and IP cameras for comprehensive coverage
              and monitoring.
            </p>
          </div>

          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Detailed Reports</h3>
            <p className="text-muted-foreground">
              Generate comprehensive attendance reports with detailed analytics
              and insights.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} FaceAttend. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
