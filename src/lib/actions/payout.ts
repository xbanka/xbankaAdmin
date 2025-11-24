import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getIndividualPayout = async (payout_id: string) => {
  try {
    const response = await AxiosInstance.post(`/api/erp/payouts/{payout_id}`);
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

export const processPayout = async (payout_id: string) => {
  try {
    const response = await AxiosInstance.post(
      `/api/erp/payouts/${payout_id}/process`
    );

    return {
      success: true,
      data: response.data,
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
