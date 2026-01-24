import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "../errors/handleApiError"
import { getAllStaff, getStaff, inviteStaff } from "../actions/staff"
import { toast } from "sonner"
import { StaffPayload } from "../types/staffTypes"

export const useGetAllStaff = () => {
    return useQuery({
        queryKey: ["getAllStaff"],
        queryFn: async() => {
            try{
                const response = await getAllStaff()
                return response
            }catch(error){
                handleApiError(error)
            }
        }
    })
}

export const useGetStaff = (role: string) => {
    return useQuery({
        queryKey: ["getStaff"],
        queryFn: async() => {
            try{
                const response = await getStaff(role)
                return response
            }catch(error){
                handleApiError(error)
            }
        }
    })
}

export const useInviteStaff = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StaffPayload) => inviteStaff(payload),
    onSuccess: () => {
      toast.success("Staff invited successfully");
      queryClient.invalidateQueries({
        queryKey: ["getStaff"],
      });

    },
    onError: (err) => {
      handleApiError(err);
    },
  });
}