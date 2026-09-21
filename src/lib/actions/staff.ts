import AxiosInstance from "../Axiosinstance/axiosInstance";
import { StaffPayload } from "../types/staffTypes";

export const getAllStaff = async () => {
  const response = await AxiosInstance.get(`/api/staff/all`);
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getStaff = async (role: string) => {
  const response = await AxiosInstance.get(`/api/staff/permissions?role=${role}`);
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const inviteStaff = async (payload: StaffPayload) => {
  const response = await AxiosInstance.post("/api/staff/invite", payload, {
    withCredentials: true,
  });
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const deleteStaff = async (staff_id: string) => {
  const response = await AxiosInstance.delete(`/api/staff/${staff_id}`, {
    withCredentials: true,
  });
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

// The roles-permissions endpoint accepts a partial payload: pass `role` +
// `permissions` (+ optional `reason`) to change the role, or just
// `permissions` on its own to edit permissions without touching the role.
export interface UpdateStaffRolesPermissionsPayload {
  role?: string;
  permissions: string[];
  reason?: string;
}
export const updateStaffRolesPermissions = async (
  staffId: string,
  payload: UpdateStaffRolesPermissionsPayload,
) => {
  const response = await AxiosInstance.patch(
    `/api/staff/${staffId}/roles-permissions`,
    payload,
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export type UpdateStaffPermissionsPayload = Pick<
  UpdateStaffRolesPermissionsPayload,
  "permissions"
>;
export const updateStaffPermissions = (
  staffId: string,
  payload: UpdateStaffPermissionsPayload,
) => updateStaffRolesPermissions(staffId, payload);