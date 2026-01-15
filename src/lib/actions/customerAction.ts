import AxiosInstance from "../Axiosinstance/axiosInstance";

const BASE_URL = "/api/customers";

export const getCustomers = async (query?: string) => {
  try {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw {
      success: false,
      status: error.status,
      message: error.message,
    };
  }
};

export const createCustomer = async (payload: {
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  note?: string;
  affiliate_username?: string
}) => {
  try {
    const response = await AxiosInstance.post(
      "/api/customers/new",
      payload,
      { withCredentials: true }
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
      status: error?.response?.status,
      message:
        error.message ?? "Failed to create customer",
    };
  }
};

