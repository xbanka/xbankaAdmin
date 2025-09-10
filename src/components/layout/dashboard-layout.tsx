import type React from "react";
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
// import Error from "next/error"

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  title: string;
  isPending?: boolean;
  error?: string | null;
}

export function DashboardLayout({
  children,
  breadcrumbs = [],
  title,
  isPending,
  error,
}: DashboardLayoutProps) {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 bg-off-white min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-deep-blue">{title}</h1>
        </div>
        {/* Handle loading */}
        {isPending && (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Loading...
          </div>
        )}

        {/* Handle error */}
        {error && !isPending && (
          <div className="flex flex-1 items-center justify-center text-red-500">
            {error || "Something went wrong"}
          </div>
        )}

        {/* Render children only if no error and not loading */}
        {!isPending && !error && children}
      </div>
    </SidebarInset>
  );
}
