import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Only protect specific routes
  const protectedRoutes = [
    "/invoices",
    "/dashboard",
    "/settings",
    // Add other protected routes here
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/invoices/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    // Add other protected paths here
  ],
};
