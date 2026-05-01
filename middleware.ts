import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;

  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

  // If not logged in → block access
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};