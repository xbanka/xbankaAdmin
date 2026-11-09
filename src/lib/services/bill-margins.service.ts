import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getBillMarginHistory,
  getBillMargins,
  updateBillMargin,
} from "../actions/bill-margins";
import { handleApiError } from "../errors/handleApiError";
import {
  BillProduct,
  UpdateBillMarginPayload,
} from "../types/bill-margins-types";
import { normalizeHistory, normalizeMargins } from "../utils/bill-margins";

export const BILL_MARGINS_KEY = ["bill-margins"] as const;
export const BILL_MARGIN_HISTORY_KEY = ["bill-margin-history"] as const;

// Super Admin only: the backend answers 403 to anyone else, so callers pass
// `enabled: false` for other roles and no request is made.
export const useGetBillMargins = (enabled = true) =>
  useQuery({
    queryKey: BILL_MARGINS_KEY,
    queryFn: getBillMargins,
    select: normalizeMargins,
    enabled,
  });

export const useGetBillMarginHistory = (
  page: number,
  product?: BillProduct,
  enabled = true,
) =>
  useQuery({
    queryKey: [...BILL_MARGIN_HISTORY_KEY, product ?? "ALL", page],
    queryFn: () => getBillMarginHistory(page, product),
    select: (body: unknown) => normalizeHistory(body, page),
    enabled,
  });

// A saved change adds a history entry, so both lists refetch.
const useInvalidateBillMargins = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: BILL_MARGINS_KEY });
    queryClient.invalidateQueries({ queryKey: BILL_MARGIN_HISTORY_KEY });
  };
};

export const useUpdateBillMargin = () => {
  const invalidate = useInvalidateBillMargins();
  return useMutation({
    mutationFn: ({
      product,
      payload,
    }: {
      product: BillProduct;
      payload: UpdateBillMarginPayload;
    }) => updateBillMargin(product, payload),
    onSuccess: (data) => {
      invalidate();
      toast.success(data?.message || "Bill margin updated");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};
