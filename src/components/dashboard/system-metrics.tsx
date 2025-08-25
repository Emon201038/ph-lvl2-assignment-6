import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ParcelStatus, type IParcel, type IUser } from "@/types";
import { TrendingUp, Users, Package } from "lucide-react";

interface SystemMetricsProps {
  parcels: IParcel[];
  users: IUser[];
}

export function SystemMetrics({ parcels, users }: SystemMetricsProps) {
  const metrics = {
    deliveryRate:
      parcels.length > 0
        ? (parcels.filter((p) => p.status === ParcelStatus.DELIVERED).length /
            parcels.length) *
          100
        : 0,
    activeUserRate:
      users.length > 0
        ? (users.filter((u) => !u.isBlocked).length / users.length) * 100
        : 0,
    avgDeliveryTime: 2.5, // Mock data
    customerSatisfaction: 94.5, // Mock data
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Performance Metrics</CardTitle>
        <CardDescription>
          Key performance indicators for the delivery system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Delivery Success Rate</span>
            </div>
            <span className="text-sm font-bold">
              {metrics.deliveryRate.toFixed(1)}%
            </span>
          </div>
          <Progress value={metrics.deliveryRate} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Active User Rate</span>
            </div>
            <span className="text-sm font-bold">
              {metrics.activeUserRate.toFixed(1)}%
            </span>
          </div>
          <Progress value={metrics.activeUserRate} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Customer Satisfaction</span>
            </div>
            <span className="text-sm font-bold">
              {metrics.customerSatisfaction}%
            </span>
          </div>
          <Progress value={metrics.customerSatisfaction} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {metrics.avgDeliveryTime}
            </div>
            <div className="text-xs text-muted-foreground">
              Avg Delivery Days
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {parcels
                .reduce((acc, p) => acc + p.paymentInfo.deleveryFee, 0)
                .toFixed(0)}{" "}
              ৳
            </div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
