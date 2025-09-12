import { AxiosError } from "axios";
import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getCustomers = async () => {
  try {
    const response = await AxiosInstance.get("/customers", {
      withCredentials: true,
    });
    console.log(response);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      throw new Error(error.response.data?.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const createNewCustomer = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  status: string
) => {
  try {
    const response = await AxiosInstance.post(
      "/customers/create",
      {
        firstName,
        lastName,
        email,
        phone,
        status,
      },
      { withCredentials: true }
    );
    console.log(response);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      throw new Error(error.response.data?.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const deleteCustomer = async (
  id: string,
) => {
  try {
    const response = await AxiosInstance.delete(
      `/customers/${id}`,
      { withCredentials: true }
    );
    console.log(response);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      throw new Error(error.response.data?.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error(error.message);
    }
  }
};
