import { RHFInput } from "@/components/rhf-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { resetPasswordSchema } from "@/lib/zodSchema";
import {
  useLoginMutation,
  useResetPasswordMutation,
} from "@/redux/features/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import type z from "zod";

const ResetPassword = () => {
  document.title = "Reset Password | ParcelPro";
  const [params] = useSearchParams();
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      token: params.get("token") || "",
      id: params.get("id") || "",
    },
  });

  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [login, { isLoading: loginLoading }] = useLoginMutation();

  const handleSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      if (!data.token || !data.id) {
        toast.error("Your session is expires. Please try again");
        return;
      }
      const res = await resetPassword(
        data as { token: string; id: string; newPassword: string }
      ).unwrap();
      toast.success("Password Reset Successfully!", {
        description:
          "Your password has been updated successfully. Now you can login with your new password.",
      });
      if (res.success && res.data.email) {
        const loginResult = await login({
          email: res.data.email,
          password: data.newPassword,
        });
        if (loginResult.data?.accessToken) {
          navigate("/profile");
        } else {
          toast.error("Login Failed", {
            description: (loginResult.error as any)?.message as string,
          });
        }
      }
    } catch (error) {
      toast.error("Update Failed", {
        description:
          (error as any)?.data?.message === "jwt expired"
            ? "Your session is expires. Please try again"
            : (error as any)?.data?.message ||
              "Failed to update password. Please try again.",
      });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Create a strong and secure password to protect your account.
            </CardDescription>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <RHFInput
                    control={form.control}
                    name={"newPassword"}
                    label={"New Password"}
                    type={"password"}
                    placeholder="Enter New Password"
                  />
                  <RHFInput
                    control={form.control}
                    name={"confirmPassword"}
                    label={"Confirm Password"}
                    type={"password"}
                    placeholder="Confirm New Password"
                  />
                  <Button
                    disabled={isLoading || loginLoading}
                    className="w-full"
                  >
                    {isLoading ? "Saving..." : "Save Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
