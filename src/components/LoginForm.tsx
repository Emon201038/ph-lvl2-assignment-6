import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { UserRole } from "@/types";
import { useNavigate } from "react-router";
import { useSession } from "@/providers/auth-provider";

interface Props {}

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
});

const LoginForm: React.FC<Props> = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navitage = useNavigate();
  const session = useSession();
  const [login, { isLoading, isError, error }] = useLoginMutation();

  useEffect(() => {
    if (isError) {
      toast.error("Login Failed", {
        description:
          ((error as any).message as string) || "Invalid email or password",
      });
    }
  }, []);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const result = await login(data).unwrap();

      toast.success("Login Successful!", {
        description: `Welcome back!`,
      });
      await session.refetch?.();

      // Redirect based on role
      const dashboardPath =
        result.role === UserRole.ADMIN
          ? "/dashboard/admin"
          : result.role === UserRole.SUPER_ADMIN
          ? "/dashboard/admin"
          : result.role === UserRole.SENDER
          ? "/dashboard/sender"
          : "/dashboard/receiver";

      navitage(dashboardPath);
      console.log(data);
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error.data?.message || "Invalid email or password",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  required
                  className=" autofill:bg-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className=" autofill:bg-transparent"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
