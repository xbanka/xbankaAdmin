import { useMutation } from "@tanstack/react-query";
import { logoutAction } from "../actions/actions";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { handleApiError } from "../errors/handleApiError";
import { authToken } from "../authToken";


export const useLogout = () => {
  const clearUser = useUserStore((s) => s.clearUser);
  const router = useRouter();
  return useMutation({
    mutationFn: () => logoutAction(),
    onSuccess: (result) => {
      clearUser();
      authToken.remove();
      router.push("/signin");
      toast.success(result.data.message)
    },
    onError: (err) => {
     handleApiError(err);
    },
  });
};