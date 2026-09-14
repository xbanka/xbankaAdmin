import AxiosInstance from "../Axiosinstance/axiosInstance";

/**
 * Every backend call the Account Settings screen makes lives here.
 *
 * `changePassword` is CONFIRMED against the contract the backend team
 * supplied, and verified end to end. The rest are still PROVISIONAL: the
 * backend exposes `GET /api/erp/me` and the logged-out forgot/reset password
 * pair, but nothing yet for updating a profile, uploading an avatar, or
 * reading/writing notification preferences. They are grouped in this one file
 * precisely so that confirming the real contract is a rename here and nothing
 * else.
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

/**
 * Authenticates by cookie (`access_token` / `refresh_token`), which the shared
 * instance already sends via `withCredentials`.
 *
 * The backend answers 401 for a *wrong current password*, not just for an
 * expired session — confirmed by the backend team. Left alone, the shared
 * response interceptor reads that 401 as a dead session: it attempts a token
 * refresh and, when that refresh fails, wipes the token and redirects to
 * /signin with no message at all. Mistyping your password would log you out.
 *
 * Marking the request `_retry` up front is what prevents that. The interceptor
 * skips its refresh-and-redirect branch for any request already flagged as
 * retried, so the 401 falls through to normal error handling and the user sees
 * the server's message instead.
 *
 * The trade-off: a genuinely expired access token is no longer refreshed
 * transparently here, surfacing as an error the user must act on. That is the
 * better failure — and in practice the other queries on the page refresh the
 * token long before anyone opens this dialog.
 */
export const changePassword = async (payload: ChangePasswordPayload) => {
  try {
    const response = await AxiosInstance.post(
      "/api/auth/erp/change-password",
      payload,
      { _retry: true } as never,
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
