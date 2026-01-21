"use client";
// import Cookies from "js-cookie";
import { AffiliateSignUpTypes, loginTypes } from "./actionTypes";
import AxiosInstance from "../Axiosinstance/axiosInstance";
import { SuperAdminSignupPayload } from "../types/superAdminTypes";

export const signupAction = async (data: AffiliateSignUpTypes) => {
  const response = await AxiosInstance.post("/api/auth/erp/register", {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    password: data.password,
    confirm_password: data.confirmPassword,
  });
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const superAdminSignup = async (
  payload: SuperAdminSignupPayload
) => {
  const response = await AxiosInstance.post(
    "/api/auth/super-admin/signup",
    payload
  );

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const verifyEmailAction = async (token: string) => {
  const response = await AxiosInstance.post(
    `/api/auth/erp/verify?token=${token}`
  );
  return {
    success: true,
    data: response.data, // ✅ only return actual payload
    status: response.status,
  };
};

export const loginAction = async (data: loginTypes) => {
  const response = await AxiosInstance.post(
    "/api/auth/erp/login",
    {
      email: data.email,
      password: data.password,
    },
    { withCredentials: true }
  );
  return {
    success: true,
    data: response.data, // ✅ only return actual payload
    status: response.status,
  };
};

export const logoutAction = async () => {
  const response = await AxiosInstance.post(
    "/api/auth/erp/logout",
    {},
    { withCredentials: true }
  );
  return {
    success: true,
    data: response.data, // ✅ only return actual payload
    status: response.status,
  };
};
