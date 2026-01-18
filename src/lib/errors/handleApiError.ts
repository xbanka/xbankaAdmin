import { toast } from "sonner";
import { ApiError } from "../types/errorTypes";

export function handleApiError(error: unknown): ApiError {
  const err = error as ApiError;

  toast.error(err.message || "Something went wrong", {
    duration: 3000,
  });

  throw err;
}
