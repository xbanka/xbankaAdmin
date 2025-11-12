"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Notification {
  id: string
  type: "payout_request" | "approved" | "declined"
  affiliate: {
    name: string
    avatar?: string
  }
  amount: string
  bank: string
  method: string
  status: "pending" | "completed" | "declined"
  timestamp: string
  unread: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "payout_request",
    affiliate: { name: "@AliasRicer", avatar: "AR" },
    amount: "₦50,000",
    bank: "Bank Transfer",
    method: "GTBank",
    status: "pending",
    timestamp: "2h ago",
    unread: true,
  },
  {
    id: "2",
    type: "payout_request",
    affiliate: { name: "@dplajax", avatar: "DA" },
    amount: "₦50,000",
    bank: "Kuda",
    method: "GTBank",
    status: "pending",
    timestamp: "2h ago",
    unread: true,
  },
  {
    id: "3",
    type: "payout_request",
    affiliate: { name: "@TaylorGuest", avatar: "TG" },
    amount: "₦60,000",
    bank: "Kuda",
    method: "Bank Transfer",
    status: "pending",
    timestamp: "3h ago",
    unread: false,
  },
  {
    id: "4",
    type: "approved",
    affiliate: { name: "@jamesFrost", avatar: "JF" },
    amount: "₦75,000",
    bank: "UBA",
    method: "Bank Transfer",
    status: "completed",
    timestamp: "1d ago",
    unread: false,
  },
]

export function NotificationsPanel({
  onClose,
}: {
  onClose: () => void
}) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "archived">("all")

  const unreadCount = notifications.filter((n) => n.unread).length
  const allCount = notifications.length
  const archivedCount = 5 // Mock value

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return n.unread
    if (activeTab === "archived") return false // Mock
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-96 shadow-lg py-0 gap-0 rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-[18px] border-b border-[#E5E3E3]">
        <h2 className="font-[400] text-[18px] leading-[18px] text-[#111827]">Notifications</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "all" | "unread" | "archived")}
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
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No notifications</div>
          ) : (
            <div className="space-y-0">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="bg-[#F1FFFD] p-4 cursor-pointer">
                  <div className="flex gap-[8px]">
                    {/* Avatar */}
                    <Avatar className="w-10 h-10 bg-[#F0F0F0] flex-shrink-0">
                      <AvatarFallback className="bg-[#F0F0F0] text-abstractCyan">
                        {notification.affiliate.avatar || "NA"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex flex-col justify-start items-start min-w-0">
                      <p className="font-medium text-[16px] leading-[20px] text-[#111827] mb-[4px]">Affiliate Payout Request</p>

                      <p className="font-medium text-[14px] leading-[12px] text-[#4B5563] mb-[8px]">
                        {notification.affiliate.name} - Amount: {notification.amount}
                      </p>
                      <p className="font-medium text-[14px] leading-[12px] text-[#4B5563] mb-[12px]">
                        Method: {notification.method} ({notification.bank})
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
        </TabsContent>
      </Tabs>
    </Card>
  )
}