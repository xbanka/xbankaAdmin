// app/dashboard/page.tsx
"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import React from "react";
import LoaderSpinner from "../ui/loaderSpinner";

interface DashboardPageTypes {
  children: React.ReactNode;
}

const AuthGuardDashboard = ({ children }: DashboardPageTypes) => {
  const { isAuthenticated, hasHydrated } = useAuthGuard();

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center left-0 right-0 absolute top-1/2 -translate-y-1/2">
        <LoaderSpinner />
      </div>
    ); // wait until Zustand loads
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center left-0 right-0 absolute top-1/2 -translate-y-1/2">
        <LoaderSpinner />
      </div>
    );
  }

  return <div className="">{children}</div>;
};

export default AuthGuardDashboard;