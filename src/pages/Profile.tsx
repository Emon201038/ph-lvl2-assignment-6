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
import type { IUser } from "@/types";
import Password from "@/components/profile/password-form";
import { useState } from "react";
import PersonalInfoForm from "@/components/profile/personal-info-form";
import PersonalInfo from "@/components/profile/personal-info";
import { Edit, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import SetPasswordForm from "@/components/profile/set-password-form";
import AuthProviders from "@/components/profile/auth-providers";
import ChangeRole from "@/components/profile/change-role";

function ProfilePageContent() {
  document.title = "Profile | ParcelPro";
  const { data: user, isLoading } = useGetProfileQuery();
  const [isEditMode, setIsEditMode] = useState(false);

  if (isLoading) return <div>Loading ...</div>;
  if (!isLoading && !user) return null;

  const hasCredentialsProvider = user?.auths?.find(
    (auth) => auth.provider === "CREDENTIALS"
  );
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditMode(!isEditMode);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditMode ? "Cancel" : "Edit"}
              </Button>
            </div>
            <CardDescription>
              {isEditMode
                ? "Update your personal information and contact details"
                : "Your personal information and contact details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <PersonalInfoForm user={user as IUser} />
            ) : (
              <PersonalInfo user={user as IUser} />
            )}
          </CardContent>
        </Card>

        {/* Password Update */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {hasCredentialsProvider ? "Change Password" : "Set Password"}
            </CardTitle>
            <CardDescription>
              {hasCredentialsProvider
                ? "Update your password to keep your account secure"
                : "Set a password to enable email and password login"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasCredentialsProvider ? (
              <Password user={user as IUser} />
            ) : (
              <SetPasswordForm />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Providers information */}
      <AuthProviders user={user as IUser} />

      {user!.parcels?.length === 0 && <ChangeRole />}

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
