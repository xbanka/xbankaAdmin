import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutAction } from "../actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiError } from "../errors/handleApiError";
import { authToken } from "../authToken";


export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutAction(),
    onSuccess: (result) => {
      authToken.remove();
      queryClient.removeQueries({ queryKey: ["userProfile"] });
      router.push("/signin");
      toast.success(result.data.message)
    },
    onError: (err) => {
     handleApiError(err);
    },
  });
};