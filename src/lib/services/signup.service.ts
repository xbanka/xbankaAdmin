import { signupAction } from "@/lib/actions/actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleApiError } from "../errors/handleApiError";
import { SignupFormData } from "../schema/signup.schema";

export const useSignup = () => {
//   const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: SignupFormData) => signupAction(data),
    onSuccess: (result) => {
        toast.success(result.data.message)
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
  return mutate;
};
