"use client";
import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  CreditCard,
  Banknote,
  LogOutIcon,
  Settings,
  HelpCircle,
  PercentSquare,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { DialogLayout } from "./layout/modalLayout";
import { useLogout } from "@/lib/services/logout.service";
import { usePermissions } from "@/hooks/usePermissions";
import { canAccessRoute } from "@/lib/canAccessRoute";
import { ROUTE_PERMISSIONS } from "@/lib/routePermission";
import { Skeleton } from "./ui/skeleton";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Customer Mgt",
      url: "/customer-management",
      icon: Users,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: CreditCard,
    },
    {
      title: "Finance Mgt",
      url: "/finance",
      icon: Banknote,
    },
    {
      title: "Rate Management",
      url: "/rate-management",
      icon: PercentSquare,
    },
    {
      title: "Audit Log",
      url: "/audit-log",
      icon: PercentSquare,
    },
    // {
    //   title: "Support Center",
    //   url: "/customer-support",
    //   icon: HelpCircle,
    // },
    {
      title: "Staff",
      url: "/staff",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { permissions: userPermissions, isLoading: isPermissionsLoading } =
    usePermissions();

  const { mutate, isPending } = useLogout();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-[#FFFFFF]">
        <div className="flex items-center justify-center">
          <Image
            className="group-data-[collapsible=icon]:hidden"
            src="/xBankaLogo.svg"
            alt="xbanka"
            width={80}
            height={80}
          />
          <Image
            className="hidden group-data-[collapsible=icon]:block"
            src="/xBankaLogo.svg"
            alt="xbanka"
            width={32}
            height={32}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#FFFFFF]">
        {/* We create a SidebarGroup for each parent. */}
        <SidebarMenu className="h-screen">
          {isPermissionsLoading
            ? data.navMain.map((item) => (
                <SidebarMenuItem className="pr-2 px-5 py-2.5" key={item.title}>
                  <Skeleton className="h-5 w-full rounded-full" />
                </SidebarMenuItem>
              ))
            : data.navMain
                .filter((item) =>
                  canAccessRoute(
                    userPermissions,
                    ROUTE_PERMISSIONS[item.url] ?? [],
                  ),
                )
                .map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem className="pr-2" key={item.title}>
                      <SidebarMenuButton
                        className="py-5 px-5 rounded-tl-none rounded-bl-none rounded-tr-[36px] rounded-br-[36px] cursor-pointer"
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          {item.icon && (
                            <item.icon
                              className={`w-4 h-4 ${isActive ? "text-[#FFFFFF]" : "text-[#4B5563]"}`}
                            />
                          )}
                          <span
                            className={`${isActive ? "text-[#FFFFFF]" : "text-[#4B5563]"}`}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

          <SidebarMenuItem className="px-2 mt-[70px]">
            <SidebarMenuButton
              className="py-5 px-5 rounded-tl-none rounded-bl-none rounded-tr-[36px] rounded-br-[36px] cursor-pointer"
              asChild
              onClick={() => setOpen(true)}
            >
              <a className="flex items-center">
                <LogOutIcon className="text-[#4B5563]" />
                <span className="text-[#4B5563]">Log out</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <DialogLayout
          open={open}
          onClose={() => setOpen(false)}
          title="Logout"
          footer={
            <>
              {/* Cancel just closes the dialog */}
              <DialogLayout.Close asChild>
                <Button
                  onClick={() => setOpen(false)}
                  className="flex-1"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogLayout.Close>

              {/* Logout button calls handler */}
              <Button
                className="flex-1"
                disabled={isPending}
                variant="destructive"
                onClick={handleLogout}
              >
                {isPending ? "Logging out..." : "Logout"}
              </Button>
            </>
          }
        >
          <p>Are you sure you want to logout</p>
        </DialogLayout>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
