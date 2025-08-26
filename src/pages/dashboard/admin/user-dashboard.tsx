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
  Shield,
  ShieldOff,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { UserRole, type IUser } from "@/types";
import {
  useGetUsersQuery,
  useToggleUserBlockMutation,
} from "@/redux/features/user/userApi";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

export default function UserManagementPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: "",
    search: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  const { data: usersData, isLoading } = useGetUsersQuery(
    new URLSearchParams(filters as any).toString()
  );
  const [toggleUserBlock] = useToggleUserBlockMutation();

  const debouncedQuery = useDebounce(inputValue, 500);

  useEffect(() => {
    setFilters({
      ...filters,
      search: debouncedQuery,
      page: 1,
    });
  }, [debouncedQuery]);

  const handleRoleFilter = (role: string) => {
    setFilters({
      ...filters,
      role: role === "all" ? "" : role,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  const handleToggleBlock = async () => {
    if (!selectedUser) return;

    try {
      await toggleUserBlock(selectedUser._id).unwrap();
      toast.success(
        selectedUser.isBlocked ? "User Unblocked" : "User Blocked",
        {
          description: `${selectedUser.name} has been ${
            selectedUser.isBlocked ? "unblocked" : "blocked"
          } successfully.`,
        }
      );
      setShowBlockDialog(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error("Action Failed", {
        description: error.data?.message || "Unable to update user status.",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      ADMIN: "default",
      SENDER: "secondary",
      RECEIVER: "outline",
    } as const;

    return (
      <Badge variant={variants[role as keyof typeof variants]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const totalPages = usersData?.meta.totalPages || 1;

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                User Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage system users and their permissions
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
              <CardDescription>
                View and manage all registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={filters.role || "all"}
                  onValueChange={handleRoleFilter}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SENDER">Sender</SelectItem>
                    <SelectItem value="RECEIVER">Receiver</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData?.users?.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          {user.isBlocked ? (
                            <Badge variant="destructive">Blocked</Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-500">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date().toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            {![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(
                              user.role
                            ) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowBlockDialog(true);
                                }}
                                className={`flex items-center gap-1 ${
                                  user.isBlocked
                                    ? "text-green-600 hover:text-green-600"
                                    : "text-red-600 hover:text-red-600"
                                }`}
                              >
                                {user.isBlocked ? (
                                  <>
                                    <Shield className="h-4 w-4" />
                                    Unblock
                                  </>
                                ) : (
                                  <>
                                    <ShieldOff className="h-4 w-4" />
                                    Block
                                  </>
                                )}
                              </Button>
                            )}
                            {user.role !== UserRole.SUPER_ADMIN && (
                              <Button>Edit</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                    {Math.min(
                      filters.page * filters.limit,
                      usersData?.meta.totalPages || 0
                    )}{" "}
                    of {usersData?.meta.total || 0} results
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
            </CardContent>
          </Card>

          {/* User Details Dialog */}
          {selectedUser && !showBlockDialog && (
            <Dialog
              open={!!selectedUser}
              onOpenChange={() => setSelectedUser(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>User Details</DialogTitle>
                  <DialogDescription>
                    Information about {selectedUser.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Name
                      </label>
                      <p className="font-semibold">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <p className="font-semibold">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Role
                      </label>
                      <div className="mt-1">
                        {getRoleBadge(selectedUser.role)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="mt-1">
                        {selectedUser.isBlocked ? (
                          <Badge variant="destructive">Blocked</Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-500">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Block/Unblock Confirmation Dialog */}
          {showBlockDialog && selectedUser && (
            <Dialog
              open={showBlockDialog}
              onOpenChange={(e) => {
                setShowBlockDialog(e);
                if (!e) setSelectedUser(null);
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedUser.isBlocked ? "Unblock" : "Block"} User
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to{" "}
                    {selectedUser.isBlocked ? "unblock" : "block"}{" "}
                    {selectedUser.name}?{" "}
                    {!selectedUser.isBlocked &&
                      "This will prevent them from accessing the system."}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBlockDialog(false);
                      setSelectedUser(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={selectedUser.isBlocked ? "default" : "destructive"}
                    onClick={handleToggleBlock}
                  >
                    {selectedUser.isBlocked ? "Unblock User" : "Block User"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
