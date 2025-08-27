import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Inbox, CheckCircle, Clock, TrendingDown } from "lucide-react";
import { ParcelTable } from "@/components/dashboard/parcel-table";
import { ReceiverChart } from "@/components/dashboard/receiver-chart";
import { ParcelStatus, UserRole, type IParcel } from "@/types";
import { useGetReceiverParcelsQuery } from "@/redux/features/parcel/parcelApi";
import { useSession } from "@/providers/auth-provider";

export default function ReceiverDashboard() {
  document.title = "Dashboard | ParcelPro";

  const session = useSession();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    search: "",
    populate:
      "receiver:name;picture;role,sender:name;picture;role,statusLogs.updatedBy:name;picture;role",
    receiver: session?.data?._id,
    isDeleted: false,
  });

  const {
    data: parcelsData,
    isLoading,
    refetch,
  } = useGetReceiverParcelsQuery(
    new URLSearchParams(filters as any).toString(),
    { skip: !session.data?._id && session.isLoading }
  );

  useEffect(() => {
    if (session?.data?._id) {
      setFilters((prev) => ({
        ...prev,
        receiver: session?.data?._id,
      }));
      refetch();
    }
  }, [session?.data?._id]);

  if (session.isLoading || isLoading) {
    return <div>Loading...</div>;
  }

  // Filter parcels for receiver (in real app, this would be filtered by receiver ID on backend)
  const receiverParcels = parcelsData || ([] as IParcel[]);

  const stats = {
    total: receiverParcels.length,
    pending: receiverParcels.filter(
      (p) =>
        p.status === ParcelStatus.PENDING ||
        p.status === ParcelStatus.DISPATCHED
    ).length,
    inTransit: receiverParcels.filter(
      (p) => p.status === ParcelStatus.IN_TRANSIT
    ).length,
    delivered: receiverParcels.filter(
      (p) => p.status === ParcelStatus.DELIVERED
    ).length,
    thisMonth: receiverParcels.filter((p) => {
      const parcelDate = new Date(p.createdAt);
      const now = new Date();
      return (
        parcelDate.getMonth() === now.getMonth() &&
        parcelDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  const averageDeliveryTime = () => {
    // Filter only parcels with valid statusLogs
    const validParcels = (parcelsData || []).filter(
      (p) =>
        p.statusLogs &&
        p.statusLogs.find((sl: any) => sl?.status === "DELIVERED") &&
        p.statusLogs.find((sl: any) => sl?.status === "PENDING")
    );

    if (!validParcels.length) return "N/A";

    // Sum all differences
    const totalMs = validParcels.reduce((sum, parcel) => {
      const delivered = parcel.statusLogs.find(
        (sl: any) => sl?.status === "DELIVERED"
      )?.timestamp;
      const pending = parcel.statusLogs.find(
        (sl: any) => sl?.status === "PENDING"
      )?.timestamp;

      if (!delivered || !pending) return sum;

      return (
        sum + (new Date(delivered).getTime() - new Date(pending).getTime())
      );
    }, 0);

    const avgMs = totalMs / validParcels.length;

    // Convert to units
    return avgMs / (1000 * 60 * 60 * 24);
  };

  return (
    <AuthGuard allowedRoles={[UserRole.RECEIVER, UserRole.ADMIN]}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Receiver Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your incoming parcels and manage deliveries
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Badge variant="outline" className="text-sm">
                {stats.inTransit} parcels in transit
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Received
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All time parcels received
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Transit
                </CardTitle>
                <Inbox className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.inTransit}
                </div>
                <p className="text-xs text-muted-foreground">
                  On the way to you
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
                  Successfully received
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.thisMonth}
                </div>
                <p className="text-xs text-muted-foreground">
                  Parcels this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <ReceiverChart data={receiverParcels} />
            <Card>
              <CardHeader>
                <CardTitle>Pending Deliveries</CardTitle>
                <CardDescription>
                  Parcels awaiting your confirmation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {receiverParcels
                    .filter((p) => p.status === ParcelStatus.IN_TRANSIT)
                    .slice(0, 5)
                    .map((parcel) => (
                      <div
                        key={parcel._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {parcel.trackingId}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              From: {parcel.deliveryInfo.pickupAddress.name}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">In Transit</Badge>
                      </div>
                    ))}
                  {receiverParcels.filter(
                    (p) => p.status === ParcelStatus.IN_TRANSIT
                  ).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No parcels in transit</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-blue-200 ">
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <Inbox className="h-5 w-5" />
                  Incoming Parcels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {stats.pending + stats.inTransit}
                </div>
                <p className="text-sm text-blue-600">
                  Parcels on their way to you
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 ">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Ready to Confirm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {stats.inTransit}
                </div>
                <p className="text-sm text-green-600">
                  Parcels awaiting confirmation
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Average Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {averageDeliveryTime()} days
                </div>
                <p className="text-sm text-purple-600">Average delivery time</p>
              </CardContent>
            </Card>
          </div>

          {/* Parcels Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Parcels</CardTitle>
              <CardDescription>
                View and manage all your incoming and received parcels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParcelTable
                data={{
                  parcels: parcelsData as IParcel[],
                  total: parcelsData?.length || 0,
                }}
                isLoading={isLoading}
                filters={filters}
                onFiltersChange={setFilters}
                userRole={UserRole.RECEIVER}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
