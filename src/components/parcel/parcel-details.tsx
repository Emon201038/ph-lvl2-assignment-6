import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DollarSign,
  Loader,
  MapPin,
  Package,
  User,
  Weight,
} from "lucide-react";
import { useGetParcelByIdQuery } from "@/redux/features/parcel/parcelApi";
import { useSearchParams } from "react-router";

interface Props {}

const ParcelDetails: React.FC<Props> = () => {
  const [params] = useSearchParams();
  const {
    data: displayParcel,
    isLoading,
    isError,
  } = useGetParcelByIdQuery(params.get("q") as string);

  if (isLoading) return <Loader />;
  if (!isLoading && isError && !displayParcel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Parcel Not Found
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Parcel Details
          </CardTitle>
        </div>
        <CardDescription>
          Tracking ID: {displayParcel?.trackingId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Sender Information
            </h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {displayParcel?.deliveryInfo?.pickupAddress?.name}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {displayParcel?.deliveryInfo?.pickupAddress?.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {displayParcel?.deliveryInfo?.pickupAddress?.address ||
                  `${displayParcel?.deliveryInfo?.pickupAddress?.area}, ${displayParcel?.deliveryInfo?.pickupAddress?.city}, ${displayParcel?.deliveryInfo?.pickupAddress?.state}`}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Receiver Information
            </h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {displayParcel?.deliveryInfo?.deliveryAddress?.name}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {displayParcel?.deliveryInfo?.deliveryAddress?.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {displayParcel?.deliveryInfo?.deliveryAddress?.address ||
                  `${displayParcel?.deliveryInfo?.deliveryAddress?.area}, ${displayParcel?.deliveryInfo?.deliveryAddress?.city}, ${displayParcel?.deliveryInfo?.deliveryAddress?.state}`}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                <Weight className="h-3 w-3" />
                Weight:
              </span>
              <p className="font-semibold">
                {displayParcel?.packageDetails?.weight} kg
              </p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Charge:
              </span>
              <p className="font-semibold">
                {displayParcel?.paymentInfo?.deleveryFee}(৳)
              </p>
            </div>
            {displayParcel?.packageDetails?.type && (
              <div>
                <span className="font-medium text-muted-foreground">Type:</span>
                <p className="font-semibold">
                  {displayParcel?.packageDetails?.type}
                </p>
              </div>
            )}
            <div>
              <span className="font-medium text-muted-foreground">
                Created:
              </span>
              <p className="font-semibold">
                {new Date(displayParcel?.createdAt as Date).toLocaleDateString(
                  "en-Us",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    formatMatcher: "best fit",
                  }
                )}
              </p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Updated:
              </span>
              <p className="font-semibold">
                {new Date(displayParcel?.updatedAt as Date).toLocaleDateString(
                  "en-Us",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    formatMatcher: "best fit",
                  }
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParcelDetails;
