"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { KanbanBoard, KanbanItem } from "@/components/layout/kanban-board"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Calendar, User, Target, FileText } from "lucide-react"

const contentColumns = [
  {
    id: "idea",
    title: "Idea",
    color: "bg-blue-500",
    items: [
      {
        id: "C001",
        title: "How to Buy Bitcoin Guide",
        description: "Comprehensive guide for beginners",
        assignee: { name: "Sarah Wilson" },
        priority: "medium" as const,
        tags: ["crypto", "guide"],
        dueDate: "2024-01-20",
      },
      {
        id: "C002",
        title: "Gift Card Security Tips",
        description: "Article about gift card fraud prevention",
        assignee: { name: "Tom Brown" },
        priority: "low" as const,
        tags: ["security", "gift-cards"],
        dueDate: "2024-01-25",
      },
    ],
  },
  {
    id: "draft",
    title: "Draft",
    color: "bg-yellow-500",
    items: [
      {
        id: "C003",
        title: "Mobile App Tutorial",
        description: "Step-by-step app usage guide",
        assignee: { name: "Mike Johnson" },
        priority: "high" as const,
        tags: ["tutorial", "mobile"],
        dueDate: "2024-01-18",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "bg-sub-cyan",
    items: [
      {
        id: "C004",
        title: "Crypto Market Analysis",
        description: "Weekly market trends article",
        assignee: { name: "Jane Smith" },
        priority: "medium" as const,
        tags: ["crypto", "analysis"],
        dueDate: "2024-01-17",
      },
    ],
  },
  {
    id: "scheduled",
    title: "Scheduled",
    color: "bg-purple-500",
    items: [
      {
        id: "C005",
        title: "New Year Promotions",
        description: "Promotional content for January",
        assignee: { name: "Sarah Wilson" },
        priority: "high" as const,
        tags: ["promotion", "social"],
        dueDate: "2024-01-16",
      },
    ],
  },
  {
    id: "posted",
    title: "Posted",
    color: "bg-main-green",
    items: [
      {
        id: "C006",
        title: "Bill Payment Benefits",
        description: "Article about bill payment advantages",
        assignee: { name: "Tom Brown" },
        priority: "low" as const,
        tags: ["bills", "benefits"],
        dueDate: "2024-01-15",
      },
    ],
  },
]

const contentDetails = {
  C003: {
    title: "Mobile App Tutorial",
    writer: "Mike Johnson",
    dueDate: "2024-01-18",
    seoKeywords: ["mobile app", "tutorial", "how to use", "guide"],
    targetPlatforms: ["Blog", "Social Media", "Email Newsletter"],
    bodyLink: "https://docs.example.com/mobile-tutorial-draft",
    notes: "Include screenshots from both iOS and Android versions",
    attachments: ["app-screenshots.zip", "user-flow-diagram.pdf"],
  },
}

export default function ContentPipeline() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedContent, setSelectedContent] = useState<any | null>(null)
  const [filterWriter, setFilterWriter] = useState("all")

  const handleContentClick = (item: KanbanItem) => {
    setSelectedContent({
      ...item,
      ...contentDetails[item.id as keyof typeof contentDetails],
    })
  }

  return (
    <DashboardLayout title="Content Pipeline" breadcrumbs={[{ label: "Content" }]}>
      <h1 className="">content pipeline</h1>
      <div className="space-y-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search content..." className="pl-10" />
          </div>
          <Select value={filterWriter} onValueChange={setFilterWriter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by writer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Writers</SelectItem>
              <SelectItem value="sarah">Sarah Wilson</SelectItem>
              <SelectItem value="mike">Mike Johnson</SelectItem>
              <SelectItem value="tom">Tom Brown</SelectItem>
              <SelectItem value="jane">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-main-green hover:bg-main-green/90 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Content
          </Button>
        </div>

        <KanbanBoard columns={contentColumns} onItemClick={handleContentClick} />

        {selectedContent && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Content Details - {selectedContent.id}</span>
                <Badge className={selectedContent.priority === "high" ? "bg-main-red" : "bg-yellow-500"}>
                  {selectedContent.priority}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-deep-blue mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Article Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium">{selectedContent.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Writer:</span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {selectedContent.writer || selectedContent.assignee?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {selectedContent.dueDate}
                      </span>
                    </div>
                    {selectedContent.bodyLink && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Draft Link:</span>
                        <Button variant="link" className="h-auto p-0 text-sub-cyan">
                          View Draft
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-deep-blue mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    SEO & Targeting
                  </h4>
                  <div className="space-y-3">
                    {selectedContent.seoKeywords && (
                      <div>
                        <span className="text-sm text-muted-foreground">SEO Keywords:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedContent.seoKeywords.map((keyword: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedContent.targetPlatforms && (
                      <div>
                        <span className="text-sm text-muted-foreground">Target Platforms:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedContent.targetPlatforms.map((platform: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedContent.notes && (
                <div>
                  <h4 className="font-medium text-deep-blue mb-2">Notes & Requirements</h4>
                  <div className="bg-off-white p-3 rounded-lg text-sm">{selectedContent.notes}</div>
                </div>
              )}

              {selectedContent.attachments && (
                <div>
                  <h4 className="font-medium text-deep-blue mb-2">Attachments</h4>
                  <div className="flex gap-2">
                    {selectedContent.attachments.map((attachment: string, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <FileText className="h-4 w-4" />
                        {attachment}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline">Edit Content</Button>
                <Button variant="outline">Move Stage</Button>
                <Button className="bg-main-green hover:bg-main-green/90">Update Status</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
