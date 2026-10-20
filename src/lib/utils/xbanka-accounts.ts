import type {
  AccountLookupResult,
  CreateXbankaAccountPayload,
  DeleteXbankaAccountResult,
  FundingBank,
  UpdateXbankaAccountPayload,
  XbankaAccount,
} from "../types/xbanka-account-types";
import { normaliseBankName } from "../actions/bank-logos";

/** The accounts list is `{ data: { items } }`; tolerate a bare `{ items }` or array too. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractXbankaAccounts(body: any): XbankaAccount[] {
  const candidates = [body?.data?.items, body?.items, body?.data, body];
  return candidates.find(Array.isArray) ?? [];
}

/** The banks list is `{ data: [...] }` with no items wrapper. Codes stay strings. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractFundingBanks(body: any): FundingBank[] {
  const rows = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
  return rows
    .filter((b: FundingBank) => b?.name && b?.code !== undefined && b?.code !== null)
    .map((b: FundingBank) => ({ name: b.name, code: String(b.code) }))
    .sort((a: FundingBank, b: FundingBank) => a.name.localeCompare(b.name));
}

/**
 * Lookup returns `data` as an array even for one account. An empty array
 * (or an entry with no name) means "not found", the same as an error.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractLookupResult(body: any): AccountLookupResult | null {
  const first = Array.isArray(body?.data) ? body.data[0] : Array.isArray(body) ? body[0] : null;
  return first?.account_name ? first : null;
}

/** Created/updated account, unwrapped from the `{ data }` envelope. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractXbankaAccount = (body: any): XbankaAccount | null =>
  body?.data?.id ? body.data : body?.id ? body : null;

/** Primary first, then visible, then hidden; oldest first within each group. */
export function sortXbankaAccounts(accounts: XbankaAccount[]) {
  const rank = (a: XbankaAccount) => (a.isPrimary ? 0 : a.isActive ? 1 : 2);
  return [...accounts].sort(
    (a, b) => rank(a) - rank(b) || a.createdAt.localeCompare(b.createdAt),
  );
}

export const isTenDigits = (value: string) => /^\d{10}$/.test(value);

export interface XbankaAccountFormValues {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
}

export function buildCreatePayload(
  values: XbankaAccountFormValues,
  updatedBy: string,
): CreateXbankaAccountPayload {
  return {
    bankName: values.bankName.trim(),
    bankCode: values.bankCode.trim(),
    accountNumber: values.accountNumber.trim(),
    accountName: values.accountName.trim(),
    isPrimary: values.isPrimary,
    updatedBy,
  };
}

const EDITABLE_FIELDS = ["bankName", "bankCode", "accountNumber", "accountName"] as const;

/**
 * Only the fields the user actually changed, per the backend contract.
 * Returns null when nothing changed, since a PATCH with only updatedBy is a
 * 422 ("Provide at least one field to update").
 */
export function buildUpdatePayload(
  original: XbankaAccount,
  values: XbankaAccountFormValues,
  updatedBy: string,
): UpdateXbankaAccountPayload | null {
  const payload: UpdateXbankaAccountPayload = { updatedBy };
  let changed = false;

  for (const field of EDITABLE_FIELDS) {
    const next = values[field].trim();
    if (next !== original[field]) {
      payload[field] = next;
      changed = true;
    }
  }

  return changed ? payload : null;
}

/**
 * Hiding the primary or the last visible account could leave customers with
 * nothing to pay into, so those need an explicit confirmation.
 */
export function hideRisk(account: XbankaAccount, all: XbankaAccount[]): "primary" | "last" | null {
  if (!account.isActive) return null;
  if (account.isPrimary) return "primary";
  const otherActive = all.some((a) => a.id !== account.id && a.isActive);
  return otherActive ? null : "last";
}

/** Logo by bank code first, then by normalised name. */
export function findBankLogo(
  index: Map<string, string> | undefined,
  bankCode?: string,
  bankName?: string,
): string | undefined {
  if (!index) return undefined;
  return (bankCode && index.get(bankCode)) || index.get(normaliseBankName(bankName)) || undefined;
}

/** "Guaranty Trust Bank" -> "GT", "OPay" -> "OP", "" -> "?". */
export function bankInitials(name?: string) {
  const words = (name || "").replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  const meaningful = words.filter((w) => !/^(bank|plc|ltd|limited|of|the|nigeria)$/i.test(w));
  const source = meaningful.length ? meaningful : words;
  if (source.length === 0) return "?";
  if (source.length === 1) return source[0].slice(0, 2).toUpperCase();
  return (source[0][0] + source[1][0]).toUpperCase();
}

/**
 * When the core backend rejects a request, this backend returns its status
 * code with the core's whole response body as a JSON *string* in `detail`
 * (e.g. '{"message":"The primary (default) account cannot be deleted...",...}'),
 * and the shared axios interceptor surfaces that string as the error message.
 * Show the inner `message`; anything that isn't such JSON is shown as-is.
 */
export function parseBackendMessage(message: unknown): string {
  if (typeof message !== "string") return "Something went wrong";
  const text = message.trim();
  if (text.startsWith("{")) {
    try {
      const inner = JSON.parse(text)?.message;
      if (typeof inner === "string" && inner.trim()) return inner;
    } catch {
      // Not JSON after all: fall through and show it unchanged.
    }
  }
  return text || "Something went wrong";
}

/** "5555500001" -> "••••0001" */
export const maskAccountNumber = (accountNumber: string) =>
  `••••${(accountNumber ?? "").slice(-4)}`;

/** data of the delete response, unwrapped from the `{ data }` envelope. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractDeleteResult(body: any): DeleteXbankaAccountResult | null {
  const result = body?.data?.deleted !== undefined ? body.data : body?.deleted !== undefined ? body : null;
  return result?.deleted === true ? result : null;
}

/**
 * Deleting the only visible account would leave customers nothing to pay
 * into. (The primary can't be deleted at all, so this only matters for a
 * visible non-primary account when every other account is hidden.)
 */
export const isLastVisibleAccount = (account: XbankaAccount, all: XbankaAccount[]) =>
  account.isActive && !all.some((a) => a.id !== account.id && a.isActive);
