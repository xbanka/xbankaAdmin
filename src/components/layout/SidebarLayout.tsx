import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import React from "react";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* min-w-0 lets wide content (tables) overflow inside the content
          area instead of stretching it past the viewport. Not a <main>:
          SidebarInset already renders one. */}
      <div className="flex-1 min-w-0">{children}</div>
    </SidebarProvider>
  );
}
