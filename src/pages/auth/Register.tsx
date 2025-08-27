import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { useSession } from "@/providers/auth-provider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { registerUserSchema, type RegisterUserSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInput } from "@/components/rhf-input";
import { useRegisterMutation } from "@/redux/features/user/userApi";

export default function RegisterPage() {
  document.title = "Register | ParcelPro";
  const session = useSession();
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const form = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "SENDER",
    },
  });

  useEffect(() => {
    if (session?.data?._id && !session?.isLoading) {
      navigate("/");
    }
  }, [session]);

  if (session?.isLoading) return <div>Loading...</div>;
  const handleSubmit = async (e: RegisterUserSchema) => {
    try {
      const res = await registerUser(e).unwrap();
      if (res?.success) {
        toast.success("Registration Successful!", {
          description: `Welcome to ParcelPro,`,
        });
        navigate("/verify", { state: { email: e.email } });
      } else {
        toast.error("Registration Failed", {
          description:
            res?.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error: any) {
      toast.error("Registration Failed", {
        description:
          error.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join ParcelPro</CardTitle>
            <CardDescription>
              Create your account to start sending or receiving parcels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <RHFInput
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Enter your full name"
                />

                <RHFInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />

                <RHFInput
                  control={form.control}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />

                <RHFInput
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col"
                        >
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <RadioGroupItem value="SENDER" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Sender - I want to send parcel
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <RadioGroupItem value="RECEIVER" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Receiver - I want to receive parcel
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>
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
            Sign Up with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
