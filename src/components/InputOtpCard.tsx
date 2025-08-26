import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ArrowLeft, Dot, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Link, useNavigate } from "react-router";
import {
  useSendOtpMutation,
  useVerifyOTPMutation,
} from "@/redux/features/auth/authApi";
import { toast } from "sonner";

interface Props {
  email: string;
}

const InputOtpCard: React.FC<Props> = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);

  const navigate = useNavigate();
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [sendOTP, { isLoading: isSending }] = useSendOtpMutation();

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setError("");

    try {
      await verifyOTP({ email, otp }).unwrap();

      toast.success("Verification successful!");

      navigate("/login");
    } catch (error) {
      setError("Verification failed. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    setError("");

    try {
      await sendOTP({ email }).unwrap();
      setResendCooldown(60);

      toast.success("Verification code resent!");
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    }
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          We've sent a 6-digit verification code to
          <br />
          <span className="font-medium text-gray-900 dark:text-white">
            {email}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError("");
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <Dot />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={4} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Verifying..." : "Verify Account"}
          </Button>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the code?
          </p>

          <Button
            variant="outline"
            onClick={handleResendOTP}
            disabled={resendCooldown > 0 || isSending}
            className="w-full"
          >
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : isSending
              ? "Sending otp..."
              : "Resend verification code"}
          </Button>

          <Link
            to="/register"
            className="inline-flex items-center text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to registration
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputOtpCard;
