export interface Affiliate {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  created_at: string;
}

export type NotificationReferenceType =
  | "PAYOUT"
  | "RATE_PROPOSAL"
  | "STAFF_ACCOUNT";

export type NotificationStatus = "ACTIVE" | "RESOLVED";

// The only action the backend emits today. More may be added later, but
// every other notification carries `action: null` — never infer an action
// from reference_type/reference_id, always check this field.
export interface ConfirmRoleChangeAction {
  type: "CONFIRM_ROLE_CHANGE";
  role_change_id: string;
}

export interface PayoutNotification {
  id: string;
  amount: number;
  message: string;
  type: string;
  method: string;
  is_read: boolean;
  read_at: string | null;
  status: NotificationStatus;
  reference_id: string | null;
  reference_type: NotificationReferenceType;
  affiliate: Affiliate;
  action: ConfirmRoleChangeAction | null;
}

/**
 * Server-side filters for GET /api/erp/notifications. Any key left out is
 * "all" for that axis, so the three filters compose freely (e.g. unread,
 * unresolved rate proposals).
 */
export interface NotificationFilters {
  reference_type?: NotificationReferenceType;
  status?: NotificationStatus;
  is_read?: boolean;
}
