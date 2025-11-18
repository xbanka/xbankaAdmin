"use client";
// import Cookies from "js-cookie";

import axios, { AxiosError } from "axios";
import { AffiliateSignUpTypes, loginTypes } from "./actionTypes";
import AxiosInstance from "../Axiosinstance/axiosInstance";

export const signupAction = async (data: AffiliateSignUpTypes) => {
  try {
    const response = await AxiosInstance.post(
      "/api/auth/erp/register",
      {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
      }
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
      status: error.status,
      message: error.message,
    };
  }
};

export const verifyEmailAction = async (token: string) => {
  try {
    console.log(token);
    const response = await AxiosInstance.post(
      `/api/auth/erp/verify?token=${token}`
    );
    console.log(response);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
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

export const loginAction = async (data: loginTypes) => {
  // Insert into DB, call API, etc.
  try {
    const response = await AxiosInstance.post(
      "/api/auth/erp/login",
      {
        email: data.email,
        password: data.password,
      },
      { withCredentials: true }
    );
    console.log(response);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
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

export const logoutAction = async () => {
  // Insert into DB, call API, etc.
  try {
    const response = await AxiosInstance.post(
      "/api/auth/erp/logout",
      {},
      { withCredentials: true }
    );
    console.log(response);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
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
