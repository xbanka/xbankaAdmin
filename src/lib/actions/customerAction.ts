import AxiosInstance from "../Axiosinstance/axiosInstance";

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
