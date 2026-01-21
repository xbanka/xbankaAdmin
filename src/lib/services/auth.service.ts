import { useMutation } from "@tanstack/react-query";
import { superAdminSignup } from "../actions/actions";
import { toast } from "sonner";
import { handleApiError } from "../errors/handleApiError";

export const useSuperAdminSignup = () => {
  return useMutation({
    mutationFn: superAdminSignup,

    onSuccess: () => {
      toast.success("Super admin account created successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};