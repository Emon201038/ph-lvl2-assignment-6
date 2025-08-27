import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { ParcelChart } from "@/components/dashboard/parcel-piechart";
import { ParcelTable } from "@/components/dashboard/parcel-table";
import { useGetSenderParcelsQuery } from "@/redux/features/parcel/parcelApi";
import { ParcelStatus, UserRole, type IUser } from "@/types";
import { Link } from "react-router";
import { useSession } from "@/providers/auth-provider";
import ParcelBarchart from "@/components/dashboard/parcel-barchart";
import { toast } from "sonner";

export default function SenderDashboard() {
  document.title = "Dashboard | ParcelPro";

  const session = useSession();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    search: "",
    isDeleted: false,
    populate: "sender:name;picture;role,receiver:name;picture;role",
    initiatedBy: session?.data?._id,
  });

  const {
    data: parcelsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSenderParcelsQuery(new URLSearchParams(filters as any).toString(), {
    skip: !session?.data?._id,
  });

  useEffect(() => {
    if (session?.data?._id) {
      setFilters((prev) => ({
        ...prev,
        initiatedBy: session?.data?._id,
      }));
      refetch();
    }
  }, [session?.data?._id]);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    toast.error("Failed to get parcels data", {
      description: (error as any)?.data?.message || "Something went wrong.",
    });

  const stats = {
    total: parcelsData?.length || 0,
    pending:
      parcelsData?.filter((p) => p.status === ParcelStatus.PENDING).length || 0,
    inTransit:
      parcelsData?.filter((p) => p.status === ParcelStatus.IN_TRANSIT).length ||
      0,
    delivered:
      parcelsData?.filter((p) => p.status === ParcelStatus.DELIVERED).length ||
      0,
    cancelled:
      parcelsData?.filter((p) => p.status === ParcelStatus.CANCELED).length ||
      0,
  };

  // Process data for monthly trends (last 12 months)
  const monthlyData: { month: string; parcels: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString("en-US", { month: "short" });
    const count =
      parcelsData?.filter((p) => {
        const parcelDate = new Date(p.createdAt);
        return (
          parcelDate.getMonth() === date.getMonth() &&
          parcelDate.getFullYear() === date.getFullYear()
        );
      }).length || 0;

    monthlyData.push({
      month: monthName,
      parcels: count,
    });
  }

  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN, UserRole.SENDER]}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Sender Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your parcel deliveries and track their progress
              </p>
            </div>
            <Link to="/dashboard/sender/create">
              <Button className="mt-4 sm:mt-0 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Parcel
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Parcels
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All time parcels sent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Transit
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.inTransit}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently being delivered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.delivered}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully delivered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting pickup</p>
              </CardContent>
            </Card>
          </div>

          {/* Pie Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <ParcelChart data={parcelsData || []} />
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest parcel updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parcelsData?.slice(0, 5).map((parcel) => (
                    <div
                      key={parcel._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {parcel.trackingId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            To: {(parcel.receiver as IUser)?.name}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          parcel.status === ParcelStatus.DELIVERED
                            ? "default"
                            : parcel.status === ParcelStatus.IN_TRANSIT
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {parcel.status?.split("_").join(" ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart Section */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8 w-full justify-center items-center">
            <ParcelBarchart monthlyData={monthlyData} />
          </div>

          {/* Parcels Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Parcels</CardTitle>
              <CardDescription>
                View and manage all your parcel deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParcelTable
                data={{
                  parcels: parcelsData || [],
                  total: parcelsData?.length || 0,
                }}
                isLoading={isLoading}
                filters={filters}
                onFiltersChange={setFilters}
                userRole={UserRole.SENDER}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
