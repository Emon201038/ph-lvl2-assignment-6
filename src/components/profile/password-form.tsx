import React from "react";

import z from "zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { useUpdateUserMutation } from "@/redux/features/user/userApi";
import type { IUser } from "@/types";
import { toast } from "sonner";
import { RHFInput } from "../rhf-input";
import { Link } from "react-router";

interface Props {
  user: IUser;
}

const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),

    password: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/[a-z]/, "New password must contain at least one lowercase letter")
      .regex(/[0-9]/, "New password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "New password must contain at least one special character"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error message will appear at confirmPassword
  });

export type PasswordChangeSchema = z.infer<typeof passwordChangeSchema>;

const Password: React.FC<Props> = ({ user }) => {
  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [updatePassword, { isLoading }] = useUpdateUserMutation();

  const handleSubmit = async (data: z.infer<typeof passwordChangeSchema>) => {
    try {
      await updatePassword({
        id: user._id,
        data: data,
      }).unwrap();
      toast.success("Password Updated Successfully!", {
        description: "Your password has been updated successfully.",
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <RHFInput
          name="currentPassword"
          label="Current Password"
          control={form.control}
          type="password"
          placeholder="Enter current password"
        />
        <RHFInput
          name="password"
          control={form.control}
          type="password"
          label="New Password"
          placeholder="Enter new password"
        />
        <RHFInput
          name="confirmPassword"
          control={form.control}
          type="password"
          label="Confirm Password"
          placeholder="Enter confirm password"
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          <Lock className="h-4 w-4 mr-2" />
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
      <Link
        to="/forgot-password"
        state={{ email: user.email }}
        className="w-full text-center text-blue-500 underline mt-2 "
      >
        Forgot Password?
      </Link>
    </Form>
  );
};

export default Password;
