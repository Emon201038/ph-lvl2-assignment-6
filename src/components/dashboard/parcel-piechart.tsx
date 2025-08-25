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
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// import type { Parcel } from "@/lib/api/parcelApi";

interface ParcelChartProps {
  data: IParcel[];
}

export function ParcelChart({ data }: ParcelChartProps) {
  // Process data for status distribution
  const statusData = [
    {
      status: "Pending",
      count: data.filter((p) => p.status === ParcelStatus.PENDING).length,
      color: "orange",
    },
    {
      status: "Dispatched",
      count: data.filter((p) => p.status === ParcelStatus.DISPATCHED).length,
      color: "purple",
    },
    {
      status: "In Transit",
      count: data.filter((p) => p.status === ParcelStatus.IN_TRANSIT).length,
      color: "blue",
    },
    {
      status: "Delivered",
      count: data.filter((p) => p.status === ParcelStatus.DELIVERED).length,
      color: "green",
    },
    {
      status: "Cancelled",
      count: data.filter((p) => p.status === ParcelStatus.CANCELED).length,
      color: "red",
    },
  ];

  return (
    <div className="w-full">
      <Card className="flex flex-col w-full">
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>Current status of all your parcels</CardDescription>
        </CardHeader>
        <CardContent className="p-0 w-full">
          <ChartContainer
            config={{
              count: {
                label: "Parcels",
                color: "hsl(var(--chart-1))",
              },
              pending: {
                label: "Pending",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="w-full aspect-square  max-h-[250px] flex justify-center items-center"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="count"
                  nameKey="status"
                  className="mx-auto w-full"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusData.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.status} ({item.count})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
