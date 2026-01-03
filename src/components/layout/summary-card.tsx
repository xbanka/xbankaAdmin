import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SummaryCardProps } from "./layoutTypes"

export function SummaryCard({ title, value, icon: Icon, trend, className }: SummaryCardProps) {
  return (
    <Card className={cn(`hover:shadow-md transition-shadow border border-[#E5E3E3] rounded-[12px]`, className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-deep-blue">{value}</div>
        {trend && <p className={`text-xs ${trend.isPositive ? "text-main-green" : "text-main-red"}`}>{trend.value}</p>}
      </CardContent>
    </Card>
  )
}
