import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ParcelStatus, type IParcel } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface ReceiverChartProps {
  data: IParcel[];
}

export function ReceiverChart({ data }: ReceiverChartProps) {
  // Process data for delivery timeline (last 7 days)
  const deliveryData = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    const delivered = data.filter((p) => {
      const deliveryDate = new Date(p.updatedAt);
      return (
        p.status === ParcelStatus.DELIVERED &&
        deliveryDate.toDateString() === date.toDateString()
      );
    }).length;

    const received = data.filter((p) => {
      const createdDate = new Date(p.createdAt);
      return createdDate.toDateString() === date.toDateString();
    }).length;

    deliveryData.push({
      day: dayName,
      delivered,
      received,
    });
  }

  // Process data for monthly delivery trends (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString("en-US", { month: "short" });
    const delivered = data.filter((p) => {
      const parcelDate = new Date(p.updatedAt);
      return (
        p.status === ParcelStatus.DELIVERED &&
        parcelDate.getMonth() === date.getMonth() &&
        parcelDate.getFullYear() === date.getFullYear()
      );
    }).length;

    monthlyData.push({
      month: monthName,
      delivered,
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Delivery Activity</CardTitle>
          <CardDescription>
            Parcels received and delivered over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              delivered: {
                label: "Delivered",
                color: "hsl(var(--chart-1))",
              },
              received: {
                label: "Received",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deliveryData}>
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="delivered"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))" }}
                />
                <Line
                  type="monotone"
                  dataKey="received"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Delivery Trends</CardTitle>
          <CardDescription>
            Parcels delivered to you over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              delivered: {
                label: "Delivered",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
