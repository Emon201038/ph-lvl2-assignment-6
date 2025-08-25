"use client";

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
import type { IParcel, IUser } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface AdminChartProps {
  parcels: IParcel[];
  users: IUser[];
}

export function AdminChart({ parcels, users }: AdminChartProps) {
  // Process data for monthly trends (last 6 months)
  const monthlyData = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString("en-US", { month: "short" });

    const parcelsCount = parcels.filter((p) => {
      const parcelDate = new Date(p.createdAt);
      return (
        parcelDate.getMonth() === date.getMonth() &&
        parcelDate.getFullYear() === date.getFullYear()
      );
    }).length;

    const usersCount = users.filter(() => {
      // In real app, users would have createdAt field
      return true; // Placeholder for demo
    }).length;

    const revenue = parcels
      .filter((p) => {
        const parcelDate = new Date(p.createdAt);
        return (
          parcelDate.getMonth() === date.getMonth() &&
          parcelDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce((acc, p) => acc + p.paymentInfo.deleveryFee, 0);

    monthlyData.push({
      month: monthName,
      parcels: parcelsCount,
      users: Math.floor(usersCount / 6), // Distribute users across months for demo
      revenue: revenue,
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Parcel Trends</CardTitle>
          <CardDescription>
            Parcels created over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              parcels: {
                label: "Parcels",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="parcels"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>
            Monthly revenue from parcel deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue (৳)",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
