import type React from "react";

import { useState } from "react";
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
// import { Badge } from "@/components/ui/badge";
// import { useGetParcelByTrackingQuery } from "@/lib/api/parcelApi";
import { Search, Package, MapPin, Clock, User } from "lucide-react";

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [searchId, setSearchId] = useState("");

  // const {
  //   data: parcel,
  //   isLoading,
  //   error,
  // } = useGetParcelByTrackingQuery(searchId, {
  //   skip: !searchId,
  // });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSearchId(trackingId.trim());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "in-transit":
        return "bg-blue-500";
      case "dispatched":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Pickup";
      case "dispatched":
        return "Dispatched";
      case "in-transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const isLoading = false;
  const error = null;
  const parcel = null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Track Your <span className="text-primary">Parcel</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your tracking ID to get real-time updates on your parcel's
            journey
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Parcel Tracking
            </CardTitle>
            <CardDescription>
              Enter your tracking ID to view detailed parcel information and
              status updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="trackingId" className="sr-only">
                  Tracking ID
                </Label>
                <Input
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter tracking ID (e.g., PKG123456789)"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Searching..." : "Track Parcel"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Parcel Not Found</h3>
                <p>No parcel found with tracking ID: {searchId}</p>
                <p className="text-sm mt-2">
                  Please check your tracking ID and try again.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {parcel && (
          <div className="space-y-6">
            {/* Parcel Overview */}
            {/* <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Parcel Details
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(parcel.status)} text-white`}
                  >
                    {getStatusText(parcel.status)}
                  </Badge>
                </div>
                <CardDescription>
                  Tracking ID: {parcel.trackingId}
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
                        {parcel.senderName}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {parcel.senderPhone}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {parcel.senderAddress}
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
                        {parcel.receiverName}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {parcel.receiverPhone}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {parcel.receiverAddress}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Weight:
                      </span>
                      <p className="font-semibold">{parcel.weight} kg</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Delivery Charge:
                      </span>
                      <p className="font-semibold">${parcel.deliveryCharge}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Created:
                      </span>
                      <p className="font-semibold">
                        {new Date(parcel.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Last Updated:
                      </span>
                      <p className="font-semibold">
                        {new Date(parcel.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Status Timeline */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Status Timeline
                </CardTitle>
                <CardDescription>
                  Track your parcel's journey from pickup to delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parcel.statusLogs?.map((log, index) => (
                    <div key={log.id} className="flex items-start gap-4">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(
                          log.status
                        )}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground">
                            {getStatusText(log.status)}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {log.note && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {log.note}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Updated by: {log.updatedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        )}

        {/* Demo Notice */}
        {!parcel && !error && searchId && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Demo Mode</h3>
                <p className="text-muted-foreground">
                  This is a demo version. In the real application, this would
                  connect to the backend API to fetch actual parcel tracking
                  information.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
