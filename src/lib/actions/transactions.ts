import AxiosInstance from "../Axiosinstance/axiosInstance";


/**
 * GET /api/transactions/all
 */
export const getAllTransactionsAction = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  const response = await AxiosInstance.get("/api/transactions/all", {
    params: { page, limit },
    withCredentials: true,
  });

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getAllTransactionsByCustomer = async (customer_id: string) => {
  const response = await AxiosInstance.get(`/api/transactions/customer/${customer_id}`,
   { withCredentials: true},
  );

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

/**
 * GET /api/transactions/{transaction_id}
 */
export const getTransactionByIdAction = async (transactionId: string) => {
  const response = await AxiosInstance.get(
    `/api/transactions/${transactionId}`,
    { withCredentials: true }
  );

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

/**
 * POST /api/transactions/new
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTransactionAction = async (payload: any) => {
  const response = await AxiosInstance.post(
    "/api/transactions/new",
    payload,
    { withCredentials: true }
  );

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

/**
 * POST /api/transactions/{transaction_id}/attachment
 */
export const uploadTransactionAttachmentAction = async ({
  transactionId,
  file,
}: {
  transactionId: string;
  file: File;
}) => {
  const formData = new FormData();
  formData.append("attachment", file);

  const response = await AxiosInstance.post(
    `/api/transactions/${transactionId}/attachment`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};
