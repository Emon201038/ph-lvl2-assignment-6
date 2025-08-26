import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import InputOtpCard from "@/components/InputOtpCard";
import SendOTPCard from "@/components/SentOtpCard";
import { useLocation } from "react-router";
import NotFound from "../NotFound";

export default function VerifyPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [success, setSuccess] = useState(false);
  const location = useLocation();

  const email = location.state?.email;
  const role = location.state?.role;

  if (!email) {
    return <NotFound />;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Account Verified!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Your account has been successfully verified. Redirecting to
                  your dashboard...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-4">
      {isConfirmed ? (
        <InputOtpCard role={role} email={email} setSuccess={setSuccess} />
      ) : (
        <SendOTPCard email={email} setIsConfirmed={setIsConfirmed} />
      )}
    </div>
  );
}
