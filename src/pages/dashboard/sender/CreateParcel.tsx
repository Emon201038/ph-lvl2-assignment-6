import { AuthGuard } from "@/components/auth/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { UserRole, type IArea, type ICity } from "@/types";
import { Link, useNavigate } from "react-router";
import ParcelType from "@/components/parcel/parcel-type";
import { useForm } from "react-hook-form";
import { parcelSchema, type ParcelSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { RHFSelect } from "@/components/rhf-select";
import { RHFInput } from "@/components/rhf-input";
import { RHFTextarea } from "@/components/rhf-textarea";
import { calculateDeliveryFee } from "@/utils/calculateDeliveryFee";
import type z from "zod";
import { useCreateParcelMutation } from "@/redux/features/parcel/parcelApi";
import { useEffect, useState } from "react";
import state from "@/../data/state.json";
import { fetchAreas, fetchCities } from "@/utils/fetchLocation";

export type ParcelFormType = ReturnType<
  typeof useForm<z.infer<typeof parcelSchema>>
>;

export default function CreateParcelPage() {
  document.title = "Create Parcel | ParcelPro";

  const form = useForm({
    resolver: zodResolver(parcelSchema),
  });

  const [cities, setCities] = useState<ICity[]>([]);
  const [areas, setAreas] = useState<IArea[]>([]);
  const [deliveryCities, setDeliveryCities] = useState<ICity[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<IArea[]>([]);
  const [pickupAddress, setPickupAddress] = useState<{
    state: string;
    city: string;
    area: string;
  }>({
    state: "",
    city: "",
    area: "",
  });
  const [deliveryAddress, setDeliveryAddress] = useState<{
    state: string;
    city: string;
    area: string;
  }>({
    state: "",
    city: "",
    area: "",
  });
  const navigate = useNavigate();

  const [createParcel, { isLoading }] = useCreateParcelMutation();

  useEffect(() => {
    if (pickupAddress.state) {
      fetchCities(pickupAddress.state).then((data) => setCities(data));
    } else {
      setCities([]);
    }
  }, [pickupAddress.state]);

  useEffect(() => {
    if (pickupAddress.city) {
      fetchAreas(pickupAddress.city).then((data) => {
        setAreas(data);
      });
    } else {
      setAreas([]);
    }
  }, [pickupAddress.city]);

  useEffect(() => {
    if (deliveryAddress.state) {
      fetchCities(deliveryAddress.state).then((data) =>
        setDeliveryCities(data)
      );
    } else {
      setDeliveryCities([]);
    }
  }, [deliveryAddress.state]);

  useEffect(() => {
    if (deliveryAddress.city) {
      fetchAreas(deliveryAddress.city).then((data) => {
        setDeliveryAreas(data);
      });
    } else {
      setDeliveryAreas([]);
    }
  }, [deliveryAddress.city]);

  const handleSubmit = async (e: ParcelSchema) => {
    try {
      const result = await createParcel(e).unwrap();
      toast.success("Parcel Created Successfully!", {
        description: `Your parcel has been created with tracking ID: ${result.trackingId}`,
      });

      form.reset();
      navigate("/dashboard/sender");
    } catch (error: any) {
      toast.error("Failed to Create Parcel", {
        description:
          error.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <AuthGuard allowedRoles={[UserRole.SENDER, UserRole.ADMIN]}>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Create New Parcel
              </h1>
              <p className="text-muted-foreground mt-1">
                Fill in the details to create a new parcel delivery request
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              {/* Sender Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Sender Information
                  </CardTitle>
                  <CardDescription>
                    Your details as the sender of this parcel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <RHFInput
                      name="deliveryInfo.pickupAddress.name"
                      label="Name"
                      control={form.control}
                      placeholder="Sender name"
                    />
                    <RHFInput
                      name="deliveryInfo.pickupAddress.phone"
                      label="Phone"
                      control={form.control}
                      placeholder="Sender Phone"
                    />
                  </div>
                  <div className=" w-full grid grid-cols-3 items-center gap-1 md:gap-4">
                    <RHFSelect
                      control={form.control}
                      name={"deliveryInfo.pickupAddress.state"}
                      options={state.map((s) => ({
                        label: s.name,
                        value: s.name,
                        id: s.id,
                      }))}
                      label="State"
                      placeholder="State"
                      className="w-full"
                      onChange={async (e) => {
                        setPickupAddress((prev) => ({
                          ...prev,
                          state: e.id!,
                        }));
                      }}
                      allowSearch
                    />
                    <RHFSelect
                      allowSearch
                      control={form.control}
                      name={"deliveryInfo.pickupAddress.city"}
                      options={cities.map((c) => ({
                        label: c.name,
                        value: c.name,
                        id: c.id,
                      }))}
                      label="City"
                      placeholder="City"
                      className="w-full"
                      onChange={async (e) => {
                        setPickupAddress((prev) => ({
                          ...prev,
                          city: e.id!,
                        }));
                      }}
                    />
                    <RHFSelect
                      allowSearch
                      control={form.control}
                      name={"deliveryInfo.pickupAddress.area"}
                      options={areas.map((a) => ({
                        label: a.name,
                        value: a.name,
                        id: a.id,
                      }))}
                      label="Area"
                      placeholder="Area"
                      className="w-full"
                      onChange={async (e) => {
                        setPickupAddress((prev) => ({
                          ...prev,
                          area: e.id!,
                        }));
                      }}
                    />
                  </div>
                  <RHFTextarea
                    control={form.control}
                    name={"deliveryInfo.pickupAddress.address"}
                    label="Pickup Address"
                    placeholder={"Enter complete pickup address"}
                  />
                </CardContent>
              </Card>

              {/* Receiver Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Receiver Information</CardTitle>
                  <CardDescription>
                    Details of the person who will receive this parcel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <RHFInput
                      control={form.control}
                      name="receiverEmail"
                      label="Email"
                      placeholder="Enter receiver email"
                    />
                    <RHFInput
                      control={form.control}
                      name="deliveryInfo.deliveryAddress.name"
                      label="Full Name"
                      placeholder="Enter receiver full name"
                    />
                    <RHFInput
                      control={form.control}
                      name="deliveryInfo.deliveryAddress.phone"
                      label="Phone"
                      placeholder="Enter receiver Phone number"
                    />
                  </div>
                  <div className=" w-full grid grid-cols-3 items-center gap-1 md:gap-4">
                    <RHFSelect
                      allowSearch
                      control={form.control}
                      name={"deliveryInfo.deliveryAddress.state"}
                      options={state.map((s) => ({
                        label: s.name,
                        value: s.name,
                        id: s.id,
                      }))}
                      label="State"
                      placeholder="State"
                      className="w-full"
                      onChange={async (e) => {
                        setDeliveryAddress((prev) => ({
                          ...prev,
                          state: e.id!,
                        }));
                      }}
                    />
                    <RHFSelect
                      allowSearch
                      control={form.control}
                      name={"deliveryInfo.deliveryAddress.city"}
                      options={deliveryCities.map((c) => ({
                        label: c.name,
                        value: c.name,
                        id: c.id,
                      }))}
                      label="City"
                      placeholder="City"
                      className="w-full"
                      onChange={async (e) => {
                        setDeliveryAddress((prev) => ({
                          ...prev,
                          city: e.id!,
                        }));
                      }}
                    />
                    <RHFSelect
                      allowSearch
                      control={form.control}
                      name={"deliveryInfo.deliveryAddress.area"}
                      options={deliveryAreas.map((a) => ({
                        label: a.name,
                        value: a.name,
                        id: a.id,
                      }))}
                      label="Area"
                      placeholder="Area"
                      className="w-full"
                      onChange={async (e) => {
                        setDeliveryAddress((prev) => ({
                          ...prev,
                          area: e.id!,
                        }));
                      }}
                    />
                  </div>
                  <RHFTextarea
                    control={form.control}
                    name={"deliveryInfo.deliveryAddress.address"}
                    label="Delivery Address"
                    placeholder={"Enter complete delivery address"}
                  />
                </CardContent>
              </Card>

              {/* Parcel Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Parcel Details</CardTitle>
                  <CardDescription>
                    Information about the parcel being sent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ParcelType form={form as unknown as ParcelFormType} />
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <div className="flex gap-2">
                        <RHFInput
                          name="packageDetails.weight"
                          control={form.control}
                          placeholder="Enter weight in kg"
                          type="number"
                          className="w-full"
                          step={0.5}
                          min={0.5}
                        />

                        {/* <Button
                          type="button"
                          variant="outline"
                          onClick={calculateDeliveryCharge}
                        >
                          Calculate
                        </Button> */}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryCharge">
                        Delivery Charge (৳)
                      </Label>
                      <Input
                        disabled
                        id="deliveryCharge"
                        name="deliveryCharge"
                        type="number"
                        step="0.01"
                        min="0"
                        value={calculateDeliveryFee({
                          weight: form.watch("packageDetails.weight") as number,
                          deliveryType: form.watch(
                            "deliveryInfo.deliveryType"
                          ) as "STANDARD" | "EXPRESS",
                          pickupCity: form.watch(
                            "deliveryInfo.pickupAddress.city"
                          ),
                          deliveryCity: form.watch(
                            "deliveryInfo.deliveryAddress.city"
                          ),
                        })}
                        placeholder="Delivery charge"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <RHFInput
                      name="packageDetails.dimensions.width"
                      control={form.control}
                      label="width (m)"
                      placeholder="Enter width in meter"
                    />
                    <RHFInput
                      name="packageDetails.dimensions.length"
                      control={form.control}
                      label="Length (m)"
                      placeholder="Enter length in meter"
                    />
                    <RHFInput
                      name="packageDetails.dimensions.height"
                      control={form.control}
                      label="Height (m)"
                      placeholder="Enter height in meter"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <RHFSelect
                      control={form.control}
                      name="paymentInfo.method"
                      options={[
                        { label: "COD", value: "COD" },
                        { label: "ONLINE", value: "ONLINE" },
                      ]}
                      label="Payment Method"
                      placeholder="Select payment method"
                    />
                    <RHFSelect
                      control={form.control}
                      name="paymentInfo.status"
                      options={[
                        { label: "UNPAID", value: "UNPAID" },
                        { label: "PAID", value: "PAID" },
                      ]}
                      label="Payment Status"
                      placeholder="Select payment status"
                    />
                    <RHFInput
                      name="paymentInfo.amount"
                      control={form.control}
                      label="Amount"
                      placeholder="Enter amount"
                    />
                  </div>
                  <RHFTextarea
                    control={form.control}
                    name={"deliveryInfo.senderNote"}
                    label="Description"
                    placeholder={"Enter parcel description"}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Link to="/dashboard/sender">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Parcel..." : "Create Parcel"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AuthGuard>
  );
}
