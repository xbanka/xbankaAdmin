import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createXbankaAccount,
  deleteXbankaAccount,
  getFundingBanks,
  getXbankaAccounts,
  lookupFundingAccount,
  updateXbankaAccount,
} from "../actions/xbankaAccountActions";
import { getBankLogos } from "../actions/bank-logos";
import { handleApiError } from "../errors/handleApiError";
import type {
  CreateXbankaAccountPayload,
  UpdateXbankaAccountPayload,
} from "../types/xbanka-account-types";
import {
  extractDeleteResult,
  extractFundingBanks,
  extractLookupResult,
  extractXbankaAccounts,
  isTenDigits,
  maskAccountNumber,
  sortXbankaAccounts,
} from "../utils/xbanka-accounts";

export const XBANKA_ACCOUNTS_QUERY_KEY = ["xbanka-accounts"] as const;
const DAY = 1000 * 60 * 60 * 24;

export function useXbankaAccounts({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: XBANKA_ACCOUNTS_QUERY_KEY,
    enabled,
    queryFn: async () => sortXbankaAccounts(extractXbankaAccounts((await getXbankaAccounts()).data)),
  });
}

/**
 * Every add/update refetches the whole list. Making one account primary also
 * demotes the previous primary, which the response doesn't show, so local
 * patching would leave two "Primary" badges.
 */
function useXbankaAccountMutation<TVars>(
  mutationFn: (vars: TVars) => Promise<unknown>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: XBANKA_ACCOUNTS_QUERY_KEY }),
    // handleApiError rethrows, which stops react-query before onSettled runs,
    // so the failure-path refetch (a 409 means the list on screen is stale)
    // has to happen here, ahead of it.
    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: XBANKA_ACCOUNTS_QUERY_KEY });
      handleApiError(err);
    },
  });
}

export function useCreateXbankaAccount() {
  return useXbankaAccountMutation(async (payload: CreateXbankaAccountPayload) => {
    const result = await createXbankaAccount(payload);
    toast.success("Account added. Customers can now pay into it.");
    return result;
  });
}

/** Edit, hide/show and make primary all go through this one PATCH. */
export function useUpdateXbankaAccount() {
  return useXbankaAccountMutation(
    async (vars: { accountId: string; payload: UpdateXbankaAccountPayload; successMessage: string }) => {
      const result = await updateXbankaAccount(vars);
      toast.success(vars.successMessage);
      return result;
    },
  );
}

/**
 * Permanent delete. Refetches on success and on failure (a 404 or a "primary
 * can't be deleted" rejection both mean the list on screen is stale).
 */
export function useDeleteXbankaAccount() {
  return useXbankaAccountMutation(
    async (vars: { accountId: string; deletedBy: string; bankName: string; accountNumber: string }) => {
      const response = await deleteXbankaAccount(vars);
      const result = extractDeleteResult(response.data);
      const bank = result?.bankName ?? vars.bankName;
      const masked = maskAccountNumber(result?.accountNumber ?? vars.accountNumber);
      toast.success(`Deleted ${bank} ${masked}.`);
      if (result && result.remaining <= 1) {
        toast.warning(
          result.remaining === 0
            ? "No Xbanka accounts are left. Customers have nowhere to send bank transfers."
            : "Only one Xbanka account is left.",
          { duration: 6000 },
        );
      }
      return result;
    },
  );
}

/** Bank dropdown. Fetched when the form opens and cached; it rarely changes. */
export function useFundingBanks({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["funding-banks"],
    enabled,
    staleTime: DAY,
    gcTime: DAY,
    queryFn: async () => extractFundingBanks((await getFundingBanks()).data),
  });
}

/**
 * Resolves the account name once a bank is picked and exactly 10 digits are
 * entered, never on each keystroke. An empty result is treated as "not
 * found", the same as an error, since the backend's not-found status is
 * unconfirmed.
 */
export function useAccountLookup(bankCode: string, accountNumber: string) {
  const ready = !!bankCode && isTenDigits(accountNumber);
  return useQuery({
    queryKey: ["funding-account-lookup", bankCode, accountNumber],
    enabled: ready,
    retry: false,
    staleTime: DAY,
    queryFn: async () => {
      const result = extractLookupResult((await lookupFundingAccount({ accountNumber, bankCode })).data);
      if (!result) throw { success: false, message: "No account found for this bank and number." };
      return result;
    },
  });
}

/**
 * Bank logos keyed by CBN code and normalised name. Cached aggressively — the
 * list changes rarely and every consumer falls back to an initials badge, so a
 * stale or failed fetch is never user-visible as an error.
 */
export function useBankLogos() {
  return useQuery({
    queryKey: ["bank-logos"],
    queryFn: getBankLogos,
    staleTime: DAY,
    gcTime: DAY,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
