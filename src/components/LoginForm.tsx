import React, { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { UserRole } from "@/types";
import { Link, useNavigate } from "react-router";
import { useSession } from "@/providers/auth-provider";
import { RHFInput } from "./rhf-input";

interface Props {}

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
});

const LoginForm: React.FC<Props> = () => {
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
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error.data?.message || "Invalid email or password",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <RHFInput
          type="email"
          name="email"
          label="Email"
          control={form.control}
          placeholder="Enter your email"
        />
        <div>
          <RHFInput
            type="password"
            name="password"
            label="Password"
            control={form.control}
            placeholder="Enter your password"
          />
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 underline text-right w-full"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
