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
