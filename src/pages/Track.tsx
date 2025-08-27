import type React from "react";

import { useEffect, useState } from "react";
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
import { Search, Package } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import Timeline from "@/components/parcel/timeline";
import { useTrackParcelQuery } from "@/redux/features/parcel/parcelApi";
import ParcelDetails from "@/components/parcel/parcel-details";

export default function TrackPage() {
  document.title = "Track Parcel | ParcelPro";
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const qParam = searchParams.get("q") || "";
  const {
    data: statusLog,
    isLoading,
    isError,
  } = useTrackParcelQuery(qParam as string, {
    skip: !qParam,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId) {
      setSearchParams({ q: trackingId });
      navigate(`/track?${new URLSearchParams({ q: trackingId }).toString()}`);
    } else {
      setSearchParams({}); // clear if empty
    }
  };

  useEffect(() => {
    if (qParam) {
      setTrackingId(qParam);
    }
  }, [qParam]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Track Your <span className="text-primary">Parcel</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your tracking ID to get real-time updates on your parcel's
            journey
          </p>
        </div>

        <div>
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
                    defaultValue={qParam || ""}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter tracking ID (e.g., TRK-20250731-2075JZ)"
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Track Parcel"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {!isLoading && isError ? (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Parcel Not Found</h3>
                <p>No parcel found with tracking ID: {qParam}</p>
                <p className="text-sm mt-2">
                  Please check your tracking ID and try again.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {statusLog && statusLog.length > 0 && <ParcelDetails />}

        {!isLoading && !isError && statusLog && statusLog.length > 0 && (
          <Timeline statusLog={statusLog} />
        )}
      </div>
    </div>
  );
}
