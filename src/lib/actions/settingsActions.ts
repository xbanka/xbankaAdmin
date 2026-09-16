import AxiosInstance from "../Axiosinstance/axiosInstance";

/**
 * Every backend call the Account Settings screen makes lives here.
 *
 * All three are CONFIRMED against the contract the backend team documented
 * and against the live OpenAPI spec. Notification preferences remain the one
 * outstanding gap — no endpoint exists for them yet.
 */

/** JPG, PNG or WebP, per the avatar endpoint's documented validation. */
export const AVATAR_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** 5 MB ceiling, matching the server's own limit. */
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  /**
   * Named `phone`, not `phone_number` — the endpoint rejects unknown fields
   * with a 422. Nigerian numbers may be sent locally (08031234567); anything
   * else needs its country code. The server normalises what it stores to
   * international format, so the value to display afterwards is the one that
   * comes back, not the one the user typed.
   */
  phone?: string | null;
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

/**
 * The form field must be called `avatar` — the endpoint looks for that name
 * specifically. Each upload returns a fresh URL, so the avatar is always
 * re-read from the refreshed profile rather than cached anywhere.
 */
export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

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
 * Every rejection here is a 400 carrying its own message — a wrong current
 * password included, which the backend documents explicitly as "400, not 401"
 * so it is never mistaken for an expired session. That means the shared
 * interceptor's refresh-and-logout branch is never reached by a failed
 * attempt, and a genuine 401 here really does mean the session died and
 * should be treated as such.
 *
 * A success leaves the current session valid — the user stays logged in and
 * simply uses the new password next time.
 */
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
