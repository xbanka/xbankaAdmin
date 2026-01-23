import { Permission, Role } from "../enum/roles&permission.enum"

export interface StaffPayload {
  first_name: string
  last_name: string
  email: string
  role: Role
  permissions: Permission[]
}