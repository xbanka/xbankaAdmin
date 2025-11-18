import { SignupFormData } from "@/components/layout/signup-form";
import { signupAction } from "@/lib/actions/actions";
import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

// interface CreateProfileResponse {
//   message: string;
//   user: {
//     email: string;
//     first_name: string;
//     last_name: string;
//   };
// }

export const useSignup = () => {
//   const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: SignupFormData) => signupAction(data),
    onSuccess: (result) => {
        console.log("signup", result.data)
        toast.success(result.data.message)
    //   router.push("/auth/verify");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutate;
};
