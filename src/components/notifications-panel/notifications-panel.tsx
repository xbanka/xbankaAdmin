"use client";

import { useState } from "react";
import {
  X,
  ArrowDownToLine,
  CheckCircle2,
  XCircle,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAsReadNotification,
} from "@/lib/actions/notificationsActions";
import LoaderSpinner from "../ui/loaderSpinner";
import { usePayoutSidebarStore } from "@/store/usePayoutSidebarStore";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  message: string;
  type: string;
  is_read: boolean;
  read_at: string;
  amount: number;
  method: string;
  affiliate: {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6";
    first_name: "string";
    last_name: "string";
    email: "string";
    username: "string";
    phone_no: "string";
    bank: "string";
    account_no: "string";
    ref_code: "string";
    custom_refcode: "string";
  };
}

/** Derives a visual category from the notification message/type. */
function getCategory(n: Notification) {
  const text = `${n.type ?? ""} ${n.message ?? ""}`.toLowerCase();
  if (text.includes("reject") || text.includes("fail") || text.includes("decline"))
    return "error" as const;
  if (text.includes("process") || text.includes("success") || text.includes("paid"))
    return "success" as const;
  return "request" as const;
}

const CATEGORY_STYLES = {
  request: {
    Icon: ArrowDownToLine,
    iconWrap: "bg-[#E6FBF7] text-[#0D9488]",
    accent: "before:bg-[#0D9488]",
  },
  success: {
    Icon: CheckCircle2,
    iconWrap: "bg-[#D1FAE5] text-[#037508]",
    accent: "before:bg-[#037508]",
  },
  error: {
    Icon: XCircle,
    iconWrap: "bg-[#FCE6E6] text-[#EF4444]",
    accent: "before:bg-[#EF4444]",
  },
};

const formatMethod = (m?: string) =>
  (m ?? "")
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const formatAmount = (a?: number) =>
  a == null ? "—" : `₦${Number(a).toLocaleString()}`;

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "archived">(
    "all",
  );
  useBodyScrollLock(true);
  const queryClient = useQueryClient();

  const { data, error, isPending } = useQuery({
    queryKey: ["allNotification"],
    queryFn: () => getNotifications(),
  });
  const { openDetailsSidebar } = usePayoutSidebarStore();

  const notifications: Notification[] = data?.data || [];
  const allCount = notifications.length;
  const archivedCount = 0;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markReadMutation = useMutation({
    mutationFn: markAsReadNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allNotification"] });
    },
  });

  const handleViewRequest = (id: string) => {
    markReadMutation.mutate({ id });
    openDetailsSidebar(id);
  };

  const handleMarkAllRead = () => {
    notifications
      .filter((n) => !n.is_read)
      .forEach((n) => markReadMutation.mutate({ id: n.id }));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.is_read;
    if (activeTab === "archived") return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="absolute top-0 right-0 h-screen w-full sm:w-[440px] bg-white border-l border-[#E5E3E3] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E3E3] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[18px] font-semibold text-[#111827]">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#E6FBF7] text-abstractCyan text-[11px] font-semibold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[12px] font-medium text-abstractCyan hover:underline mr-1"
              >
                Mark all read
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "all" | "unread" | "archived")
          }
          className="flex flex-col flex-1 min-h-0 w-full gap-0"
        >
          <TabsList className="w-full justify-start gap-1 rounded-none bg-transparent border-b border-[#E5E3E3] px-4 py-0 h-auto flex-shrink-0">
            {(
              [
                ["all", `All (${allCount})`],
                ["unread", `Unread (${unreadCount})`],
                ["archived", `Archived (${archivedCount})`],
              ] as const
            ).map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:border-b-2 data-[state=active]:border-abstractCyan data-[state=active]:text-abstractCyan rounded-none border-b-2 border-transparent font-medium text-[13px] py-3 px-3 -mb-px text-text-secondary shadow-none data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Scrollable content */}
          <TabsContent
            value={activeTab}
            className="flex-1 overflow-y-auto min-h-0 m-0 focus-visible:outline-none"
          >
            {isPending && (
              <div className="flex items-center justify-center py-16">
                <LoaderSpinner />
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-16 px-6 text-center">
                <p className="text-red-500 text-sm">{error?.message}</p>
              </div>
            )}

            {!isPending && !error && filteredNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-3 text-gray-400">
                <Bell className="w-10 h-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  No notifications
                </p>
                <p className="text-xs text-gray-400">
                  You&apos;re all caught up.
                </p>
              </div>
            )}

            {!isPending && !error && filteredNotifications.length > 0 && (
              <ul className="divide-y divide-[#F0F0F0]">
                {filteredNotifications.map((notification) => {
                  const category = getCategory(notification);
                  const { Icon, iconWrap, accent } = CATEGORY_STYLES[category];
                  const unread = !notification.is_read;

                  return (
                    <li
                      key={notification.id}
                      onClick={() => handleViewRequest(notification.id)}
                      className={cn(
                        "relative cursor-pointer px-5 py-4 transition-colors hover:bg-[#F9FAFB]",
                        "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:content-['']",
                        unread ? accent : "before:bg-transparent",
                        unread ? "bg-[#F6FFFD]" : "bg-white",
                      )}
                    >
                      <div className="flex gap-3">
                        {/* Type icon over avatar */}
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-[#F0F0F0] text-abstractCyan text-[12px] font-semibold">
                              {notification.affiliate.first_name?.charAt(0)}
                              {notification.affiliate.last_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={cn(
                              "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-white",
                              iconWrap,
                            )}
                          >
                            <Icon className="h-3 w-3" />
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-[14px] leading-[18px] text-[#111827]">
                              {notification.message}
                            </p>
                            {unread && (
                              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-abstractCyan" />
                            )}
                          </div>

                          <p className="mt-1 text-[13px] leading-[18px] text-[#4B5563]">
                            <span className="text-[#6B7280]">Affiliate:</span>{" "}
                            {notification.affiliate.username}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] leading-[18px] text-[#4B5563]">
                            <span>
                              <span className="text-[#6B7280]">Amount:</span>{" "}
                              <span className="font-medium text-[#111827]">
                                {formatAmount(notification.amount)}
                              </span>
                            </span>
                            <span className="text-gray-300">•</span>
                            <span>
                              {formatMethod(notification.method)}
                              {notification.affiliate.bank
                                ? ` (${notification.affiliate.bank})`
                                : ""}
                            </span>
                          </div>

                          <Button
                            size="sm"
                            className="mt-3 w-fit h-8 px-4 bg-abstractCyan hover:bg-teal-700 text-white text-[12px] font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewRequest(notification.id);
                            }}
                          >
                            View Request
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  );
}
