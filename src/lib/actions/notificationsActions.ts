import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getNotifications = async () => {
  try {
    const response = await AxiosInstance.get(`/api/erp/notifications`);
    console.log(response.data)
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