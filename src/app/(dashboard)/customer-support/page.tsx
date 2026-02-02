"use client"

import { useState } from "react"
import { SupportDashboard } from "@/components/support/support-dashboard"
import { ChatInterface } from "@/components/support/chat-interface"
import type { SupportChat } from "@/components/support/types"

export default function SupportPage() {
  const [selectedChat, setSelectedChat] = useState<SupportChat | null>(null)

  if (selectedChat) {
    return <ChatInterface chat={selectedChat} onBack={() => setSelectedChat(null)} />
  }

  return <SupportDashboard onSelectChat={setSelectedChat} />
}
