import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Facebook, Github, Lock, Plus, Shield } from "lucide-react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AuthProvider, type IUser } from "@/types";

interface Props {
  user: IUser;
}

const AuthProviders: React.FC<Props> = ({ user }) => {
  const hasCredentialsProvider =
    user?.auths?.some((p) => p.provider === AuthProvider.CREDENTIALS) || false;

  const getProviderIcon = (provider: AuthProvider) => {
    switch (provider) {
      case AuthProvider.GOOGLE:
        return <img src="/icons/google.svg" className="h-4 w-4" />;
      case AuthProvider.GITHUB:
        return <Github className="h-4 w-4" />;
      case AuthProvider.FACEBOOK:
        return <Facebook className="h-4 w-4" />;
      case AuthProvider.CREDENTIALS:
        return <Lock className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getProviderName = (provider: AuthProvider) => {
    switch (provider) {
      case AuthProvider.GOOGLE:
        return "Google";
      case AuthProvider.GITHUB:
        return "GitHub";
      case AuthProvider.FACEBOOK:
        return "Facebook";
      case AuthProvider.CREDENTIALS:
        return "Email & Password";
      default:
        return provider;
    }
  };
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Connected Accounts
        </CardTitle>
        <CardDescription>
          Manage your connected authentication providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Connected Providers</Label>
            <div className="flex flex-wrap gap-2">
              {user?.auths?.map((provider, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  {getProviderIcon(provider.provider as AuthProvider)}
                  {getProviderName(provider.provider as AuthProvider)}
                </Badge>
              ))}
              {(!user?.auths || user.auths.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No connected providers
                </p>
              )}
            </div>
          </div>

          {!hasCredentialsProvider && (
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                disabled
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Email & Password (Available after setting password)
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthProviders;
