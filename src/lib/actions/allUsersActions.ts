import { AxiosError } from "axios";
import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getAllUsers = async () => {
  try {
    const response = await AxiosInstance.get("/xbankastaff/allUsers", { withCredentials: true });
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      throw new Error(error.response.data?.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const updateUsers = async (role: string, id: string) => {
  try {
    const response = await AxiosInstance.patch(`/xbankastaff/${id}/role`, { role }, { withCredentials: true });
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      throw new Error(error.response.data?.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error(error.message);
    }
  }
};
