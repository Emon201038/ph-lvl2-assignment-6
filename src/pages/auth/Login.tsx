import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import { Link, useNavigate } from "react-router";
import LoginForm from "@/components/LoginForm";
import { useEffect } from "react";
import { useSession } from "@/hooks/session";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  document.title = "Login | ParcelPro";
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.data?._id && !session?.isLoading) {
      navigate("/");
    }
  }, [session]);

  if (session?.isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        <div className="w-full flex justify-center items-center">
          <Button
            onClick={() =>
              window.open(`${import.meta.env.VITE_API_URL}/api/v1/auth/google`)
            }
            variant="outline"
          >
            <img src="/icons/google.svg" className="h-4 w-4" alt="Google" />
            Sign In with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
