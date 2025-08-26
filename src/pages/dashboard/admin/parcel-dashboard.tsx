import { useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetParcelsQuery } from "@/redux/features/parcel/parcelApi";
import { ParcelTable } from "@/components/dashboard/parcel-table";
import { UserRole, type IParcel } from "@/types";
import { useSession } from "@/providers/auth-provider";

export default function ParcelManagementPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 15,
    status: "",
    search: "",
  });

  const session = useSession();

  const { data: parcelsData, isLoading } = useGetParcelsQuery(
    new URLSearchParams(filters as any).toString()
  );

  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Parcel Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor and manage all system parcels
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Parcels</CardTitle>
              <CardDescription>
                View and manage all parcels in the system
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
                userRole={session?.data?.role as UserRole}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
