export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/clients/:path*", "/tasks/:path*", "/settings/:path*"]
};
