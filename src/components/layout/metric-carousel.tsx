"use client"

import { useState } from "react"
import { SummaryCard } from "@/components/layout/summary-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  DollarSign,
  AlertTriangle,
  Ticket,
  FileText,
  CheckSquare,
  XCircle,
  RefreshCw,
  Flag,
  Clock,
  Shield,
  Users,
  Eye,
  Send,
} from "lucide-react"

const allMetrics = [
  // Transaction Metrics
  {
    title: "Total Transactions Today",
    value: "1,247",
    icon: DollarSign,
    trend: { value: "+8.2% from yesterday", isPositive: true },
    className: "bg-light-cyan border-abstract-cyan",
  },
  {
    title: "Value Processed Today",
    value: "₦2,458,000",
    icon: DollarSign,
    trend: { value: "+12.5% from yesterday", isPositive: true },
    className: "bg-green-50 border-green-200",
  },
  {
    title: "Failed Transactions Today",
    value: "23",
    icon: XCircle,
    trend: { value: "-5 from yesterday", isPositive: true },
    className: "bg-red-50 border-red-200",
  },
  {
    title: "Refunds Processed Today",
    value: "8 (₦125,000)",
    icon: RefreshCw,
    trend: { value: "+2 from yesterday", isPositive: false },
    className: "bg-orange-50 border-orange-200",
  },
  {
    title: "Pending Transactions",
    value: "45",
    icon: Clock,
    trend: { value: "12 awaiting manual review", isPositive: false },
    className: "bg-yellow-50 border-yellow-200",
  },
  {
    title: "Flagged Transactions",
    value: "6",
    icon: Flag,
    trend: { value: "2 high risk", isPositive: false },
    className: "bg-red-50 border-red-200",
  },

  // Support Metrics
  {
    title: "Open Tickets",
    value: "23",
    icon: Ticket,
    trend: { value: "+3 new today", isPositive: false },
    className: "bg-blue-50 border-blue-200",
  },
  {
    title: "Escalated Support Tickets",
    value: "8",
    icon: AlertTriangle,
    trend: { value: "-2 from yesterday", isPositive: true },
    className: "bg-red-50 border-red-200",
  },
  {
    title: "Pending KYC Reviews",
    value: "34",
    icon: Shield,
    trend: { value: "12 urgent", isPositive: false },
    className: "bg-purple-50 border-purple-200",
  },
  {
    title: "Active Users Today",
    value: "892",
    icon: Users,
    trend: { value: "+15.3% from yesterday", isPositive: true },
    className: "bg-cyan-50 border-cyan-200",
  },

  // Content Metrics
  {
    title: "Articles Submitted",
    value: "18",
    icon: Send,
    trend: { value: "3 ahead of schedule", isPositive: true },
    className: "bg-indigo-50 border-indigo-200",
  },
  {
    title: "Articles Awaiting Review",
    value: "12",
    icon: Eye,
    trend: { value: "2 overdue", isPositive: false },
    className: "bg-amber-50 border-amber-200",
  },
  {
    title: "Articles Published",
    value: "25",
    icon: CheckSquare,
    trend: { value: "This week", isPositive: true },
    className: "bg-green-50 border-green-200",
  },
  {
    title: "Articles Pending",
    value: "5",
    icon: FileText,
    trend: { value: "Out of 30 weekly quota", isPositive: true },
    className: "bg-slate-50 border-slate-200",
  },
]

interface MetricCarouselProps {
  cardsPerView?: number
}

export function MetricCarousel({ cardsPerView = 4 }: MetricCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const totalSlides = Math.ceil(allMetrics.length / cardsPerView)
  const maxIndex = totalSlides - 1

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const getCurrentMetrics = () => {
    const startIndex = currentIndex * cardsPerView
    return allMetrics.slice(startIndex, startIndex + cardsPerView)
  }

  return (
    <div className="space-y-4">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0 bg-abstractCyan hover:bg-customCyan"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className="h-8 w-8 p-0 bg-abstractCyan hover:bg-customCyan"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-abstractCyan" : "bg-customCyan"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} of {totalSlides}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 transform transition-all duration-300 ease-in-out">
        {getCurrentMetrics().map((metric, index) => (
          <SummaryCard
            key={`${currentIndex}-${index}`}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            className={metric.className}
          />
        ))}
      </div>

      {/* Category Labels */}
      {/* <div className="flex justify-center">
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-light-cyan rounded-full"></div>
            <span>Transactions (1-6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
            <span>Support (7-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-200 rounded-full"></div>
            <span>Content (11-14)</span>
          </div>
        </div>
      </div> */}
    </div>
  )
}