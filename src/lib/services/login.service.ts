import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginAction } from "../actions/actions";
import { forgotPasswordTypes, loginTypes } from "../actions/actionTypes";
import { handleApiError } from "../errors/handleApiError";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthState";
import { authToken } from "../authToken";
import { forgotPasswordErp } from "../actions/passwordActions";
import { LoginResponse } from "../types/two-factor-types";

/**
 * Turns an access token into a signed-in session. Shared by the password
 * step (no 2FA) and the code step (2FA), so both land the user identically.
 */
export const useCompleteLogin = () => {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const queryClient = useQueryClient();

  return (accessToken: string) => {
    toast.success("Logged in successfully");
    queryClient.removeQueries({ queryKey: ["userProfile"] });
    login(accessToken);
    authToken.set(accessToken);
    router.push("/");
  };
};

/**
 * Password step. When the account has 2FA on, the server answers with an
 * `mfa_token` and no session — nothing is stored, and `onMfaRequired` hands
 * the token to the form so it can show the code screen. The token stays in
 * component memory only, never cookies or localStorage.
 */
export const useLogin = ({
  onMfaRequired,
}: { onMfaRequired?: (mfaToken: string) => void } = {}) => {
  const completeLogin = useCompleteLogin();
  return useMutation({
    mutationFn: (data: loginTypes) => loginAction(data),
    onSuccess: (result) => {
      const body = result.data as LoginResponse;
      if (body.mfa_required) {
        onMfaRequired?.(body.mfa_token);
        return;
      }
      completeLogin(body.access_token);
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: forgotPasswordTypes) => forgotPasswordErp(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
