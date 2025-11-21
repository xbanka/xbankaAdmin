"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAsReadNotification,
} from "@/lib/actions/notificationsActions";
import LoaderSpinner from "../ui/loaderSpinner";

interface Notification {
  id: string;
  message: string;
  type: "system" | "payout_request" | "approved" | "declined";
  is_read: boolean;
  read_at: string | null;
  bank_name: string;
  amount: number;
  method: "string",
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  timestamp: string;
}

// const mockNotifications: Notification[] = [
//   {
//     id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
//     message: "Affiliate Payout Request",
//     type: "payout_request",
//     is_read: false,
//     read_at: null,
//     user: {
//       first_name: "Joseph",
//       last_name: "Eyebiokin",
//       email: "joseph@example.com",
//       account_name: "GTBank",
//     },
//     amount: "₦50,000",
//     timestamp: "2h ago",
//   },
//   {
//     id: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
//     message: "Affiliate Payout Request",
//     type: "payout_request",
//     is_read: false,
//     read_at: null,
//     user: {
//       first_name: "David",
//       last_name: "Okonkwo",
//       email: "david@example.com",
//       account_name: "Kuda",
//     },
//     amount: "₦50,000",
//     timestamp: "2h ago",
//   },
//   {
//     id: "3fa85f64-5717-4562-b3fc-2c963f66afa3",
//     message: "Affiliate Payout Request",
//     type: "payout_request",
//     is_read: true,
//     read_at: "2025-11-19T13:34:29.232Z",
//     user: {
//       first_name: "Taylor",
//       last_name: "Guest",
//       email: "taylor@example.com",
//       account_name: "UBA",
//     },
//     amount: "₦60,000",
//     timestamp: "3h ago",
//   },
//   {
//     id: "3fa85f64-5717-4562-b3fc-2c963f66afa4",
//     message: "Payout Approved",
//     type: "approved",
//     is_read: true,
//     read_at: "2025-11-19T12:00:00.000Z",
//     user: {
//       first_name: "James",
//       last_name: "Frost",
//       email: "james@example.com",
//       account_name: "Access Bank",
//     },
//     amount: "₦75,000",
//     timestamp: "1d ago",
//   },
// ];

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "archived">(
    "all"
  );
  const queryClient = useQueryClient();

  const { data, error, isPending } = useQuery({
    queryKey: ["allNotification"],
    queryFn: () => getNotifications(),
  });

  const allCount = data?.data?.length;
  const archivedCount = 0;

  const markReadMutation = useMutation({
    mutationFn: markAsReadNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allNotification"] });
    },
  });

  const notifications = data?.data || [];
  const unreadCount = notifications.filter(
    (n: Notification) => !n.is_read
  ).length;
  const filteredNotifications = data?.data?.filter((n: Notification) => {
    if (activeTab === "unread") return !n.is_read;
    if (activeTab === "archived") return false;
    return true;
  });

  return (
    <Card className="w-96 shadow-lg py-0 gap-0 rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-[18px] border-b border-[#E5E3E3]">
        <h2 className="font-[400] text-[18px] leading-[18px] text-[#111827]">
          Notifications
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "all" | "unread" | "archived")
        }
        className="w-full"
      >
        <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-[#E5E3E3] px-4 py-[12px]">
          <TabsTrigger
            value="all"
            className="data-[state=active]:border-b-[1px] font-[500] text-[12px] leading-[16px] data-[state=active]:border-abstractCyan py-[8px] data-[state=active]:text-abstractCyan px-[12px] w-auto rounded-[36px]"
          >
            All ({allCount})
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:border-b-[1px] font-[500] text-[12px] leading-[16px] data-[state=active]:border-abstractCyan py-[8px] data-[state=active]:text-abstractCyan px-[12px] w-auto rounded-[36px]"
          >
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="data-[state=active]:border-b-[1px] font-[500] text-[12px] leading-[16px] data-[state=active]:border-abstractCyan py-[8px] data-[state=active]:text-abstractCyan px-[12px] w-auto rounded-[36px]"
          >
            Archived ({archivedCount})
          </TabsTrigger>
        </TabsList>
        {/* Content */}
        <TabsContent value={activeTab} className="max-h-96 overflow-y-auto">
          {isPending && (
            <div className="flex items-center justify-center inset-0 bg-white/70">
              <LoaderSpinner />
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center ">
              <p className="text-red-500">{error?.message}</p>
            </div>
          )}
          {!isPending && !error && (
            <>
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredNotifications.map((notification: Notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        notification.is_read ? "bg-[#fafafa]" : "bg-[#F1FFFD]"
                      }`}
                      onClick={() =>
                        markReadMutation.mutate({ id: notification.id })
                      }
                    >
                      <div className="flex gap-[8px]">
                        {/* Avatar */}
                        <Avatar className="w-10 h-10 bg-[#F0F0F0] flex-shrink-0">
                          <AvatarFallback className="bg-[#F0F0F0] text-abstractCyan">
                            {notification.user.first_name.charAt(0)}
                            {notification.user.last_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="flex flex-col justify-start items-start min-w-0">
                          <p className="font-medium text-[16px] leading-[20px] text-[#111827] mb-[4px]">
                            {notification.message}
                          </p>

                          <p className="font-medium text-[14px] leading-[12px] text-[#4B5563] mb-[8px]">
                            {notification.user.first_name}{" "}
                            {notification.user.last_name} - Amount:{" "}
                            N {notification.amount}
                          </p>
                          <p className="font-medium text-[14px] leading-[12px] text-[#4B5563] mb-[12px]">
                            Bank Account: {notification.bank_name}
                          </p>

                          {/* Action Button */}
                          <Button
                            variant="default"
                            size="sm"
                            className="mt-3 bg-teal-600 hover:bg-teal-700 text-white text-xs h-7"
                          >
                            View Request
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
