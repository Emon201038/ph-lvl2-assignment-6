import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form } from "../ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/providers/auth-provider";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { RHFSelect } from "../rhf-select";
import { Button } from "../ui/button";
import { useUpdateRoleMutation } from "@/redux/features/user/userApi";

type Props = {};

const formSchema = z.object({
  role: z.enum(["SENDER", "RECEIVER"], { error: "Role is required" }),
  id: z
    .string({ error: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID"),
});

const ChangeRole = ({}: Props) => {
  const session = useSession();
  const navigate = useNavigate();
  if (session.isLoading) {
    return <div>Loading ...</div>;
  }
  if (!session.data) {
    navigate("/unauthorized");
    return null;
  }

  const [updateRole, { isLoading }] = useUpdateRoleMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: session.data.role as "SENDER" | "RECEIVER",
      id: session.data._id,
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!data.id) {
        toast.error("You are not authorized to change your role.");
        return;
      }
      await updateRole(data).unwrap();
      toast.success("Role Updated Successfully!", {
        description: "Your role has been updated successfully.",
      });
    } catch (error) {
      toast.error("Update Failed", {
        description:
          (error as any)?.data?.message ||
          "Failed to update status. Please try again.",
      });
    }
  };
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Change Role</CardTitle>
        <CardDescription>
          You can change your role here if you didn't create or receive any
          parcel
        </CardDescription>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <RHFSelect
                control={form.control}
                name="role"
                label="Role"
                placeholder="selece role"
                options={[
                  { label: "Sender", value: "SENDER" },
                  { label: "Receiver", value: "RECEIVER" },
                ]}
                className="w-fit"
              />
              <Button
                type="submit"
                disabled={isLoading || form.watch("role") === session.data.role}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default ChangeRole;
