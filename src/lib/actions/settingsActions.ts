import AxiosInstance from "../Axiosinstance/axiosInstance";

/**
 * Every backend call the Account Settings screen makes lives here.
 *
 * NOTE: the paths below are PROVISIONAL — at the time of writing the backend
 * exposes `GET /api/erp/me` and the logged-out forgot/reset password pair, but
 * nothing for updating a profile, uploading an avatar, changing a password
 * while signed in, or reading/writing notification preferences. They are
 * grouped in this one file precisely so that confirming the real contract is a
 * rename here and nothing else.
 */

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
  try {
    const response = await AxiosInstance.patch("/api/erp/me", payload);
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

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await AxiosInstance.post("/api/erp/me/avatar", formData, {
      // Let the browser set the multipart boundary; the shared instance
      // otherwise pins application/json for every request.
      headers: { "Content-Type": "multipart/form-data" },
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

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  try {
    const response = await AxiosInstance.post(
      "/api/auth/erp/change-password",
      payload,
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
