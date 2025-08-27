import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  CheckCircle,
  Pencil,
} from "lucide-react";
import { ParcelStatus, UserRole, type IParcel, type IUser } from "@/types";
import { toast } from "sonner";
import {
  useCancelParcelMutation,
  useUpdateParcelStatusMutation,
} from "@/redux/features/parcel/parcelApi";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "../ui/label";
import ParcelStatusModal from "./parcel-status-modal";

interface ParcelTableProps {
  data?: {
    parcels: IParcel[];
    total: number;
  };
  isLoading: boolean;
  filters: {
    page: number;
    limit: number;
    status: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  userRole: IUser["role"];
}

export function ParcelTable({
  data,
  isLoading,
  filters,
  onFiltersChange,
  userRole,
}: ParcelTableProps) {
  const [selectedParcel, setSelectedParcel] = useState<IParcel | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelParcel] = useCancelParcelMutation();
  const [updateParcelStatus] = useUpdateParcelStatusMutation();
  const [inputValue, setInputValue] = useState("");

  const debouncedQuery = useDebounce(inputValue, 500);

  useEffect(() => {
    onFiltersChange({
      ...filters,
      search: debouncedQuery,
      page: 1,
    });
  }, [debouncedQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === "all" ? "" : status,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    onFiltersChange({
      ...filters,
      page: newPage,
    });
  };

  const handleCancelParcel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedParcel) return;

    const formData = new FormData(e.currentTarget);
    try {
      await cancelParcel({
        id: selectedParcel._id,
        note: formData.get("note") as string,
      }).unwrap();
      toast.success("Parcel Cancelled Successfully!", {
        description: "The parcel has been successfully cancelled.",
      });
      setShowCancelDialog(false);
      setSelectedParcel(null);
    } catch (error: any) {
      toast.error("Failed to Cancel Parcel", {
        description: error.data?.message || "Unable to cancel parcel.",
      });
    }
  };

  const handleConfirmDelivery = async (parcelId: string) => {
    try {
      await updateParcelStatus({
        id: parcelId,
        status: "delivered",
        note: "Delivery confirmed by receiver",
      }).unwrap();
      toast.success("Delivery Confirmed Successfully!", {
        description: "The parcel has been marked as delivered.",
      });
    } catch (error: any) {
      toast.error("Failed to Confirm Delivery", {
        description: error.data?.message || "Unable to confirm delivery.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "outline",
      DISPATCHED: "secondary",
      IN_TRANSIT: "default",
      DELIVERED: "default",
      CANCELED: "destructive",
    } as const;

    const colors = {
      PENDING: "text-yellow-600",
      DISPATCHED: "text-blue-600",
      IN_TRANSIT: "text-purple-600",
      DELIVERED: "text-green-600",
      CANCELED: "text-white",
    } as const;

    return (
      <Badge
        variant={variants[status as keyof typeof variants]}
        className={colors[status as keyof typeof colors]}
      >
        {status.split("_").join(" ")}
      </Badge>
    );
  };

  const canCancelParcel = (parcel: IParcel) => {
    return (
      ["ADMIN", "SUPER_ADMIN", "SENDER"].includes(userRole) &&
      parcel.status === ParcelStatus.PENDING
    );
  };

  const canConfirmDelivery = (parcel: IParcel) => {
    return (
      [UserRole.RECEIVER, UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(
        userRole
      ) && parcel.status === ParcelStatus.IN_TRANSIT
    );
  };

  const totalPages = Math.ceil((data?.total || 0) / filters.limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="h-10 bg-muted rounded animate-pulse flex-1" />
          <div className="h-10 bg-muted rounded animate-pulse w-32" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tracking ID, receiver Phone..."
            value={inputValue}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.status || "all"}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="DISPATCHED">Dispatched</SelectItem>
            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Receiver</TableHead>
              {userRole === "ADMIN" && <TableHead>Sender</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Charge</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.parcels?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No parcels found.
                </TableCell>
              </TableRow>
            ) : (
              data?.parcels?.map((parcel) => (
                <TableRow key={parcel._id}>
                  <TableCell className="font-medium">
                    {parcel.trackingId}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {parcel.deliveryInfo.deliveryAddress.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {parcel.deliveryInfo.deliveryAddress.phone}
                      </div>
                    </div>
                  </TableCell>
                  {userRole === "ADMIN" && (
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {parcel.deliveryInfo.pickupAddress.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {parcel.deliveryInfo.pickupAddress.phone}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    {getStatusBadge(parcel.status)}
                    {userRole === UserRole.ADMIN && (
                      <ParcelStatusModal
                        id={parcel._id}
                        tracking={parcel.trackingId}
                        status={parcel.status}
                      >
                        <Button variant="ghost" size="icon">
                          <Pencil />
                        </Button>
                      </ParcelStatusModal>
                    )}
                  </TableCell>
                  <TableCell>{parcel.packageDetails.weight} kg</TableCell>
                  <TableCell>{parcel.paymentInfo.deleveryFee}৳</TableCell>
                  <TableCell>
                    {new Date(parcel.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedParcel(parcel)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      {canCancelParcel(parcel) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedParcel(parcel);
                            setShowCancelDialog(true);
                          }}
                          className="flex items-center gap-1 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                      {canConfirmDelivery(parcel) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConfirmDelivery(parcel._id)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Confirm
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(filters.page - 1) * filters.limit + 1} to{" "}
            {Math.min(filters.page * filters.limit, data?.total || 0)} of{" "}
            {data?.total || 0} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {filters.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Parcel Details Dialog */}
      {selectedParcel && !showCancelDialog && (
        <Dialog
          open={!!selectedParcel}
          onOpenChange={() => setSelectedParcel(null)}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Parcel Details
              </DialogTitle>
              <DialogDescription>
                Tracking ID: {selectedParcel.trackingId}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Sender Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedParcel.deliveryInfo.pickupAddress.name}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedParcel.deliveryInfo.pickupAddress.phone}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedParcel.deliveryInfo.deliveryAddress.address}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Receiver Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedParcel.deliveryInfo.deliveryAddress.name}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedParcel.deliveryInfo.deliveryAddress.phone}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedParcel.deliveryInfo.deliveryAddress.address}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    Status:
                  </span>
                  <div className="mt-1">
                    {getStatusBadge(selectedParcel.status)}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Weight:
                  </span>
                  <p className="font-semibold">
                    {selectedParcel.packageDetails.weight} kg
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Charge:
                  </span>
                  <p className="font-semibold">
                    {selectedParcel.paymentInfo.deleveryFee}৳
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Created:
                  </span>
                  <p className="font-semibold">
                    {new Date(selectedParcel.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
              {selectedParcel.statusLogs &&
                selectedParcel.statusLogs.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Status History</h4>
                    <div className="space-y-3">
                      {selectedParcel.statusLogs.map((log) => (
                        <div
                          key={log._id}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{log.status}</span>
                              <span className="text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            {log.note && (
                              <p className="text-muted-foreground mt-1">
                                {log.note}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              Updated by: {log.updatedBy.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && selectedParcel && (
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <form onSubmit={handleCancelParcel}>
              <DialogHeader>
                <DialogTitle>Cancel Parcel</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel parcel{" "}
                  {selectedParcel.trackingId}? This action cannot be undone.
                  <div className="space-y-2 my-4">
                    <Label htmlFor="cancel-reason">Cancel Reason</Label>
                    <Input
                      id="cancel-reason"
                      name="note"
                      required
                      title="cancel reason is required"
                      placeholder="Enter cancel reason"
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCancelDialog(false);
                    setSelectedParcel(null);
                  }}
                >
                  Keep Parcel
                </Button>
                <Button variant="destructive" type="submit">
                  Cancel Parcel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
