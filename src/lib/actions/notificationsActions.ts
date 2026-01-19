import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getNotifications = async () => {
  try {
    const response = await AxiosInstance.get(`/api/erp/notifications`);
    return {
      success: true,
      data: response.data, // ✅ only return actual payload
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

export const markAsReadNotification = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const response = await AxiosInstance.patch(`/api/erp/notifications/${id}/mark-as-read`);

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

export const getPayouts = async ({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: string | null;
}) => {
  try {
    const response = await AxiosInstance.get(`/api/erp/payouts`, {
      params: {
        page,
        limit,
        status,
      },
    });

    return {
      success: true,
      data: response.data.data,  // array of payouts
      page: response.data.page,
      limit: response.data.limit,
      total: response.data.total,
      pages: response.data.pages,
      statusCode: response.status,
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