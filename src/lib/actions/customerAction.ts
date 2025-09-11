import { AxiosError } from "axios";
import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getCustomers = async () => {
  try{
    const response = await AxiosInstance.get(
      "/customers",
      { withCredentials: true }
    );
    console.log(response)
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
  }catch(err){
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      // Return structured error message from backend
      console.log(error);
      return {
        success: false,
        message: error.response.data?.message || "Something went wrong",
        status: error.response.status,
      };
    } else if (error.request) {
      console.log(error);
      return {
        success: false,
        message: "No response from server. Please try again later.",
      };
    } else {
      console.log(error);
      return { success: false, message: error.message };
    }
  }
}