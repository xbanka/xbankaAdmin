import {jwtDecode} from "jwt-decode";

export function decodeAccessToken(token: string) {
  if (!token) return { payload: null, expired: true };

  try {
    const decodedPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const expired = decodedPayload.exp ? decodedPayload.exp < currentTime : true;

    // console.log({ payload: decodedPayload, expired })
    return { payload: decodedPayload, expired };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return { payload: null, expired: true };
  }
}
