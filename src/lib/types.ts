type Priority = "low" | "medium" | "high";

interface Assignee {
  name: string;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignee: Assignee;
  priority: Priority;
  tags: string[];
  dueDate: string;
}

export interface TaskColumn {
    id: string;
    title: string;
    color: string;
    items: TaskItem[];
}

export interface FilteredTasks {
    id: string;
    title: string;
    assignedTo: string;
    deadline: string;
    priority: string;
    status: string;
    tags: string[];
    subtasks: number;
    comments: number;
    attachments: number;
}