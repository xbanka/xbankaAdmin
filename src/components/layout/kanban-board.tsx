"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface KanbanItem {
  id: string
  title: string
  description?: string
  assignee?: {
    name: string
    avatar?: string
  }
  priority?: "low" | "medium" | "high"
  tags?: string[]
  dueDate?: string
}

export interface KanbanColumn {
  id: string
  title: string
  items: KanbanItem[]
  color: string
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onItemClick?: (item: KanbanItem) => void
}

export function KanbanBoard({ columns, onItemClick }: KanbanBoardProps) {
  const [boardColumns] = useState(columns)

  const handleClick = (item: KanbanItem) => {
    onItemClick?.(item)
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-main-red"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-main-green"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-wrap gap-6 overflow-x-auto pb-4">
      {boardColumns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <Card className="bg-white h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  {column.title}
                  <Badge variant="secondary" className="ml-2">
                    {column.items.length}
                  </Badge>
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.items.map((item) => (
                <Card
                  key={item.id}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-off-white"
                  onClick={() => handleClick(item)}
                  // onClick={() => onItemClick?.(item)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium text-deep-blue">{item.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Move</DropdownMenuItem>
                          <DropdownMenuItem className="text-main-red">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {item.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.priority && (
                          <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>{item.priority}</Badge>
                        )}
                      </div>
                      {item.assignee && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={item.assignee.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {item.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    {item.dueDate && <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>}
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
