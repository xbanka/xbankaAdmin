import { LucideIcon } from "lucide-react"

export interface SupportChat {
  id: string
  subject: string
  customer: {
    name: string
    avatar?: string
  }
  channel: "whatsapp" | "email" | "facebook" | "instagram"
  priority: "high" | "medium" | "low"
  agent?: {
    name: string
    avatar?: string
  }
  status: "new" | "assigned" | "in-progress" | "resolved" | "closed" | "pending"
  createdAt: Date
  lastMessageAt: Date
  messageCount: number
  unreadCount: number
}

export interface ChatMessage {
  id: string
  sender: "customer" | "agent"
  content: string
  timestamp: Date
  avatar?: string
  senderName: string
}

export interface CustomerLogDetails {
  id?: string
  customerName: string
  email: string
  phoneNumber: string
  address: string
  bankName: string
  bankAccount: string
  documents: File[]
}

export interface ChatSummaryCardProps{
    className?: string, 
    header: string, 
    totalChats: string | number, 
    footer: string,
    icon: LucideIcon
}