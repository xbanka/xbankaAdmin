import { Permission, Role } from "../enum/roles&permission.enum"

export interface StaffPayload {
  first_name: string
  last_name: string
  email: string
  role: Role
  permissions: Permission[]
}

export interface InviteStaffState {
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
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