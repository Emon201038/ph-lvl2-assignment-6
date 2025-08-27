import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Form } from "../ui/form";
import z from "zod";
import { ParcelStatus } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFSelect } from "../rhf-select";
import { RHFInput } from "../rhf-input";
import { Button } from "../ui/button";
import { useUpdateParcelStatusMutation } from "@/redux/features/parcel/parcelApi";
import { toast } from "sonner";

interface Props {
  id: string;
  tracking: string;
  status: ParcelStatus;
  children: React.ReactNode;
}

const formSchema = z.object({
  status: z.enum(Object.values(ParcelStatus), { error: "Status is required" }),
  note: z.string({ error: "Note is required" }).min(1, "Note is required"),
});

const ParcelStatusModal: React.FC<Props> = ({
  status,
  tracking,
  children,
  id,
}) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: status,
      note: "",
    },
  });

  const [updateStatus, { isLoading }] = useUpdateParcelStatusMutation();

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updateStatus({ ...data, id }).unwrap();
      toast.success("Status Updated Successfully!", {
        description: "The parcel status has been updated successfully.",
      });
      setOpen(false);
    } catch (error) {
      toast.error("Update Failed", {
        description:
          (error as any)?.data?.message ||
          "Failed to update status. Please try again.",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Parcel Status</DialogTitle>
          <DialogDescription>
            Update the status of the parcel {tracking}
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="w-full flex gap-3 justify-center items-center">
                <RHFSelect
                  control={form.control}
                  name="status"
                  label="Status"
                  options={Object.values(ParcelStatus).map((status) => ({
                    label: status?.split("_").join(" "),
                    value: status,
                  }))}
                  placeholder="Select a status"
                  className="w-full"
                />
                <RHFInput
                  control={form.control}
                  name="note"
                  label="Note"
                  placeholder="Enter a note"
                  id="note"
                  className="w-full"
                />
              </div>
              <div className="flex gap-3 justify-center items-center">
                <Button
                  type="button"
                  variant={"outline"}
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Confirm"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ParcelStatusModal;
