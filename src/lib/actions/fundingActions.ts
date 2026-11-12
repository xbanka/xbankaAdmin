import AxiosInstance from "../Axiosinstance/axiosInstance";
import type {
  CompleteFundingIntentPayload,
  DirectCreditPayload,
  RejectFundingIntentPayload,
} from "../types/funding-types";
import { buildIntentParams, type FundingIntentQuery } from "../utils/funding";

const BASE = "/api/transactions/funding";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toActionError = (error: any) => ({
  success: false,
  status: error.status,
  message: error.message,
});

/**
 * GET /api/transactions/funding/intents
 *
 * With no status the backend returns PENDING. `accountNumber` must be exactly
 * 10 digits or it 422s, so buildIntentParams drops anything shorter.
 */
export const getFundingIntents = async ({ page = 1, limit = 10, ...rest }: FundingIntentQuery = {}) => {
  try {
    const response = await AxiosInstance.get(`${BASE}/intents`, {
      params: buildIntentParams({ ...rest, page, limit }),
    });
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};

/**
 * POST /api/transactions/funding/intents/{transactionId}/complete
 *
 * Credits the customer's NGN wallet. Safe to retry: a repeat comes back
 * with `duplicate: true` instead of crediting twice.
 */
export const completeFundingIntent = async ({
  transactionId,
  payload,
}: {
  transactionId: string;
  payload: CompleteFundingIntentPayload;
}) => {
  try {
    const response = await AxiosInstance.post(
      `${BASE}/intents/${transactionId}/complete`,
      payload,
    );
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};

/**
 * POST /api/transactions/funding/intents/{transactionId}/reject
 *
 * Marks the intent FAILED. The wallet is untouched and the reason stays internal.
 */
export const rejectFundingIntent = async ({
  transactionId,
  payload,
}: {
  transactionId: string;
  payload: RejectFundingIntentPayload;
}) => {
  try {
    const response = await AxiosInstance.post(
      `${BASE}/intents/${transactionId}/reject`,
      payload,
    );
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};

/**
 * GET /api/transactions/funding/lookup
 *
 * Finds the customer who registered the sending account. Answers with an
 * array (the same number can exist at several banks). `accountNumber` must
 * be exactly 10 digits or it 422s; `bankCode` narrows to one bank.
 */
export const lookupFundingCustomer = async ({
  accountNumber,
  bankCode,
}: {
  accountNumber: string;
  bankCode?: string;
}) => {
  try {
    const response = await AxiosInstance.get(`${BASE}/lookup`, {
      params: { accountNumber, ...(bankCode ? { bankCode } : {}) },
    });
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};

/**
 * POST /api/transactions/funding/credit
 *
 * Credits the customer's NGN wallet with no funding intent. The bank
 * reference is the idempotency key, so a retry after a timeout cannot
 * double-credit: it comes back with `duplicate: true`. A 409 means the
 * reference was already used with different details and must not be retried.
 */
export const creditFundingDirectly = async (payload: DirectCreditPayload) => {
  try {
    const response = await AxiosInstance.post(`${BASE}/credit`, payload);
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};

/**
 * POST /api/transactions/funding/attachments
 *
 * The form field must be called `file`. Proof uploads happen before
 * complete; the returned URLs go out as `attachmentUrls`.
 */
export const uploadFundingAttachment = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await AxiosInstance.post(`${BASE}/attachments`, formData, {
      // Let the browser set the multipart boundary; the shared instance
      // otherwise pins application/json for every request.
      headers: { "Content-Type": "multipart/form-data" },
      // Receipts on a slow connection can outlast the shared 10s timeout.
      timeout: 60_000,
    });
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};
