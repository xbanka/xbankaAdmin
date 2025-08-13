"use client"
import type * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Home,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  AlertTriangle,
  FileText,
  CheckSquare,
  BarChart3,
  Package,
} from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"

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
      title: "Support Center",
      url: "/dashboard/support",
      icon: HelpCircle,
    },
    {
      title: "Refunds & Disputes",
      url: "/dashboard/refunds",
      icon: AlertTriangle,
    },
    {
      title: "Content Pipeline",
      url: "/dashboard/content",
      icon: FileText,
    },
    // {
    //   title: "Knowledge Base",
    //   url: "/knowledge",
    //   icon: BookOpen,
    // },
    {
      title: "Tasks & Workflow",
      url: "/dashboard/tasks",
      icon: CheckSquare,
    },
    {
      title: "Audit & Performance",
      url: "/dashboard/audit",
      icon: BarChart3,
    },
    {
      title: "Inventory & Assets",
      url: "/dashboard/inventory",
      icon: Package,
    },
    {
      title: "Admin Panel",
      url: "/dashboard/admin",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
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
          {data.navMain.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem className="px-2" key={item.title}>
                <SidebarMenuButton className="py-5 px-5" asChild isActive={isActive} tooltip={item.title}>
                  <Link href={item.url}>
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}