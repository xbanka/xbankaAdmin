// Authentication gate only — permission/route-access gating lives in
// DashboardLayout so it can scope its loading/error state to the page body
// instead of hiding the header (breadcrumbs + HeaderActions) too.
"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import React from "react";
import LoaderSpinner from "../ui/loaderSpinner";

interface DashboardPageTypes {
  children: React.ReactNode;
}

const AuthGuardDashboard = ({ children }: DashboardPageTypes) => {
  const { isAuthenticated, hasHydrated } = useAuthGuard();

  // We don't yet know whether the user is signed in — nothing to show but a
  // full-screen spinner until hydration/auth resolves (or the redirect fires).
  if (!hasHydrated || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center left-0 right-0 absolute top-1/2 -translate-y-1/2">
        <LoaderSpinner />
      </div>
    );
  }

  return <div className="">{children}</div>;
};

export default AuthGuardDashboard;
