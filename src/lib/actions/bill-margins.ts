import AxiosInstance from "../Axiosinstance/axiosInstance";
import {
  BillProduct,
  CreateBillMarginPayload,
  UpdateBillMarginPayload,
} from "../types/bill-margins-types";

export const getBillMargins = async () => {
  const response = await AxiosInstance.get("/api/bills/margins");
  return response.data;
};

export const createBillMargin = async (payload: CreateBillMarginPayload) => {
  const response = await AxiosInstance.post("/api/bills/margins", payload);
  return response.data;
};

export const updateBillMargin = async (
  product: BillProduct,
  payload: UpdateBillMarginPayload,
) => {
  const response = await AxiosInstance.put(
    `/api/bills/margins/${product}`,
    payload,
  );
  return response.data;
};

export const getBillMarginHistory = async (
  page: number,
  product?: BillProduct,
) => {
  const response = await AxiosInstance.get("/api/bills/margins/history", {
    params: { page, ...(product ? { product } : {}) },
  });
  return response.data;
};
