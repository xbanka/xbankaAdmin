import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginAction } from "../actions/actions";
import { forgotPasswordTypes, loginTypes } from "../actions/actionTypes";
import { handleApiError } from "../errors/handleApiError";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthState";
import { authToken } from "../authToken";
import { forgotPasswordErp } from "../actions/passwordActions";

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: loginTypes) => loginAction(data),
    onSuccess: (result) => {
      toast.success("Logged in successfully");
      queryClient.removeQueries({ queryKey: ["userProfile"] });
      login(result.data.access_token);
      const access_token = result.data.access_token;
      authToken.set(access_token);
      router.push("/");
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