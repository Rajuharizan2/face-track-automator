
import { SignUp } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
          <SignUp signInUrl="/sign-in" redirectUrl="/dashboard" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
