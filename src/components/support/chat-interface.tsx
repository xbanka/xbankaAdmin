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
} from "lucide-react";
import { CustomerLogDetailsForm } from "./customer-log-details-form";
import type { SupportChat, ChatMessage } from "./types";
import { DashboardLayout } from "../layout/dashboard-layout";

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
    >
      <div className="flex h-screen w-full bg-gray-50">
        {/* Left Sidebar - Conversations */}
        <div className="w-[15%] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className=" border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <ArrowLeft
                className="w-5 h-5 cursor-pointer text-gray-600"
                onClick={onBack}
              />
              <span className="font-semibold text-gray-900">Back</span>
            </div>
            <Input placeholder="Search" className="text-sm" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    i === 1
                      ? "bg-teal-50 border-l-4 border-teal-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        Kelvin James
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Hi, I want to make enquiries...
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                      5 mins ago
                    </span>
                  </div>
                  {i === 1 && (
                    <div className="ml-10 flex gap-1 mt-2">
                      <Badge className="bg-red-500 text-white text-xs">1</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Chat Area */}
        <div className="w-[40%] flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  ← {chat.id}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      +2341234...
                    </p>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  KYC Pending
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Convert To Ticket
                </Button>
                <Button variant="ghost" size="sm">
                  Assign
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-teal-500 text-white hover:bg-teal-600"
                >
                  Resolve
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Chat Summary
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                Internal Comments
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4">
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

            <div className="flex justify-center my-6">
              <p className="text-sm text-gray-500">
                You are replying into this conversation
              </p>
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Type message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <Smile className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-teal-500 text-white hover:bg-teal-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              You are replying into this conversation
            </p>
          </div>
        </div>

        {/* Right Sidebar - Customer Log Details */}
        <div className="w-[28%] bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                Customer Log Details
              </h3>
              <button className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <p className="text-gray-600">Customer Profile</p>
                <p className="font-medium text-gray-900">Transactions</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-teal-50 text-teal-600 rounded hover:bg-teal-100">
                  Customer Profile
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  Transactions
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  Actions
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {hasCustomerLog ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Customer Name</label>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email Address</label>
                  <p className="text-sm font-medium text-gray-900">
                    john@gmail.com
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone Number</label>
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
                  onClick={() => setShowCustomerLog(true)}
                  variant="ghost"
                  className="text-teal-600 hover:text-teal-700 text-sm"
                >
                  + Create Details
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Customer Log Details Form Modal */}
        {showCustomerLog && (
          <CustomerLogDetailsForm
            onClose={() => setShowCustomerLog(false)}
            onSave={handleSaveCustomerLog}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
