"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NotificationsPanel } from "./notifications-panel";
import { useUserStore } from "@/store/userStore";
import { Skeleton } from "../ui/skeleton";
import { useProfile } from "@/lib/services/profile.service";
import { useNotificationStore } from "@/store/useNotificationStore";

export function HeaderActions() {
  const {toggle, isOpen} = useNotificationStore();
  const notificationsRef = useRef<HTMLDivElement>(null);

  const setAffiliate = useUserStore((s) => s.setUser);
  const user = useUserStore((state) => state.user);
  const { data, isLoading } = useProfile()

  useEffect(() => {
    if (data) {
      setAffiliate(data?.data); // access actual payload
    }
  }, [data]);

  return (
    <div className="flex absolute right-2 items-center gap-4">
      {/* Notifications Bell */}
      <div className="relative" ref={notificationsRef}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
        </Button>

        {/* Notifications Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 z-50">
            <NotificationsPanel onClose={toggle} />
          </div>
        )}
      </div>

      {/* User Profile Dropdown */}
      {isLoading || !data ? (
        <Skeleton className="h-6 w-24" />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 h-auto py-1"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Joseph" />
                <AvatarFallback>JE</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium leading-none">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 leading-none">
                  {data.data.role?.name}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Account</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      )}
    </div>
  );
}
