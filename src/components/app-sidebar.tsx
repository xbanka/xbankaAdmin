"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Home, Users, CreditCard, Settings } from "lucide-react"
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Customer Management",
      url: "/dashboard/customerManagement",
      icon: Users,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: CreditCard,
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader className="">
        <Image
          className="mx-auto"
          src="/xBankaLogo.svg"
          alt="xbanka"
          width={80}
          height={80}
        />
      </SidebarHeader>
      <SidebarContent className="">
        {/* We create a SidebarGroup for each parent. */}
        <SidebarMenu className="h-screen">
          {data.navMain.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem className="px-2" key={item.title}>
                <SidebarMenuButton
                  className="py-5 px-5"
                  asChild
                  isActive={isActive}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
