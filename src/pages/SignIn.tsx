
import { SignIn } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
          <SignIn signUpUrl="/sign-up" redirectUrl="/dashboard" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
