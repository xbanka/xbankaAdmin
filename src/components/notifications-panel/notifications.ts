export interface Affiliate {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  created_at: string;
}

export interface PayoutNotification {
  id: string;
  amount: number;
  message: string;
  type: string;
  method: string;
  is_read: boolean;
  read_at: string | null;
  status: "ACTIVE" | "RESOLVED";
  reference_id: string | null;
  reference_type: "PAYOUT" | "RATE_PROPOSAL" | "STAFF_ACCOUNT";
  affiliate: Affiliate;
}