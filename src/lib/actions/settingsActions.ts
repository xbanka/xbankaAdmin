import AxiosInstance from "../Axiosinstance/axiosInstance";

/**
 * Every backend call the Account Settings screen makes lives here.
 *
 * All of them are CONFIRMED against the contract the backend team documented
 * and against the live OpenAPI spec.
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

/* ------------------------------------------------------------------ *
 * Notification preferences
 * ------------------------------------------------------------------ */

/** The two delivery channels every switch on the page routes to. */
export type NotificationChannel = "in_app" | "email";

export type ChannelToggles = Record<NotificationChannel, boolean>;

/**
 * Stable backend identifiers — not display text. The labels and descriptions
 * that go beside them live in the notifications tab, so wording can change
 * without touching what we send.
 */
export const NOTIFICATION_CATEGORY_KEYS = [
  "TRANSACTION_ACTIVITY",
  "APPROVAL_REQUESTS",
  "ROLE_PERMISSION_CHANGES",
  "RATE_MANAGEMENT",
  "KYC_VERIFICATION",
  "SUPPORT_ACTIVITY",
  "SYSTEM_SECURITY",
] as const;

export type NotificationCategoryKey =
  (typeof NOTIFICATION_CATEGORY_KEYS)[number];

/**
 * Security alerts are delivered whatever the switches say — a password-change
 * alert is how the real owner finds out someone else changed it. The row's
 * toggles are still stored and returned, they just don't gate anything, so
 * the page shows them locked rather than pretending they work.
 */
export const ALWAYS_ON_CATEGORY: NotificationCategoryKey = "SYSTEM_SECURITY";

export interface NotificationPreferences {
  channels: ChannelToggles;
  categories: Record<NotificationCategoryKey, ChannelToggles>;
}

/**
 * A PATCH body. Send only what changed — anything omitted keeps its stored
 * value, including the other channel in the same row.
 *
 * A body that would change nothing (`{}`, `{ channels: {} }`, a category with
 * no toggles) is a 400, so callers must always name at least one switch.
 */
export interface NotificationPreferencesPatch {
  channels?: Partial<ChannelToggles>;
  categories?: Partial<
    Record<NotificationCategoryKey, Partial<ChannelToggles>>
  >;
}

/**
 * Returns both channel states and all seven categories, with defaults filled
 * in for anything this staff member has never changed — so there is no empty
 * case to handle, one call renders the page.
 */
export const getNotificationPreferences = async () => {
  try {
    const response = await AxiosInstance.get(
      "/api/erp/me/notification-preferences",
    );
    return {
      success: true,
      data: response.data as NotificationPreferences,
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
 * Saves one change. The response is the full updated state in the same shape
 * as the GET, so it drops straight into the cache without a refetch.
 */
export const updateNotificationPreferences = async (
  payload: NotificationPreferencesPatch,
) => {
  try {
    const response = await AxiosInstance.patch(
      "/api/erp/me/notification-preferences",
      payload,
    );
    return {
      success: true,
      data: response.data as NotificationPreferences,
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
 * Applies a patch the way the backend does — omitted fields keep their value.
 * Used to move the switches optimistically before the response lands.
 */
export const mergeNotificationPreferences = (
  current: NotificationPreferences,
  patch: NotificationPreferencesPatch,
): NotificationPreferences => {
  const categories = { ...current.categories };

  for (const [key, toggles] of Object.entries(patch.categories ?? {})) {
    const category = key as NotificationCategoryKey;
    categories[category] = { ...categories[category], ...toggles };
  }

  return {
    channels: { ...current.channels, ...patch.channels },
    categories,
  };
};
