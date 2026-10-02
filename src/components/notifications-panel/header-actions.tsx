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
          {hasUnreadNotifications && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
          )}
        </Button>

        {/* Notifications Dropdown — the panel anchors itself to this
            relatively-positioned wrapper. */}
        {isOpen && <NotificationsPanel onClose={toggle} />}
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
                <AvatarImage
                  src={user?.avatar_signed_url ?? undefined}
                  alt={[user?.first_name, user?.last_name]
                    .filter(Boolean)
                    .join(" ")}
                />
                <AvatarFallback>{initials}</AvatarFallback>
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
