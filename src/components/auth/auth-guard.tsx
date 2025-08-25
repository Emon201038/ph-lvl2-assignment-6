import type React from "react";

import { useEffect } from "react";
import type { IUser } from "@/types";
import { useSession } from "@/providers/auth-provider";
import { useNavigate } from "react-router";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: IUser["role"][];
  requireAuth?: boolean;
}

export function AuthGuard({
  children,
  allowedRoles,
  requireAuth = true,
}: AuthGuardProps) {
  const session = useSession();
  const isAuthenticated = session?.data?._id ? true : false;
  const user: IUser | undefined = session?.data;
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !isAuthenticated && !session?.isLoading) {
      navigate("/login");
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      navigate("/unauthorized");
      return;
    }
  }, [isAuthenticated, user, allowedRoles, requireAuth, navigate, session]);

  if (requireAuth && !isAuthenticated) {
    return <div>Loading...</div>;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <div>Unauthorized</div>;
  }

  return <>{children}</>;
}
