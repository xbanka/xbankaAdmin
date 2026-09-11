import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { handleApiError } from "../errors/handleApiError";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
  changePassword,
  updateProfile,
  uploadProfilePicture,
} from "../actions/settingsActions";

/** Key the profile query is cached under, so edits can refresh it. */
const PROFILE_QUERY_KEY = ["userProfile"] as const;

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: async () => {
      toast.success("Profile updated");
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
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
    onSuccess: async () => {
      toast.success("Profile picture updated");
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
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
