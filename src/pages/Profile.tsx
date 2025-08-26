import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import PersonalInfo from "@/components/profile/personal-info-form";
import type { IUser } from "@/types";
import Password from "@/components/profile/password-form";

function ProfilePageContent() {
  const { data: user } = useGetProfileQuery();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <PersonalInfo user={user as IUser} />

        {/* Password Update */}
        <Password user={user as IUser} />
      </div>

      {/* Account Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your account details and role information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                User ID
              </Label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {user?._id}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                Role
              </Label>
              <p className="text-sm capitalize bg-muted px-2 py-1 rounded">
                {user?.role}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                Account Status
              </Label>
              <p className="text-sm bg-muted px-2 py-1 rounded">
                {user?.isBlocked ? "Blocked" : "Active"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageContent />
    </AuthGuard>
  );
}
