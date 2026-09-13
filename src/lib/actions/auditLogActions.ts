import AxiosInstance from "../Axiosinstance/axiosInstance";

export interface GetAuditLogParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getRoleChangeLogs = async ({
  status,
  search,
  page = 1,
  limit = 10,
}: GetAuditLogParams = {}) => {
  try {
    const response = await AxiosInstance.get(`/api/audit/role-changes`);

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
    const response = await AxiosInstance.get(`/api/audit/logins`);

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

export const confirmRoleChange = async ({ id }: { id: string }) => {
  try {
    const response = await AxiosInstance.post(
      `/api/erp/audit/role-changes/${id}/confirm`,
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
