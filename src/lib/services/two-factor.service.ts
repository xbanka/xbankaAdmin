import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { handleApiError } from "../errors/handleApiError";
import {
  disable2fa,
  enable2fa,
  regenerateRecoveryCodes,
  resetStaff2fa,
  start2faSetup,
  verifyLogin2fa,
} from "../actions/twoFactorActions";
import {
  CodePayload,
  Disable2faPayload,
  Login2faPayload,
} from "../types/two-factor-types";
import { Profile } from "../types/staffTypes";
import { PROFILE_QUERY_KEY } from "./profile.service";
import { useCompleteLogin } from "./login.service";

/**
 * Code-entry mutations don't toast on error: the screen classifies the
 * failure (`classifyCodeError`) and shows it next to the field it's about.
 */

type ProfileResult = { success: boolean; data: Profile; status: number };

/** Flips `totp_enabled` in the cached profile so Settings updates at once. */
const useSetTotpEnabled = () => {
  const queryClient = useQueryClient();
  return (enabled: boolean) =>
    queryClient.setQueryData<ProfileResult>(PROFILE_QUERY_KEY, (previous) =>
      previous
        ? { ...previous, data: { ...previous.data, totp_enabled: enabled } }
        : previous,
    );
};

export const useVerifyLogin2fa = () => {
  const completeLogin = useCompleteLogin();
  return useMutation({
    mutationFn: (payload: Login2faPayload) => verifyLogin2fa(payload),
    onSuccess: (result) => completeLogin(result.data.access_token),
  });
};

export const useStart2faSetup = () =>
  useMutation({ mutationFn: () => start2faSetup() });

export const useEnable2fa = () => {
  const setTotpEnabled = useSetTotpEnabled();
  return useMutation({
    mutationFn: (payload: CodePayload) => enable2fa(payload),
    onSuccess: () => setTotpEnabled(true),
  });
};

export const useDisable2fa = () => {
  const setTotpEnabled = useSetTotpEnabled();
  return useMutation({
    mutationFn: (payload: Disable2faPayload) => disable2fa(payload),
    onSuccess: () => {
      toast.success("Two-factor authentication disabled");
      setTotpEnabled(false);
    },
  });
};

export const useRegenerateRecoveryCodes = () =>
  useMutation({
    mutationFn: (payload: CodePayload) => regenerateRecoveryCodes(payload),
  });

/** Used when the server says our cached `totp_enabled` is wrong. */
export const useRefreshProfile = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
};

export const useResetStaff2fa = () =>
  useMutation({
    mutationFn: (staffId: string) => resetStaff2fa(staffId),
    onSuccess: (result) => {
      toast.success(result.data.message || "Two-factor authentication reset.");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
