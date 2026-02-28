// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/",
  "/customer-management",
  "/transactions",
  "/finance",
  "/customer-support",
  "/staff",
];

const PUBLIC_ROUTES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !token) {
    const signinUrl = new URL("/signin", request.url);
    return NextResponse.redirect(signinUrl);
  }

  if (token && isPublicRoute) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/customer-management/:path*",
    "/transactions/:path*",
    "/finance/:path*",
    "/customer-support/:path*",
    "/staff/:path*",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};