
import type { LucideIcon } from "lucide-react"

export interface SummaryCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}