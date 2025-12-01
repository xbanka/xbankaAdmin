// utils/decodeToken.ts
import { jwtDecode, JwtPayload } from "jwt-decode";

export interface DecodedToken extends JwtPayload {
  // extend this with your backend’s claims
  sub?: string;
  email?: string;
  role?: string;
}

export function decodeAccessToken(token: string): DecodedToken | null {
  try {
    // return jwtDecode<DecodedToken>(token);
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid access token", error);
    return null;
  }
}
