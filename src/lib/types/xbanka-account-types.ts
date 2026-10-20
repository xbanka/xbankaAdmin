/**
 * Xbanka's own receiving bank accounts: the ones customers are shown in the
 * web app's Add Fund > Bank Transfer flow and declare transfers against.
 */
export interface XbankaAccount {
  id: string;
  bankName: string;
  /** Always a string; keep leading zeros ("044", not 44). */
  bankCode: string;
  accountNumber: string;
  accountName: string;
  /** false = hidden from customers. */
  isActive: boolean;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  /** Email of whoever last changed it ("migration" for the seeded account). */
  updatedBy: string;
}

/** Body of POST /api/transactions/funding/xbanka-accounts. */
export interface CreateXbankaAccountPayload {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isPrimary?: boolean;
  updatedBy: string;
}

/**
 * Body of PATCH /api/transactions/funding/xbanka-accounts/{id}. Only changed
 * fields are sent; a body with nothing but updatedBy is a 422.
 */
export interface UpdateXbankaAccountPayload {
  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  updatedBy: string;
}

/** One entry from GET /api/transactions/funding/banks (note: name/code, not bankName/bankCode). */
export interface FundingBank {
  name: string;
  code: string;
}

/** data[0] of POST /api/transactions/funding/accounts/lookup (snake_case). */
export interface AccountLookupResult {
  account_number: string;
  account_name: string;
  bank_code: string;
  bank_name: string;
}

/** data of DELETE /api/transactions/funding/xbanka-accounts/{id}. */
export interface DeleteXbankaAccountResult {
  deleted: boolean;
  id: string;
  bankName: string;
  accountNumber: string;
  /** Accounts left after the delete. */
  remaining: number;
}
