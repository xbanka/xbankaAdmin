// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { usePermissions } from "@/hooks/usePermissions";
import { canAccessRoute } from "@/lib/canAccessRoute";
import { ROUTE_PERMISSIONS } from "@/lib/routePermission";
import React from "react";
import LoaderSpinner from "../ui/loaderSpinner";

interface DashboardPageTypes {
  children: React.ReactNode;
}

const AuthGuardDashboard = ({ children }: DashboardPageTypes) => {
  const { isAuthenticated, hasHydrated } = useAuthGuard();
  const router = useRouter();
  const pathname = usePathname();

  const {
    permissions: userPermissions,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = usePermissions();

  const isRouteAllowed = canAccessRoute(
    userPermissions,
    ROUTE_PERMISSIONS[pathname] ?? [],
  );

  useEffect(() => {
    if (!isProfileLoading && !isProfileError && !isRouteAllowed) {
      router.replace("/");
    }
  }, [isProfileLoading, isProfileError, isRouteAllowed, router]);

  const isLoading =
    !hasHydrated || !isAuthenticated || isProfileLoading || isProfileError;

  if (isLoading || !isRouteAllowed) {
    return (
      <div className="flex items-center justify-center left-0 right-0 absolute top-1/2 -translate-y-1/2">
        <LoaderSpinner />
      </div>
    );
  }

  return <div className="">{children}</div>;
};

export default AuthGuardDashboard;
