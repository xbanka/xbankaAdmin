import { ApiPermission, Role } from "../rolePermissions";

export interface StaffPayload {
  email: string;
  role: Role;
  permissions: ApiPermission[];
}

export interface InviteStaffState {
  email: string;
  role: Role;
  permissions: ApiPermission[];
}

export type InviteStaffDraft = Partial<InviteStaffState>;

export type StaffPermission = {
  name: string;
};

export type StaffRole = {
  id: string;
  name: string;
  permissions: ApiPermission[];
};

export type StaffUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string; // ISO date string
  role: StaffRole;
};

export interface MemberRole {
  id: string;
  name: string;
  allowed_permissions: string[];
}

export interface RoleChange {
  previous_role: string;
  new_role: string;
}

// GET /erp/me — the logged-in staff member's own profile.
export interface Profile {
  id: string;
  staff_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  /** Short-lived link the browser can load; avatar_url is only the S3 key. */
  avatar_signed_url: string | null;
  role: MemberRole;
  created_at: string;
  verified: boolean;
}

export interface StaffMember {
  id: string;
  staff_code: string;

  first_name: string;
  last_name: string;

  email: string;
  phone: string | null;
  avatar_url: string | null;

  created_at: string; // ISO 8601 date string

  role: MemberRole;

  verified: boolean;

  role_change: RoleChange | null;
}

export interface StaffResponse {
  count: number;
  staff: StaffMember[];
}

export interface DeleteStaffModalProps {
  isOpen: boolean
  onClose: () => void
  staff: StaffMember | null
}