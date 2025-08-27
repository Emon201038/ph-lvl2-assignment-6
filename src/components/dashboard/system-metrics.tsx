import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type IParcelStat, type IUserStat } from "@/types";
import { TrendingUp, Users, Package } from "lucide-react";

interface SystemMetricsProps {
  userStats: IUserStat;
  parcelStats: IParcelStat;
}

export function SystemMetrics({ userStats, parcelStats }: SystemMetricsProps) {
  const metrics = {
    deliveryRate:
      parcelStats.allParcel > 0
        ? ((parcelStats.parcelByStatus.DELIVERED || 0) /
            parcelStats.allParcel) *
          100
        : 0,
    activeUserRate:
      userStats.totalUsers > 0
        ? (userStats.activeUsers / userStats.totalUsers) * 100
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
              {parcelStats.totalRevinue} ৳
            </div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
