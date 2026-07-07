import axios from "axios";
import { authToken } from "./authToken";

let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/erp/refresh`,
      {},
      { withCredentials: true },
    );

    authToken.set(data.access_token);

    return data.access_token;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}
