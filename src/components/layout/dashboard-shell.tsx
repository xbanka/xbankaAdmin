"use client";

import type React from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { HeaderActions } from "../notifications-panel/header-actions";
import { usePermissions } from "@/hooks/usePermissions";
import { canAccessRoute } from "@/lib/canAccessRoute";
import { ROUTE_PERMISSIONS } from "@/lib/routePermission";
import { ROUTE_BREADCRUMBS } from "@/lib/breadcrumbs";
import { usePageHeaderStore } from "@/store/usePageHeaderStore";

/**
 * The dashboard's persistent frame: header (sidebar toggle, breadcrumbs,
 * notifications and profile) plus the route-permission guard. Mounted once
 * in the (dashboard) route layout, so it survives navigation; only the page
 * body below it swaps.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    permissions,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = usePermissions();

  const isRouteAllowed = canAccessRoute(
    permissions,
    ROUTE_PERMISSIONS[pathname] ?? [],
  );

  useEffect(() => {
    if (!isProfileLoading && !isProfileError && !isRouteAllowed) {
      router.replace("/");
    }
  }, [isProfileLoading, isProfileError, isRouteAllowed, router]);

  const isBodyLoading =
    isProfileLoading || (!isProfileError && !isRouteAllowed);

  return (
    <SidebarInset className="max-w-full flex-1 min-w-0">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-3 sm:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-1 h-4 sm:mr-2" />
        <HeaderBreadcrumb pathname={pathname} />
        <div className="ml-auto flex shrink-0 items-center">
          <HeaderActions />
        </div>
      </header>

      <div className="w-full min-w-0 min-h-screen bg-off-white">
        {isBodyLoading && <PageBodySkeleton />}

        {!isBodyLoading && isProfileError && (
          <div className="flex items-center justify-center py-24 text-red-500">
            Failed to load your permissions. Please try again.
          </div>
        )}

        {!isBodyLoading && !isProfileError && (
          <div
            key={pathname}
            className="block w-full max-w-full min-w-0 motion-safe:animate-page-in"
          >
            {children}
          </div>
        )}
      </div>
    </SidebarInset>
  );
}

function HeaderBreadcrumb({ pathname }: { pathname: string }) {
  const override = usePageHeaderStore((s) => s.override);

  if (override) {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={override.onBack}
          aria-label="Back"
          className="shrink-0 rounded-md p-1 text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
          {override.title}
        </h2>
      </div>
    );
  }

  const label = ROUTE_BREADCRUMBS[pathname];

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem className={label ? "hidden shrink-0 sm:inline-flex" : "shrink-0"}>
          {label ? (
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {label && (
          <>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate">{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Generic page placeholder while permissions resolve. */
function PageBodySkeleton() {
  return (
    <div className="space-y-4 p-4" aria-busy="true" aria-label="Loading page">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}
