"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MessageCircle, Ticket, Clock, TrendingUp } from "lucide-react"
import { SupportChat } from "./types"

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
]

interface SupportDashboardProps {
  onSelectChat: (chat: SupportChat) => void
}

export function SupportDashboard({ onSelectChat }: SupportDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTab, setFilterTab] = useState<"all" | "assigned" | "unassigned" | "pending" | "closed">("all")

  const filteredChats = useMemo(() => {
    return mockChats.filter((chat) => {
      const matchesSearch =
        chat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.customer.name.toLowerCase().includes(searchTerm.toLowerCase())

      if (filterTab === "all") return matchesSearch
      if (filterTab === "assigned") return matchesSearch && chat.agent
      if (filterTab === "unassigned") return matchesSearch && !chat.agent
      if (filterTab === "pending") return matchesSearch && chat.status === "pending"
      if (filterTab === "closed") return matchesSearch && chat.status === "closed"

      return matchesSearch
    })
  }, [searchTerm, filterTab])

  const stats = {
    totalChats: mockChats.length,
    totalTickets: 32,
    openChats: mockChats.filter((c) => c.status !== "closed" && c.status !== "resolved").length,
    avgResponseRate: "92%",
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, string> = {
      whatsapp: "💬",
      email: "📧",
      facebook: "f",
      instagram: "📷",
    }
    return icons[channel] || "📱"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "text-blue-600"
      case "assigned":
        return "text-orange-600"
      case "in-progress":
        return "text-purple-600"
      case "resolved":
        return "text-green-600"
      case "closed":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Total Chats Today</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalChats}</p>
                  <p className="text-xs text-gray-500 mt-2">↑ 12% vs last week</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Total Tickets Today</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalTickets}</p>
                  <p className="text-xs text-gray-500 mt-2">↑ 10% vs last week</p>
                </div>
                <Ticket className="w-8 h-8 text-orange-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Open Tickets by Priority</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-sm">
                      <span className="text-red-600">High</span> <span className="font-bold text-gray-900">14</span>
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

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Avg Response Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgResponseRate}</p>
                  <p className="text-xs text-gray-500 mt-2">↑ 12% vs last week</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
            <div className="flex gap-2">
              {["all", "assigned", "unassigned", "pending", "closed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filterTab === tab ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === "assigned" ? "Ticket" : ""}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chats Table */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Chat ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Channel</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Agent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredChats.map((chat) => (
                  <tr key={chat.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-teal-600">{chat.id}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{chat.subject}</td>
                    <td className="px-6 py-4 text-gray-900">{chat.customer.name}</td>
                    <td className="px-6 py-4 text-center text-xl">{getChannelIcon(chat.channel)}</td>
                    <td className="px-6 py-4">
                      <Badge className={getPriorityColor(chat.priority)}>
                        {chat.priority.charAt(0).toUpperCase() + chat.priority.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{chat.agent?.name || "Unassigned"}</td>
                    <td className="px-6 py-4 text-gray-900 text-sm">
                      {chat.createdAt.toLocaleDateString()}{" "}
                      {chat.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => onSelectChat(chat)}
                        size="sm"
                        variant="ghost"
                        className="text-teal-600 hover:text-teal-700"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Page 1 of 30</p>
            <div className="flex gap-2">
              {[1, 2, 3, "...", 10, 11, 12].map((page, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-2 text-sm rounded ${
                    page === 1 ? "bg-teal-500 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
