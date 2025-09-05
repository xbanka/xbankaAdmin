"use server";
// import Cookies from "js-cookie";

import axios, { AxiosError } from "axios";
import { AffiliateSignUpTypes, loginTypes } from "./actionTypes";

export const signupAction = async (data: AffiliateSignUpTypes) => {
  // Insert into DB, call API, etc.
  try {
    const response = await axios.post(
      "https://xbankadashboardbackend-production.up.railway.app/xbankastaff/createuser",
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
  } catch (err: unknown) {
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
};
export const verifyEmailAction = async (token: string) => {
  // Insert into DB, call API, etc.
  try {
    console.log(token);
    const response = await axios.post(
      "https://xbankadashboardbackend-production.up.railway.app/xbankastaff/verify-mail",
      { token }
    );
    console.log(response);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
  } catch (err: unknown) {
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
};

export const loginAction = async (data: loginTypes) => {
  // Insert into DB, call API, etc.
  try {
    const response = await axios.post(
      "https://xbankadashboardbackend-production.up.railway.app/xbankastaff/login",
      {
        email: data.email,
        password: data.password,
      }
    );
    console.log(response);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
  } catch (err: unknown) {
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
  //   console.log("User signup:", response);

  // If you want to refresh server components that depend on user state
  //   revalidatePath("/dashboard");
};
export const logoutAction = async () => {
  // Insert into DB, call API, etc.
  try {
    // const token = Cookies.get("accessToken");
    const token = localStorage.getItem("accessToken");
    console.log("logout", token);
    const response = await axios.post(
      "https://xbankadashboardbackend-production.up.railway.app/xbankastaff/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      }
    );
    console.log(response);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
      status: response.status,
    };
  } catch (err: unknown) {
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
  //   console.log("User signup:", response);

  // If you want to refresh server components that depend on user state
  //   revalidatePath("/dashboard");
};
// export const refresh = async () => {
//   // Insert into DB, call API, etc.
//   try {
//     const response = await AxiosInstance.get("/xbankastaff/refresh")
//     console.log(response)
//     return {
//       success: true,
//       data: response.data,   // ✅ only return actual payload
//       status: response.status,
//     };
//   } catch (err: unknown) {
//     const error = err as AxiosError<{ message?: string }>;
//     if (error.response) {
//       // Return structured error message from backend
//       console.log(error)
//       return {
//         success: false,
//         message: error.response.data?.message || "Something went wrong",
//         status: error.response.status,
//       };
//     } else if (error.request) {
//          console.log(error)
//       return {
//         success: false,
//         message: "No response from server. Please try again later.",
//       };
//     } else {
//         console.log(error)
//       return { success: false, message: error.message };
//     }
//   }
//   //   console.log("User signup:", response);

//   // If you want to refresh server components that depend on user state
//   //   revalidatePath("/dashboard");
// };
