import AxiosInstance from "../Axiosinstance/axiosInstance";

export interface GetAuditLogParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// The audit endpoints validate `status` as an enum, so `status=` (the "All
// status" filter) is rejected with a 422. Axios only drops undefined/null
// params, so blank strings are stripped here before the request goes out.
export const buildAuditLogParams = ({ status, search, page, limit }: GetAuditLogParams) => ({
  status: status?.trim() || undefined,
  search: search?.trim() || undefined,
  page,
  limit,
});

export const getRoleChangeLogs = async ({
  status,
  search,
  page = 1,
  limit = 10,
}: GetAuditLogParams = {}) => {
  try {
    const response = await AxiosInstance.get(`/api/audit/role-changes`, {
      params: buildAuditLogParams({ status, search, page, limit }),
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw {
      success: false,
      status: error.status,
      message: error.message,
    };
  }
};

export const getLoginLogs = async ({
  status,
  search,
  page = 1,
  limit = 10,
}: GetAuditLogParams = {}) => {
  try {
    const response = await AxiosInstance.get(`/api/audit/logins`, {
      params: buildAuditLogParams({ status, search, page, limit }),
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw {
      success: false,
      status: error.status,
      message: error.message,
    };
  }
};

export interface GetFundingIntentAuditParams extends GetAuditLogParams {
  action?: string;
}

export const getFundingIntentAuditLogs = async ({
  action,
  status,
  search,
  page = 1,
  limit = 10,
}: GetFundingIntentAuditParams = {}) => {
  try {
    const response = await AxiosInstance.get(`/api/audit/funding-intents`, {
      params: {
        ...buildAuditLogParams({ status, search, page, limit }),
        action: action?.trim() || undefined,
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw {
      success: false,
      status: error.status,
      message: error.message,
    };
  }
};

export const confirmRoleChange =async ({ id }: { id: string }) => {
  try {
    const response = await AxiosInstance.post(
      `/api/audit/role-changes/${id}/confirm`,
    );

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw {
      success: false,
      status: error.status,
      message: error.message,
    };
  }
};
