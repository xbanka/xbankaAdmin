import AxiosInstance from "../Axiosinstance/axiosInstance";
import type {
  CreateXbankaAccountPayload,
  UpdateXbankaAccountPayload,
} from "../types/xbanka-account-types";

const BASE = "/api/transactions/funding";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toActionError = (error: any) => ({
  success: false,
  status: error.status,
  message: error.message,
});

/** GET /api/transactions/funding/xbanka-accounts — every account, hidden ones included. */
export const getXbankaAccounts = async () => {
  try {
    const response = await AxiosInstance.get(`${BASE}/xbanka-accounts`);
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};

/**
 * POST /api/transactions/funding/xbanka-accounts
 *
 * This backend answers 200 while the core backend answers 201; axios
 * resolves on any 2xx, so neither code is checked.
 */
export const createXbankaAccount = async (payload: CreateXbankaAccountPayload) => {
  try {
    const response = await AxiosInstance.post(`${BASE}/xbanka-accounts`, payload);
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};

/** PATCH /api/transactions/funding/xbanka-accounts/{accountId} — edit, hide/show, make primary. */
export const updateXbankaAccount = async ({
  accountId,
  payload,
}: {
  accountId: string;
  payload: UpdateXbankaAccountPayload;
}) => {
  try {
    const response = await AxiosInstance.patch(`${BASE}/xbanka-accounts/${accountId}`, payload);
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};

/** GET /api/transactions/funding/banks — `data` is the array itself, as { name, code }. */
export const getFundingBanks = async () => {
  try {
    const response = await AxiosInstance.get(`${BASE}/banks`);
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};

/**
 * POST /api/transactions/funding/accounts/lookup
 *
 * Resolves the registered account name. `data` is an array (read data[0])
 * and its fields are snake_case.
 */
export const lookupFundingAccount = async (body: { accountNumber: string; bankCode: string }) => {
  try {
    const response = await AxiosInstance.post(`${BASE}/accounts/lookup`, body);
    return { success: true, data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw toActionError(error);
  }
};
