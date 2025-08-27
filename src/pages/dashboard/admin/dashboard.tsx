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
import {
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Activity,
  Plus,
} from "lucide-react";
import { AdminChart } from "@/components/dashboard/admin-chart";
import { SystemMetrics } from "@/components/dashboard/system-metrics";
import { UserRole, type IParcelStat, type IUserStat } from "@/types";
import { Link } from "react-router";
import {
  useGetParcelStatsQuery,
  useGetUserStatsQuery,
} from "@/redux/features/admin/adminApi";

export default function AdminDashboard() {
  document.title = "Dashboard | ParcelPro";
  const { data: userStats, isLoading: userStatsLoading } =
    useGetUserStatsQuery("");
  const { data: parcelStats, isLoading: parcelStatsLoading } =
    useGetParcelStatsQuery("");

  if (userStatsLoading || parcelStatsLoading) return <div>Loading...</div>;

  if (!userStats || !parcelStats) return null;

  const stats = {
    totalUsers: userStats?.totalUsers,
    totalParcels: parcelStats?.allParcel || 0,
    activeUsers: userStats?.activeUsers || 0,
    blockedUsers: userStats?.blockedUsers || 0,
    unVerifiedUsers: userStats?.unverifiedUsers || 0,
    pendingParcels: parcelStats?.parcelByStatus.PENDING || 0,
    inTransitParcels: parcelStats?.parcelByStatus.IN_TRANSIT || 0,
    deliveredParcels: parcelStats?.parcelByStatus.DELIVERED || 0,
    cancelledParcels: parcelStats?.parcelByStatus.CANCELED || 0,
    totalRevenue: parcelStats?.totalRevinue || 0,
    monthlyRevenue: parcelStats?.monthlyRevenue || 0,
  };

  return (
    <AuthGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                System overview and management controls
              </p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Link to="/dashboard/admin/users">
                <Button variant="outline" size="sm">
                  Manage Users
                </Button>
              </Link>
              <Link to="/dashboard/admin/parcels">
                <Button size="sm">Manage Parcels</Button>
              </Link>
              <Link to="/dashboard/admin/create">
                <Button className="mt-4 sm:mt-0 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Parcel
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeUsers} active, {stats.blockedUsers} blocked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Parcels
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalParcels}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.inTransitParcels} in transit
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.monthlyRevenue.toFixed(2)} ৳
                </div>
                <p className="text-xs text-muted-foreground">
                  Total: {stats.totalRevenue.toFixed(2)} ৳
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Delivery Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalParcels > 0
                    ? (
                        (stats.deliveredParcels / stats.totalParcels) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.deliveredParcels} delivered
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Overview */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Parcel Status Overview</CardTitle>
                <CardDescription>
                  Current distribution of parcel statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <Badge variant="outline">{stats.pendingParcels}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm">In Transit</span>
                    </div>
                    <Badge variant="outline">{stats.inTransitParcels}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm">Delivered</span>
                    </div>
                    <Badge variant="outline">{stats.deliveredParcels}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm">Cancelled</span>
                    </div>
                    <Badge variant="outline">{stats.cancelledParcels}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>
                  Breakdown of user roles and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(userStats?.usersByRole || {})
                    .map(([key, value]) => ({ role: key, count: value }))
                    .map(({ role, count }) => (
                      <div
                        key={role}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{role}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">Blocked Users</span>
                    <Badge variant="destructive">
                      {userStats?.blockedUsers}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">
                      Unverified Users
                    </span>
                    <Badge variant="destructive">
                      {userStats?.unverifiedUsers}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Valuable User</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))} */}
                  <div>
                    <h1>Most Sender: </h1>
                    <Link
                      to={`/dashboard/admin/users/${parcelStats?.mostSender?._id}`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={
                          parcelStats?.mostSender?.picture ||
                          "/images/default-user.svg"
                        }
                        className="h-8 w-8 rounded-full object-cover border"
                      />
                      <p>{parcelStats?.mostSender?.name}</p>
                    </Link>
                  </div>
                  <div>
                    <h1>Most Receiver: </h1>
                    <Link
                      to={`/dashboard/admin/users/${parcelStats?.mostReceiver?._id}`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={
                          parcelStats?.mostReceiver?.picture ||
                          "/images/default-user.svg"
                        }
                        className="h-8 w-8 rounded-full object-cover border"
                      />
                      <p>{parcelStats?.mostReceiver?.name}</p>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <AdminChart />
            <SystemMetrics
              userStats={userStats as IUserStat}
              parcelStats={parcelStats as IParcelStat}
            />
          </div>

          {/* Alerts and Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                System Alerts
              </CardTitle>
              <CardDescription>
                Important notifications requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.pendingParcels > 10 && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        High Pending Parcels
                      </p>
                      <p className="text-sm text-yellow-700">
                        {stats.pendingParcels} parcels are pending pickup.
                        Consider reviewing dispatch schedules.
                      </p>
                    </div>
                  </div>
                )}
                {(userStats?.blockedUsers as number) > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <Users className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">Blocked Users</p>
                      <p className="text-sm text-red-700">
                        {stats.blockedUsers} users are currently blocked. Review
                        user management if needed.
                      </p>
                    </div>
                  </div>
                )}
                {stats.cancelledParcels > stats.deliveredParcels * 0.1 && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <Package className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-800">
                        High Cancellation Rate
                      </p>
                      <p className="text-sm text-orange-700">
                        Cancellation rate is above 10%. Consider investigating
                        common cancellation reasons.
                      </p>
                    </div>
                  </div>
                )}
                {stats.pendingParcels <= 10 &&
                  stats.blockedUsers === 0 &&
                  stats.cancelledParcels <= stats.deliveredParcels * 0.1 && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <Activity className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">
                          System Running Smoothly
                        </p>
                        <p className="text-sm text-green-700">
                          All metrics are within normal ranges. No immediate
                          action required.
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
