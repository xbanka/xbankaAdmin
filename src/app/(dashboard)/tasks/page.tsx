"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { KanbanBoard, KanbanItem } from "@/components/layout/kanban-board"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Calendar, User, MessageSquare, Paperclip } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const taskColumns = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-blue-500",
    items: [
      {
        id: "T001",
        title: "Update API Documentation",
        description: "Review and update payment gateway documentation",
        assignee: { name: "Mike Johnson" },
        priority: "high" as const,
        tags: ["documentation", "api"],
        dueDate: "2024-01-18",
      },
      {
        id: "T002",
        title: "Customer Feedback Analysis",
        description: "Analyze Q4 customer feedback survey results",
        assignee: { name: "Sarah Wilson" },
        priority: "medium" as const,
        tags: ["analysis", "customer"],
        dueDate: "2024-01-20",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-yellow-500",
    items: [
      {
        id: "T003",
        title: "Security Audit Preparation",
        description: "Prepare documents for quarterly security audit",
        assignee: { name: "Tom Brown" },
        priority: "high" as const,
        tags: ["security", "audit"],
        dueDate: "2024-01-17",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "bg-sub-cyan",
    items: [
      {
        id: "T004",
        title: "New Feature Testing",
        description: "Test crypto wallet integration feature",
        assignee: { name: "Jane Smith" },
        priority: "medium" as const,
        tags: ["testing", "feature"],
        dueDate: "2024-01-19",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "bg-main-green",
    items: [
      {
        id: "T005",
        title: "Monthly Report Generation",
        description: "Generate December performance reports",
        assignee: { name: "Sarah Wilson" },
        priority: "low" as const,
        tags: ["report", "monthly"],
        dueDate: "2024-01-15",
      },
    ],
  },
]

const taskList = [
  {
    id: "T001",
    title: "Update API Documentation",
    assignedTo: "Mike Johnson",
    deadline: "2024-01-18",
    priority: "High",
    status: "To Do",
    tags: ["documentation", "api"],
    subtasks: 3,
    comments: 2,
    attachments: 1,
  },
  {
    id: "T002",
    title: "Customer Feedback Analysis",
    assignedTo: "Sarah Wilson",
    deadline: "2024-01-20",
    priority: "Medium",
    status: "To Do",
    tags: ["analysis", "customer"],
    subtasks: 5,
    comments: 0,
    attachments: 2,
  },
  {
    id: "T003",
    title: "Security Audit Preparation",
    assignedTo: "Tom Brown",
    deadline: "2024-01-17",
    priority: "High",
    status: "In Progress",
    tags: ["security", "audit"],
    subtasks: 8,
    comments: 4,
    attachments: 3,
  },
]

export default function TasksWorkflow() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedTask, setSelectedTask] = useState<any | null >(null)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [filterAssignee, setFilterAssignee] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  const filteredTasks = taskList.filter((task) => {
    const matchesAssignee = filterAssignee === "all" || task.assignedTo.toLowerCase().includes(filterAssignee)
    const matchesPriority = filterPriority === "all" || task.priority.toLowerCase() === filterPriority
    return matchesAssignee && matchesPriority
  })

  return (
    <DashboardLayout title="Tasks & Internal Workflow" breadcrumbs={[{ label: "Tasks & Workflow" }]}>
      <div className="space-y-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search tasks..." className="pl-10 w-64" />
            </div>
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="mike">Mike Johnson</SelectItem>
                <SelectItem value="sarah">Sarah Wilson</SelectItem>
                <SelectItem value="tom">Tom Brown</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              onClick={() => setViewMode("kanban")}
              size="sm"
            >
              Kanban
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")} size="sm">
              List
            </Button>
            <Button className="bg-main-green hover:bg-main-green/90 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {viewMode === "kanban" ? (
          // <div>kabnana</div>
          <KanbanBoard columns={taskColumns} onItemClick={(item: KanbanItem) => setSelectedTask(item)} />
        ) : (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-deep-blue">Task List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="flex gap-1 mt-1">
                            {task.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {task.assignedTo}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {task.deadline}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <span>{task.subtasks}</span>
                            <span className="text-muted-foreground">subtasks</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{task.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            <span>{task.attachments}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTask(task)}>
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Task Details - {task.id}</DialogTitle>
                            </DialogHeader>
                            {selectedTask && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-deep-blue mb-2">Task Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Assigned to:</span>
                                        <span>{selectedTask.assignedTo}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Deadline:</span>
                                        <span>{selectedTask.deadline}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Priority:</span>
                                        <Badge className={getPriorityColor(selectedTask.priority)}>
                                          {selectedTask.priority}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-deep-blue mb-2">Progress</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtasks:</span>
                                        <span>{selectedTask.subtasks}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Comments:</span>
                                        <span>{selectedTask.comments}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Attachments:</span>
                                        <span>{selectedTask.attachments}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-deep-blue mb-2">Comments</h4>
                                  {/* <Textarea placeholder="Add a comment..." className="min-h-20" /> */}
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline">Edit Task</Button>
                                  <Button variant="outline">Add Subtask</Button>
                                  <Button className="bg-main-green hover:bg-main-green/90">Update Status</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
