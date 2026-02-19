"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Mic,
  AlertTriangle,
  Link,
} from "lucide-react";
import { CustomerLogDetailsForm } from "./customer-log-details-form";
import type { SupportChat, ChatMessage } from "./types";
import { DashboardLayout } from "../layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TicketDetailsPanel } from "./tickets-details-panel";

interface ChatInterfaceProps {
  chat: SupportChat;
  onBack: () => void;
}

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "customer",
    content: "Hi, I want to make enquiries about your bitcoin rate",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    senderName: "Jane Smith",
  },
  {
    id: "2",
    sender: "agent",
    content:
      "Hi Sarah, I'm John from customer support. I'd be happy to help you with the payment issue. Could you please tell me what error message you're seeing?",
    timestamp: new Date(Date.now() - 50 * 60 * 1000),
    senderName: "John",
  },
  {
    id: "3",
    sender: "customer",
    content: "Hi, I want to make enquiries about your bitcoin rate",
    timestamp: new Date(Date.now() - 40 * 60 * 1000),
    senderName: "Jane Smith",
  },
];

export function ChatInterface({ chat, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showCustomerLog, setShowCustomerLog] = useState(false);
  const [hasCustomerLog, setHasCustomerLog] = useState(false);
  const [rightSidebarView, setRightSidebarView] = useState<
    "customer-log" | "ticket" | "form"
  >("customer-log");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: String(messages.length + 1),
          sender: "agent",
          content: newMessage,
          timestamp: new Date(),
          senderName: "You",
        },
      ]);
      setNewMessage("");
    }
  };

  const handleConvertToTicket = () => {
    setRightSidebarView("ticket");
  };

  const handleSaveCustomerLog = () => {
    setHasCustomerLog(true);
    setShowCustomerLog(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout
      isPending={false}
      icon={ArrowLeft}
      id={chat.id}
      href="customer-support"
    >
      <div className="w-full md:max-w-[700px] lg:min-w-[100%] xl:min-w-full">
      <div className="flex min-w-full bg-gray-50 overflow-x-auto">
        {/* Left Sidebar - Conversations */}
        <div className="w-[20%] flex-shrink-0 overflow-y-auto h-screen bg-white border-r border-gray-200 flex flex-col ">
          <div className="p-4 border-b border-gray-200">
            <Input placeholder="Search" className="text-sm" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`p-3 cursor-pointer transition-colors ${
                    i === 1
                      ? "bg-[#F1FFFD] border-l-4 border-[#02CDB4]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#111827] truncate">
                        Kelvin James
                      </p>
                      <p className="font-[500] text-xs text-[#606368] truncate">
                        Hi, I want to make enquiries...
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        5 mins ago
                      </span>
                      {i === 1 && (
                        <div className="ml-10 flex gap-1 mt-2">
                          <Badge className="bg-red-500 text-white text-xs">
                            1
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Chat Area */}
        <div className="flex-1 flex-shrink-0 h-screen flex flex-col">
          {/* Chat Header */}
          <div className="bg-white px-[20px] py-[8px] border-b border-gray-200 ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">
                      +2341234...
                    </p>
                    <p className="text-xs font-[500] text-[#606368]">Online</p>
                  </div>
                </div>
                <Badge className="bg-[#FFF5DA] rounded-[36px] border border-[#FFEEC2] py-[4px] px-[8px] text-[#B58304]">
                  <AlertTriangle />
                  KYC Pending
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleConvertToTicket}
                  variant="outline"
                  size="sm"
                >
                  Convert To Ticket
                </Button>
                <Button variant="outline" size="sm">
                  Assign
                </Button>
                <Button size="sm">Resolve</Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "agent" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "agent"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "agent"
                        ? "text-teal-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-4 py-4">
            <div className="space-y-3">
              {/* Textarea */}
              <textarea
                placeholder="Type message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                rows={3}
              />

              {/* Icon Row and Send Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600 p-1.5"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600 p-1.5"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600 p-1.5"
                  >
                    <Link className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600 p-1.5"
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                </div>

                <Button
                  onClick={handleSendMessage}
                  className="bg-teal-500 text-white hover:bg-teal-600 px-4 py-2"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>

              {/* Help Text */}
              <p className="text-xs text-gray-400">
                You are handling this conversation
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Customer Log Details */}

        <div className="w-[30%] flex-shrink-0 h-screen overflow-y-auto bg-white border-l border-gray-200 flex flex-col ">
          {rightSidebarView === "ticket" ? (
            <TicketDetailsPanel
              onBack={() => setRightSidebarView("customer-log")}
            />
          ) : rightSidebarView === "form" ? (
            <CustomerLogDetailsForm
              onClose={() => setRightSidebarView("customer-log")}
              onSave={handleSaveCustomerLog}
            />
          ) : (
            <>
              <div className="">
                <div className="px-4 py-[22px] border-b border-[#E5E3E3] flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Customer Log Details
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>

                <Tabs defaultValue="profile" className="w-full px-4 py-[12px]">
                  <TabsList className="w-full">
                    <TabsTrigger
                      className="font-[500] text-[12px] leading-[16px] text-[#111827]"
                      value="profile"
                    >
                      Customer Profile
                    </TabsTrigger>
                    <TabsTrigger
                      className="font-[500] text-[12px] leading-[16px] text-[#111827]"
                      value="transactions"
                    >
                      Transactions
                    </TabsTrigger>
                    <TabsTrigger
                      className="font-[500] text-[12px] leading-[16px] text-[#111827]"
                      value="actions"
                    >
                      Actions
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile">
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      {hasCustomerLog ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600">
                              Customer Name
                            </label>
                            <p className="text-sm font-medium text-gray-900">
                              John Doe
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">
                              Email Address
                            </label>
                            <p className="text-sm font-medium text-gray-900">
                              john@gmail.com
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">
                              Phone Number
                            </label>
                            <p className="text-sm font-medium text-gray-900">
                              +234 7073456678
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 7H9m6 0a6 6 0 100 12H6a6 6 0 100-12h9"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-600 text-sm font-medium mb-4">
                            No Customer Log Details
                          </p>
                          <Button
                            onClick={() => setRightSidebarView("form")}
                            variant="ghost"
                            className="text-teal-600 hover:text-teal-700 text-sm"
                          >
                            + Create Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="transactions">
                    Change your password here.
                  </TabsContent>
                  <TabsContent value="actions">Actions here.</TabsContent>
                </Tabs>
              </div>

              {/* <div className="flex-1 overflow-y-auto px-6 py-4">
              {hasCustomerLog ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Customer Name</label>
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email Address</label>
                    <p className="text-sm font-medium text-gray-900">john@gmail.com</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone Number</label>
                    <p className="text-sm font-medium text-gray-900">+234 7073456678</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 7H9m6 0a6 6 0 100 12H6a6 6 0 100-12h9"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-4">No Customer Log Details</p>
                  <Button
                    onClick={() => setRightSidebarView("form")}
                    variant="ghost"
                    className="text-teal-600 hover:text-teal-700 text-sm"
                  >
                    + Create Details
                  </Button>
                </div>
              )}
            </div> */}
            </>
          )}
        </div>

        {/* Customer Log Details Form Modal */}
        {showCustomerLog && (
          <CustomerLogDetailsForm
            onClose={() => setShowCustomerLog(false)}
            onSave={handleSaveCustomerLog}
          />
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}
