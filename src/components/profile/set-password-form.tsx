import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { RHFInput } from "../rhf-input";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Lock } from "lucide-react";
import { Form } from "../ui/form";
import { useSetPasswordMutation } from "@/redux/features/auth/authApi";

interface Props {}

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error message will appear at confirmPassword
  });

const SetPasswordForm: React.FC<Props> = () => {
  const form = useForm({
    resolver: zodResolver(setPasswordSchema),
  });

  const [setPassword, { isLoading }] = useSetPasswordMutation();

  const handleSubmit = async (data: z.infer<typeof setPasswordSchema>) => {
    try {
      await setPassword(data).unwrap();
      toast.success("Password Set Successfully!", {
        description:
          "Your password has been updated successfully. Now you can login with your new password.",
      });
      form.reset();
    } catch (error) {
      toast.error("Update Failed", {
        description:
          (error as any)?.data?.message ||
          "Failed to update password. Please try again.",
      });
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <RHFInput
          name="password"
          label="New Password"
          type="password"
          control={form.control}
          placeholder="Enter new password"
        />
        <RHFInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          control={form.control}
          placeholder="Confirm new password"
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          <Lock className="h-4 w-4 mr-2" />
          {isLoading ? "Setting..." : "Set Password"}
        </Button>
      </form>
    </Form>
  );
};

export default SetPasswordForm;
