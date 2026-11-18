import AxiosInstance from "../Axiosinstance/axiosInstance";
import {
  ActiveConfig,
  CurrencyConfig,
  SegmentConfig,
  UpdateSegmentsBulkPayload,
} from "../types/rates-types";
import type { CryptoRatesParams } from "../utils/rates";

// With no params this is a bare GET (every asset). Filters go through axios
// `params` so the client encodes spaces in segment names.
export const getCryptoRates = async (params?: CryptoRatesParams) => {
  const response =
    params && Object.keys(params).length
      ? await AxiosInstance.get(`/api/rates/crypto/all`, { params })
      : await AxiosInstance.get(`/api/rates/crypto/all`);
  return response.data;
};

export const postCryptoRates = async (payload: CurrencyConfig) => {
  const response = await AxiosInstance.post(`/api/rates/crypto`, payload);
  return response.data;
};

export const updateBuyAndSpreadRates = async (
  rateId: string,
  payload: CurrencyConfig | SegmentConfig | ActiveConfig,
) => {
  const response = await AxiosInstance.put(
    `/api/rates/crypto/${rateId}`,
    payload,
  );
  return response.data;
};

export const getAllSegments = async () => {
  const response = await AxiosInstance.get(`/api/rates/segments/all`);
  return response.data;
};

export const UpdateAllSegments = async (payload: UpdateSegmentsBulkPayload) => {
  const response = await AxiosInstance.put(`/api/rates/segments/bulk`, payload);
  return response.data;
};

export const bulkAssignSegment = async (
  segmentId: string,
  payload: {
    assetIds: string[];
    setupNote: string;
  },
) => {
  const response = await AxiosInstance.put(
    `/api/rates/segments/${segmentId}/bulk-assign`,
    payload,
  );

  return response.data;
};

export const getRateProposals = async () => {
  const response = await AxiosInstance.get("api/rates/proposals");

  return response.data;
};

export const getRateProposalDetails = async (proposalId: string) => {
  const response = await AxiosInstance.get(
    `api/rates/proposals/${proposalId}`,
  );

  return response.data;
};

export const approveRateProposal = async (proposalId: string) => {
  const response = await AxiosInstance.post(
    `api/rates/proposals/${proposalId}/approve`
  );

  return response.data

};

export const rejectRateProposal = async (proposalId: string) => {
  const response = await AxiosInstance.post(
    `api/rates/proposals/${proposalId}/reject`
  );

  return response.data
};

export const getRateLogs = async () => {
  const response = await AxiosInstance.get("api/rates/logs");

  return response.data
};

export const getRateLogDetails = async (id: string) => {
  const response = await AxiosInstance.get(`api/rates/logs/${id}`);

  return response.data;
};