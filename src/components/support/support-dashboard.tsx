"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  MessageCircle,
  Ticket,
  Clock,
  TrendingUp,
} from "lucide-react";
import { SupportChat } from "./types";
import ChatSummaryCard from "./chat-summary-card";
import { FilterTabs } from "../ui/FilterTabs";
import { DashboardLayout } from "../layout/dashboard-layout";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";
import { getPriorityColor } from "@/lib/utils/statusStyles";

const mockChats: SupportChat[] = [
  {
    id: "C-0001",
    subject: "Bitcoin Payment Issue",
    customer: { name: "Jane Smith" },
    channel: "whatsapp",
    priority: "high",
    agent: { name: "Kelvin James" },
    status: "assigned",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastMessageAt: new Date(Date.now() - 1 * 60 * 1000),
    messageCount: 5,
    unreadCount: 0,
  },
  {
    id: "C-0002",
    subject: "Gift Card Redemption",
    customer: { name: "Jane Smith" },
    channel: "whatsapp",
    priority: "high",
    agent: { name: "Kelvin James" },
    status: "assigned",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastMessageAt: new Date(Date.now() - 2 * 60 * 1000),
    messageCount: 3,
    unreadCount: 1,
  },
  {
    id: "C-0003",
    subject: "Electricity Bill Payment",
    customer: { name: "Jane Smith" },
    channel: "whatsapp",
    priority: "medium",
    agent: { name: "Kelvin James" },
    status: "in-progress",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastMessageAt: new Date(Date.now() - 5 * 60 * 1000),
    messageCount: 8,
    unreadCount: 0,
  },
  {
    id: "C-0004",
    subject: "Account Verification",
    customer: { name: "Jane Smith" },
    channel: "whatsapp",
    priority: "low",
    agent: { name: "Kelvin James" },
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastMessageAt: new Date(Date.now() - 10 * 60 * 1000),
    messageCount: 12,
    unreadCount: 0,
  },
  {
    id: "C-0005",
    subject: "Bitcoin Payment Issue",
    customer: { name: "Jane Smith" },
    channel: "whatsapp",
    priority: "high",
    agent: { name: "Janet Bassey" },
    status: "resolved",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    messageCount: 20,
    unreadCount: 0,
  },
  {
    id: "C-0006",
    subject: "Gift Card Redemption",
    customer: { name: "Jane Smith" },
    channel: "whatsapp",
    priority: "medium",
    agent: { name: "Janet Bassey" },
    status: "resolved",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastMessageAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    messageCount: 15,
    unreadCount: 0,
  },
  {
    id: "C-0007",
    subject: "Electricity Bill Payment",
    customer: { name: "Jane Smith" },
    channel: "whatsapp",
    priority: "low",
    agent: { name: "Janet Bassey" },
    status: "resolved",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastMessageAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    messageCount: 10,
    unreadCount: 0,
  },
  {
    id: "C-0008",
    subject: "Account Verification",
    customer: { name: "Jane Smith" },
    channel: "whatsapp",
    priority: "low",
    agent: { name: "Janet Bassey" },
    status: "closed",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    lastMessageAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    messageCount: 8,
    unreadCount: 0,
  },
];

interface SupportDashboardProps {
  onSelectChat: (chat: SupportChat) => void;
}

export function SupportDashboard({ onSelectChat }: SupportDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("all");

  const filteredChats = useMemo(() => {
    return mockChats.filter((chat) => {
      const matchesSearch =
        chat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterTab === "all") return matchesSearch;
      if (filterTab === "assigned") return matchesSearch && chat.agent;
      if (filterTab === "unassigned") return matchesSearch && !chat.agent;
      if (filterTab === "pending")
        return matchesSearch && chat.status === "pending";
      if (filterTab === "closed")
        return matchesSearch && chat.status === "closed";

      return matchesSearch;
    });
  }, [searchTerm, filterTab]);

  const tableColumns = [
    {
      key: "id",
      header: "Chat ID",
      render: (chat: SupportChat) => (
        <span className="font-[500] text-[14px] leading-[18px] text-[#111827]">
          {chat.id}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (chat: SupportChat) => chat.subject,
    },
    {
      key: "customer",
      header: "Customer",
      render: (chat: SupportChat) => chat.customer.name,
    },
    {
      key: "channel",
      header: "Channel",
      render: (chat: SupportChat) => (
        <span className="text-center text-xl">
          {getChannelIcon(chat.channel)}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (chat: SupportChat) => (
        <Badge
          className={`capitalize px-3 py-2 rounded-[36px] text-xs font-medium ${getPriorityColor(
            chat.priority
          )}`}
        >
          {chat.priority.charAt(0).toUpperCase() + chat.priority.slice(1)}
        </Badge>
      ),
    },
    {
      key: "agent",
      header: "Agent",
      render: (chat: SupportChat) => chat.agent?.name || "Unassigned",
    },
    {
      key: "createdAt",
      header: "Date & Time",
      render: (chat: SupportChat) => (
        <span className="text-sm">
          {chat.createdAt.toLocaleDateString()}{" "}
          {chat.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (chat: SupportChat) => (
        <Button
          onClick={() => onSelectChat(chat)}
          size="sm"
          variant="ghost"
          className="text-abstractCyan hover:text-abstractCyan/70"
        >
          View
        </Button>
      ),
    },
  ];

  const stats = {
    totalChats: mockChats.length,
    totalTickets: 32,
    openChats: mockChats.filter(
      (c) => c.status !== "closed" && c.status !== "resolved"
    ).length,
    avgResponseRate: "92%",
  };

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, string> = {
      whatsapp: "💬",
      email: "📧",
      facebook: "f",
      instagram: "📷",
    };
    return icons[channel] || "📱";
  };

  return (
    <DashboardLayout
      isPending={false}
      // error={""}
      breadcrumbs={[{ label: "Support" }]}>
      <div className="bg-white border-b border-gray-200">
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Support Center
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <ChatSummaryCard
              header="Total Chats Today"
              icon={MessageCircle}
              footer="↑ 12% vs last week"
              totalChats={stats.totalChats}
            />

            <ChatSummaryCard
              header="Total Tickets Today"
              icon={Ticket}
              footer="↑ 10% vs last week"
              totalChats={stats.totalTickets}
            />

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Open Tickets by Priority
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-sm">
                      <span className="text-red-600">High</span>{" "}
                      <span className="font-bold text-gray-900">14</span>
                    </span>
                    <span className="text-sm">
                      <span className="text-yellow-600">Medium</span>{" "}
                      <span className="font-bold text-gray-900">14</span>
                    </span>
                  </div>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>

            <ChatSummaryCard
              header="Avg Response Rate"
              icon={TrendingUp}
              footer="↑ 12% vs last week"
              totalChats={stats.avgResponseRate}
            />
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap gap-2 mb-6 ">
            <FilterTabs
              filters={["all", "assigned", "unassigned"]}
              value={filterTab}
              onChange={setFilterTab}
            />
          </div>
          {/* {tab.charAt(0).toUpperCase() + tab.slice(1)} */}
        </div>
      </div>

      {/* Chats Table */}
      <div className="">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DataTableLayout
            data={filteredChats}
            columns={tableColumns}
            rowKey={(chat) => chat.id}
            emptyMessage="No support chats found."
            itemsPerPage={10}
            totalCount={filteredChats.length}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
