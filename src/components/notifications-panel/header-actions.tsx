"use client";

import { useRef } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NotificationsPanel } from "./notifications-panel";
import { Skeleton } from "../ui/skeleton";
import { useProfile } from "@/lib/services/profile.service";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useGetNotifications } from "@/lib/services/notification.service";

export function HeaderActions() {
  const { toggle, isOpen } = useNotificationStore();
  const notificationsRef = useRef<HTMLDivElement>(null);

  // The list endpoint returns no counts, so the badge rides on its own
  // unread-only query rather than counting a list the panel now filters.
  const { data: unreadData } = useGetNotifications({ is_read: false });

  const hasUnreadNotifications = (unreadData?.data ?? []).length > 0;

  const { data, isLoading } = useProfile();
  const user = data?.data;

  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="flex items-center gap-1 sm:gap-3">
      {/* Notifications Bell */}
      <div className="relative" ref={notificationsRef}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="relative"
        >
          <Bell className="w-5 h-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
          )}
        </Button>

        {/* Notifications Dropdown — the panel anchors itself to this
            relatively-positioned wrapper. */}
        <NotificationsPanel isOpen={isOpen} onClose={toggle} />
      </div>

      {/* User Profile Dropdown */}
      {isLoading || !data ? (
        <Skeleton className="h-8 w-8 rounded-full sm:w-32 sm:rounded-md" />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto items-center gap-2 px-1.5 py-1 sm:px-2"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={user?.avatar_signed_url ?? undefined}
                  alt={[user?.first_name, user?.last_name]
                    .filter(Boolean)
                    .join(" ")}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              {/* Name + role only where there's room; avatar alone on phones. */}
              <div className="hidden max-w-[160px] text-left sm:block">
                <p className="truncate text-sm font-medium leading-tight">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="truncate text-xs leading-tight text-gray-500">
                  {data.data.role?.name}
                </p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-gray-500 sm:block" />
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
