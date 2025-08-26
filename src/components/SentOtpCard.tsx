import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useSendOtpMutation } from "@/redux/features/auth/authApi";

interface SendOTPCardProps {
  title?: string;
  description?: string;
  email: string;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
  className?: string;
  setIsConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SendOTPCard({
  title = "Send Verification Code",
  setIsConfirmed,
  onSuccess,
  onError,
  className = "",
  email,
}: SendOTPCardProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [sendOTP, { isLoading }] = useSendOtpMutation();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Failed to send verification code. Please try again.");
      return;
    }
    setSuccess(false);

    try {
      await sendOTP({ email }).unwrap();

      setSuccess(true);
      setIsConfirmed(true);

      toast.success("Verification Code Sent!", {
        description: `A 6-digit code has been sent to ${email}`,
      });

      onSuccess?.(email);
    } catch (error: any) {
      const errorMessage =
        "Failed to send verification code. Please try again.";
      setError(errorMessage);
      onError?.(errorMessage);

      toast.error("Failed to Send Code", {
        description: error?.data?.message || errorMessage,
      });
    }
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
          {success ? (
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          ) : (
            <Mail className="w-8 h-8 text-red-600 dark:text-red-400" />
          )}
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          {success ? "Code Sent Successfully!" : title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          We will send a 6-digit verification code to {email}. Click the button
          below to send the code.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!success && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending Code...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Verification Code
                </>
              )}
            </Button>
          </form>
        )}

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            The verification code will expire in 10 minutes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
