import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getCurrentAffiliate = async () => {
    const response = await AxiosInstance.get("/api/erp/me");
    return {
      success: true,
      data: response.data, 
      status: response.status,
    };
};