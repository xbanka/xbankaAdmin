"use client";

import { useState } from "react";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAsReadNotification,
} from "@/lib/actions/notificationsActions";
import LoaderSpinner from "../ui/loaderSpinner";
import { usePayoutSidebarStore } from "@/store/usePayoutSidebarStore";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { cn } from "@/lib/utils";
import { useNotificationDrawerStore } from "@/store/useNotificationDrawerStore";
import { Affiliate, PayoutNotification } from "./notifications";

const formatMethod = (m?: string) =>
  (m ?? "")
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const formatAmount = (a?: number) =>
  a == null ? "—" : `₦${Number(a).toLocaleString()}`;

const getAffiliateName = (affiliate?: Affiliate | null) => {
  if (!affiliate) return "System";

  if (affiliate.username) {
    return affiliate.username.startsWith("@")
      ? affiliate.username
      : `@${affiliate.username}`;
  }

  return `${affiliate.first_name} ${affiliate.last_name}`;
};

function timeAgo(iso?: string) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

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

  const notifications: PayoutNotification[] = data?.data || [];
  console.log("notifications", notifications);
  const { open } = useNotificationDrawerStore();

  const allCount = notifications.length;
  const archivedCount = 0;
  const unreadCount = notifications.filter(
    (n: PayoutNotification) => !n.is_read,
  ).length;

  const markReadMutation = useMutation({
    mutationFn: markAsReadNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allNotification"] });
    },
  });

  const handleViewRequest = (notification: PayoutNotification) => {
    const referenceId = notification.reference_id;

    if (!referenceId) {
      console.error("Notification has no reference_id", notification);
      return;
    }

    console.log("Opening payout:", referenceId);

    markReadMutation.mutate({
      id: notification.id,
    });

    openDetailsSidebar(referenceId);
  };

  const filteredNotifications = notifications.filter((n: any) => {
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
      <aside className="absolute top-0 right-0 flex h-screen w-full flex-col border-l border-[#E5E3E3] bg-white shadow-2xl sm:w-[440px] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E5E3E3] px-5 py-4">
          <h2 className="text-[20px] font-bold text-[#111827]">
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "all" | "unread" | "archived")
          }
          className="flex w-full flex-1 flex-col gap-0 min-h-0"
        >
          <TabsList className="h-auto w-full flex-shrink-0 justify-start gap-2 rounded-none border-b border-[#E5E3E3] bg-transparent px-4 py-3">
            {(
              [
                ["all", `All (${allCount})`],
                ["unread", `Unread (${unreadCount})`],
                ["archived", `Archive (${archivedCount})`],
              ] as const
            ).map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[13px] font-medium shadow-none transition-colors",
                  "border-transparent bg-transparent text-[#6B7280]",
                  "data-[state=active]:border-abstractCyan data-[state=active]:bg-[#E6FBF7] data-[state=active]:text-abstractCyan data-[state=active]:shadow-none",
                )}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Scrollable content */}
          <TabsContent
            value={activeTab}
            className="m-0 min-h-0 flex-1 overflow-y-auto focus-visible:outline-none"
          >
            {isPending && (
              <div className="flex items-center justify-center py-16">
                <LoaderSpinner />
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center px-6 py-16 text-center">
                <p className="text-sm text-red-500">{error?.message}</p>
              </div>
            )}

            {!isPending && !error && filteredNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center text-gray-400">
                <Bell className="h-10 w-10 text-gray-300" />
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
                {filteredNotifications.map((notification: PayoutNotification) => {
                  const unread = !notification.is_read;
                  return (
                    <li
                      key={notification.id}
                      onClick={() => handleViewRequest(notification)}
                      className={cn(
                        "relative cursor-pointer px-5 py-4 transition-colors hover:bg-[#F9FAFB]",
                        "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:content-['']",
                        unread
                          ? "bg-[#F1FFFD] before:bg-abstractCyan"
                          : "bg-white before:bg-transparent",
                      )}
                    >
                      <div className="flex gap-3">
                        {/* Naira icon */}
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F0F0] text-[16px] font-bold text-abstractCyan">
                          ₦
                        </span>

                        {/* Content */}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="text-[15px] font-semibold text-[#111827]">
                            {notification?.message}
                          </p>

                          <p className="mt-1 text-[13px] leading-[18px] text-[#4B5563]">
                            <span className="text-[#6B7280]">Affiliate:</span>{" "}
                            {getAffiliateName(notification.affiliate)}
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-[#6B7280]">Amount:</span>{" "}
                            <span className="font-medium text-[#111827]">
                              {formatAmount(notification?.amount)}
                            </span>
                          </p>
                          <p className="mt-0.5 text-[13px] leading-[18px] text-[#4B5563]">
                            <span className="text-[#6B7280]">Method:</span>{" "}
                            {formatMethod(notification?.method)}
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <Button
                              size="sm"
                              className="h-9 w-fit rounded-lg bg-[#17E1C5] px-4 text-[13px] font-semibold text-[#06251F] hover:bg-[#13C9B0]"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewRequest(notification);
                              }}
                            >
                              View Request
                            </Button>
                            <span className="text-[12px] text-[#9CA3AF]">
                              {timeAgo(
                                notification?.affiliate?.created_at ??
                                  notification?.read_at,
                              )}
                            </span>
                          </div>
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
