import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight middleware to reduce Edge Function size
export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get("authjs.session-token") || request.cookies.get("__Secure-authjs.session-token");

  // Protected routes
  const protectedPaths = ["/clients", "/tasks", "/settings"];
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Redirect to sign-in if no token on protected route
  if (isProtectedPath && !token) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/clients/:path*", "/tasks/:path*", "/settings/:path*"]
};
