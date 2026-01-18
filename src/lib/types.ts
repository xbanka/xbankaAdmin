import { TransactionRecord } from "@/components/transaction/transaction-data";

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

export interface SidebarHeaderProps {
  header: string;
  onClose: () => void;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  note: string;
  affiliateAttribution?: string
  assignedRep?: string
}

export interface PayoutData {
  id: string;
  amount: string;
  status: string;
  payment_ref: string;
  paid_at: string;
  affiliate: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone_no: string;
    bank: string;
    account_no: string;
    ref_code: string;
    custom_refcode: string;
    created_at: string;
  };
}

export interface PayoutDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  payout: PayoutData;
  onDecline: () => void;
  onProcess: () => void;
  loading: boolean;
  error: string;
}

export interface HeaderProps{
    text: string
}

export interface FilterTabsProps {
  filters: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  pages?: number;
  limit?: number;
}

export interface TransactionsApiResponse {
  data: PaginatedResponse<TransactionRecord>;
}
