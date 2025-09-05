// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value || null;
  console.log("token", token)

  const { pathname } = req.nextUrl;

  // Public routes
  const isPublicRoute = ["/auth/signin", "/auth/signup"].includes(pathname);

  if (!token && !isPublicRoute) {
    const loginUrl = new URL("auth/signin", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublicRoute) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Only match routes you want to protect
export const config = {
  matcher: ["/dashboard/:path*", "/auth/signin", "/auth/signup"],
};
