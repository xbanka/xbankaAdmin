import { Permission, Role } from "../enum/roles&permission.enum";
import { ApiPermission } from "../rolePermissions";

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
  permissions: Permission[];
};

export type StaffUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string; // ISO date string
  role: StaffRole;
};
