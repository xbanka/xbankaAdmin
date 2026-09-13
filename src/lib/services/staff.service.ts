import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleApiError } from "../errors/handleApiError";
import {
  deleteStaff,
  getAllStaff,
  getStaff,
  inviteStaff,
  updateStaffRolesPermissions,
  UpdateStaffRolesPermissionsPayload,
  updateStaffPermissions,
  UpdateStaffPermissionsPayload,
} from "../actions/staff";
import { toast } from "sonner";
import { StaffPayload } from "../types/staffTypes";

export const useGetAllStaff = () => {
  return useQuery({
    queryKey: ["getAllStaff"],
    queryFn: getAllStaff,
  });
};

export const useGetStaff = (role: string) => {
  return useQuery({
    queryKey: ["getStaff", role],
    queryFn: () => getStaff(role),
  });
};

export const useInviteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StaffPayload) => inviteStaff(payload),
    onSuccess: async() => {
      toast.success("Staff invited successfully");
      await queryClient.invalidateQueries({
        queryKey: ["getStaff"],
      });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: string) => deleteStaff(payload),
    onSuccess: () => {
      toast.success("Staff deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["getAllStaff"],
      });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useUpdateStaffRolesPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      payload,
    }: {
      staffId: string;
      payload: UpdateStaffRolesPermissionsPayload;
    }) => updateStaffRolesPermissions(staffId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllStaff"],
      });

      toast.success("Staff role and permissions updated successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useUpdateStaffPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      payload,
    }: {
      staffId: string;
      payload: UpdateStaffPermissionsPayload;
    }) => updateStaffPermissions(staffId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllStaff"],
      });

      toast.success("Staff permissions updated successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};