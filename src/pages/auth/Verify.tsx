import { useState } from "react";
import InputOtpCard from "@/components/InputOtpCard";
import SendOTPCard from "@/components/SentOtpCard";
import { useLocation } from "react-router";
import NotFound from "../NotFound";

export default function VerifyPage() {
  document.title = "Verify | ParcelPro";
  const [isConfirmed, setIsConfirmed] = useState(false);
  const location = useLocation();

  const email = location.state?.email;

  if (!email) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-4">
      {isConfirmed ? (
        <InputOtpCard email={email} />
      ) : (
        <SendOTPCard email={email} setIsConfirmed={setIsConfirmed} />
      )}
    </div>
  );
}
