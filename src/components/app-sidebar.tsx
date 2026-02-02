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
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { DialogLayout } from "./layout/modalLayout";
import { useLogout } from "@/lib/services/logout.service";
import { useUserStore } from "@/store/userStore";
import { Permission } from "@/lib/enum/roles&permission.enum";
import { canAccessRoute } from "@/lib/canAccessRoute";
import { ROUTE_PERMISSIONS } from "@/lib/routePermission";
// import { rolePermissions } from "@/lib/rolePermissions";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Customer Management",
      url: "/customer-management",
      icon: Users,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: CreditCard,
    },
    {
      title: "Finance",
      url: "/finance",
      icon: Banknote,
    },
    {
      title: "Support Center",
      url: "/customer-support",
      icon: HelpCircle,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: Settings,
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);

  const userPermissions: Permission[] =
  user?.role?.permissions?.map(
    (p) => p.name as Permission
  ) ?? [];

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
      <SidebarHeader className="">
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
      <SidebarContent className="">
        {/* We create a SidebarGroup for each parent. */}
        <SidebarMenu className="h-screen">
          {/* {data.navMain
            // .filter((item) => allowedRoutes.includes(item.url)) // ✅ filter
            .map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem className="px-2" key={item.title}>
                  <SidebarMenuButton
                    className="py-5 px-5"
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })} */}
          {data.navMain
            .filter((item) =>
              canAccessRoute(
                userPermissions,
                ROUTE_PERMISSIONS[item.url as keyof typeof ROUTE_PERMISSIONS]
              )
            )
            .map((item) => {
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem className="px-2" key={item.title}>
                  <SidebarMenuButton
                    className="py-5 px-5"
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}

          <SidebarMenuItem className="px-2 mt-[240px]">
            <SidebarMenuButton
              className="py-5 px-5 cursor-pointer"
              asChild
              onClick={() => setOpen(true)}
            >
              <a className="flex items-center">
                <LogOutIcon />
                <span>Log out</span>
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
