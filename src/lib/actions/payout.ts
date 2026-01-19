import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getIndividualPayout = async (payout_id: string) => {
  const response = await AxiosInstance.get(`/api/erp/payouts/${payout_id}`);
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const processPayout = async (payout_id: string) => {
  const response = await AxiosInstance.post(
    `/api/erp/payouts/${payout_id}/process`
  );

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const rejectPayout = async (payout_id: string) => {
  const response = await AxiosInstance.post(
    `/api/erp/payouts/${payout_id}/reject`
  );

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};
