import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { handleApiError } from "../errors/handleApiError";
import {
  ChangePasswordPayload,
  NotificationPreferences,
  NotificationPreferencesPatch,
  UpdateProfilePayload,
  changePassword,
  getNotificationPreferences,
  mergeNotificationPreferences,
  updateNotificationPreferences,
  updateProfile,
  uploadProfilePicture,
} from "../actions/settingsActions";

/** Key the profile query is cached under, so edits can refresh it. */
const PROFILE_QUERY_KEY = ["userProfile"] as const;

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (result) => {
      toast.success("Profile updated");
      // The PATCH answers with the full updated profile, so it drops straight
      // into the cache — no refetch, and no window for a stale GET to land.
      queryClient.setQueryData(PROFILE_QUERY_KEY, result);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfilePicture(file),
    onSuccess: (result) => {
      toast.success("Profile picture updated");
      // Same shape as the profile GET, fresh signed avatar URL included.
      queryClient.setQueryData(PROFILE_QUERY_KEY, result);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      toast.success("Password changed");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

/* ------------------------------------------------------------------ *
 * Notification preferences
 * ------------------------------------------------------------------ */

export const NOTIFICATION_PREFERENCES_QUERY_KEY = [
  "notificationPreferences",
] as const;

/** What the query caches: the action's wrapper around the full state. */
type PreferencesResult = {
  success: boolean;
  data: NotificationPreferences;
  status: number;
};

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: NOTIFICATION_PREFERENCES_QUERY_KEY,
    queryFn: getNotificationPreferences,
  });
};

/**
 * Saves a single switch.
 *
 * The switch moves immediately and the response replaces the cache, so a
 * normal click costs no refetch. Two wrinkles are worth the bookkeeping:
 *
 *   - Every PATCH answers with the *whole* object, so if two are in flight
 *     and the replies land out of order, the older one would visibly revert
 *     the newer toggle. Only the last reply outstanding is applied.
 *   - A failure mid-burst can't be undone by snapshot alone without wiping
 *     the other optimistic changes, so it defers to a refetch once the burst
 *     finishes. A lone failure rolls straight back, which is instant.
 */
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  /** PATCHes started but not yet answered. */
  const pending = useRef(0);
  /** Something failed mid-burst — resync from the server when it settles. */
  const stale = useRef(false);

  return useMutation({
    mutationFn: (payload: NotificationPreferencesPatch) =>
      updateNotificationPreferences(payload),

    onMutate: async (payload) => {
      pending.current += 1;

      // Stop an in-flight GET from landing on top of the optimistic state.
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_PREFERENCES_QUERY_KEY,
      });

      const previous = queryClient.getQueryData<PreferencesResult>(
        NOTIFICATION_PREFERENCES_QUERY_KEY,
      );

      if (previous?.data) {
        queryClient.setQueryData<PreferencesResult>(
          NOTIFICATION_PREFERENCES_QUERY_KEY,
          {
            ...previous,
            data: mergeNotificationPreferences(previous.data, payload),
          },
        );
      }

      return { previous };
    },

    onSuccess: (result) => {
      pending.current -= 1;
      // A newer PATCH is still out; its reply is the authoritative one.
      if (pending.current > 0) return;

      if (stale.current) {
        stale.current = false;
        queryClient.invalidateQueries({
          queryKey: NOTIFICATION_PREFERENCES_QUERY_KEY,
        });
        return;
      }

      queryClient.setQueryData(NOTIFICATION_PREFERENCES_QUERY_KEY, result);
    },

    onError: (err, _payload, context) => {
      pending.current -= 1;

      if (pending.current > 0) {
        // Rolling back now would discard the other in-flight changes too.
        stale.current = true;
      } else if (stale.current || !context?.previous) {
        stale.current = false;
        queryClient.invalidateQueries({
          queryKey: NOTIFICATION_PREFERENCES_QUERY_KEY,
        });
      } else {
        queryClient.setQueryData(
          NOTIFICATION_PREFERENCES_QUERY_KEY,
          context.previous,
        );
      }

      // Throws, so it stays last — anything after it would not run.
      handleApiError(err);
    },
  });
};
