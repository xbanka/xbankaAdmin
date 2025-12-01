import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getCurrentAffiliate = async () => {
  try {
    const response = await AxiosInstance.get("/api/erp/me");
    console.log(response.data);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw {
      success: false,
      status: error.status,
      message: error.message,
    };
  }
};