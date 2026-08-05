import AxiosInstance from "../Axiosinstance/axiosInstance";
import { GetCustomersParams } from "../types/customer";

const BASE_URL = "/api/customers";

export const getCustomers = async (query?: string) => {
  const url = query
    ? `${BASE_URL}/search?q=${encodeURIComponent(query)}`
    : `${BASE_URL}/all`;
  const response = await AxiosInstance.get(url, {
    withCredentials: true,
  });
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getAllCustomers = async ({
  page = 1,
  limit = 10,
  search,
  status,
  startDate,
  endDate,
}: GetCustomersParams) => {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await AxiosInstance.get(
    `${BASE_URL}/all?${params.toString()}`,
    {
      withCredentials: true,
    },
  );

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getCustomerById = async (customerId: string) => {
  const response = await AxiosInstance.get(`${BASE_URL}/${customerId}`, {
    withCredentials: true,
  });

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const createCustomer = async (payload: {
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  note?: string;
  affiliate_username?: string;
}) => {
  const response = await AxiosInstance.post("/api/customers/new", payload, {
    withCredentials: true,
  });

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const DeleteCustomer = async (customer_id: string) => {
  const response = await AxiosInstance.delete(`/api/customers/${customer_id}`, {
    withCredentials: true,
  });

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const EditCustomer = async (customer_id: string) => {
  const response = await AxiosInstance.post(`/api/customers/${customer_id}`, {
    withCredentials: true,
  });

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getCustomerVerification = async (customerId: string) => {
  const response = await AxiosInstance.get(
    `/api/customers/${customerId}/verification`,
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const getCustomerAssets = async (customerId: string) => {
  const response = await AxiosInstance.get(
    `/api/customers/${customerId}/assets`,
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const getCustomerTransactions = async (
  customerId: string,
  limit = 1,
) => {
  const response = await AxiosInstance.get(
    `/api/customers/${customerId}/transactions?limit=${limit}`,
    {
      withCredentials: true,
    },
  );

  return response.data;
};

// Toggle Customer Status
export const toggleCustomerStatus = async (customerId: string) => {
  const response = await AxiosInstance.put(
    `/api/customers/${customerId}/status`,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const getCustomerKyc = async (customerId: string) => {
  const response = await AxiosInstance.get(
    `/api/customers/${customerId}/kyc`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};