// app/dashboard/page.tsx
"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import React from "react";

interface DashboardPageTypes{
    children: React.ReactNode
}

const AuthGuardDashboard = ({children}: DashboardPageTypes) => {
  const { isAuthenticated, isHydrated } = useAuthGuard();

  if (!isHydrated) {
    return <p>Loading...</p>; // wait until Zustand loads
  }

  if (!isAuthenticated) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className="">
      {children}
    </div>
  );
}

export default AuthGuardDashboard