import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  completeFundingIntent,
  creditFundingDirectly,
  getFundingIntents,
  lookupFundingCustomer,
  rejectFundingIntent,
  uploadFundingAttachment,
} from "../actions/fundingActions";
import { handleApiError } from "../errors/handleApiError";
import type {
  CompleteFundingIntentPayload,
  DirectCreditPayload,
  DirectCreditResult,
  RejectFundingIntentPayload,
} from "../types/funding-types";
import {
  buildIntentParams,
  extractAttachmentUrl,
  extractIntentsPage,
  extractLookupMatches,
  isAccountNumber,
  isDuplicateResult,
  unwrapSettleResult,
  type FundingIntentQuery,
} from "../utils/funding";

export const FUNDING_INTENTS_QUERY_KEY = ["funding-intents"] as const;

export function useGetFundingIntents({
  enabled = true,
  ...query
}: FundingIntentQuery & { enabled?: boolean } = {}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  // Key on the params actually sent, so typing digits 1-9 of an account
  // number doesn't refetch the same unfiltered page nine times.
  const params = buildIntentParams({ ...query, page, limit });

  return useQuery({
    queryKey: [...FUNDING_INTENTS_QUERY_KEY, params],
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await getFundingIntents({ ...query, page, limit });
      return extractIntentsPage(response.data, limit);
    },
  });
}

/**
 * A 409 on complete/reject means the bank reference was already used or
 * someone else settled this intent first. Either way the row on screen is
 * stale, so refetch before surfacing the server's message.
 */
function settleErrorHandler(queryClient: ReturnType<typeof useQueryClient>) {
  return (err: unknown) => {
    if ((err as { status?: number })?.status === 409) {
      queryClient.invalidateQueries({ queryKey: FUNDING_INTENTS_QUERY_KEY });
    }
    handleApiError(err);
  };
}

export function useCompleteFundingIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { transactionId: string; payload: CompleteFundingIntentPayload }) =>
      unwrapSettleResult((await completeFundingIntent(vars)).data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: FUNDING_INTENTS_QUERY_KEY });
      // A retried request is a success that credited nothing new; never
      // show a second "credited" toast for it.
      if (isDuplicateResult(result)) {
        toast.info("This request was already completed. No second credit was made.");
        return;
      }
      toast.success("Wallet credited and request completed.");
    },
    onError: settleErrorHandler(queryClient),
  });
}

export function useRejectFundingIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { transactionId: string; payload: RejectFundingIntentPayload }) =>
      unwrapSettleResult((await rejectFundingIntent(vars)).data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: FUNDING_INTENTS_QUERY_KEY });
      if (isDuplicateResult(result)) {
        toast.info("This request was already rejected.");
        return;
      }
      toast.success("Funding request rejected.");
    },
    onError: settleErrorHandler(queryClient),
  });
}

export const FUNDING_LOOKUP_QUERY_KEY = ["funding-lookup"] as const;

/**
 * Who registered this sending account? Runs only for a full 10-digit number
 * (the backend 422s on anything else). Customer details are not kept around
 * after the modal closes (gcTime 0) and never retried automatically, so a
 * failure shows straight away with an explicit Retry.
 */
export function useFundingLookup(accountNumber: string) {
  const account = accountNumber.trim();

  return useQuery({
    queryKey: [...FUNDING_LOOKUP_QUERY_KEY, account],
    enabled: isAccountNumber(account),
    retry: false,
    gcTime: 0,
    queryFn: async () => extractLookupMatches((await lookupFundingCustomer({ accountNumber: account })).data),
  });
}

/**
 * Credits a wallet with no intent. Deliberately no toast and no
 * handleApiError: the modal shows every failure inline, because each one
 * (retry, edit the reference, redo the lookup) needs a different next step.
 */
export function useCreditFundingDirectly() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DirectCreditPayload): Promise<DirectCreditResult> =>
      unwrapSettleResult((await creditFundingDirectly(payload)).data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUNDING_INTENTS_QUERY_KEY });
    },
  });
}

/** Uploads one proof file and resolves to its URL; rejects if none comes back. */
export async function uploadProofFile(file: File): Promise<string> {
  const response = await uploadFundingAttachment(file);
  const url = extractAttachmentUrl(response.data);
  if (!url) throw { success: false, message: `No URL returned for ${file.name}` };
  return url;
}
