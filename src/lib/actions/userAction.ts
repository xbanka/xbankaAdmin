import AxiosInstance from "../Axiosinstance/axiosInstance";
import { Profile } from "../types/staffTypes";

export const getCurrentAffiliate = async () => {
    const response = await AxiosInstance.get<Profile>("/api/erp/me");
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
};