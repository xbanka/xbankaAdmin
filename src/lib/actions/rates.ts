import AxiosInstance from "../Axiosinstance/axiosInstance";
import { CurrencyConfig } from "../types/rates-types";

export const getCryptoRates = async () => {
  const response = await AxiosInstance.get(`/api/rates/crypto/all`);
  return response.data;
};

export const postCryptoRates = async (payload: CurrencyConfig) => {
  const response = await AxiosInstance.post(`/api/rates/crypto`, payload);
  return response.data;
};

export const updateBuyAndSpreadRates = async (rateId: string, payload: CurrencyConfig) => {
  const response = await AxiosInstance.put(`/api/rates/crypto/${rateId}`, payload);
  return response.data;
};

export const getAllSegments = async () => {
  const response = await AxiosInstance.get(`/api/rates/segments/all`);
  return response.data;
};
