import AxiosInstance from "../Axiosinstance/axiosInstance";


export interface ForgotPasswordErpProps {
    email: string
}

export const forgotPasswordErp = async (data: ForgotPasswordErpProps) => {
  try {
    const response = await AxiosInstance.post("/api/auth/erp/forgot-password", {
        email: data.email
    });
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

export interface passwordResetErpProps {
  token: string,
    password: string, 
    confirm: string
}

export const passwordResetErp = async (data : passwordResetErpProps) => {
  try {
    const response = await AxiosInstance.post("/api/auth/erp/reset-password", {
        token: data.token,
        new_password: data.password,
        confirm_password: data.confirm,
    });
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