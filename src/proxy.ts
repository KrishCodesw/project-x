// src/proxy.ts
import { auth } from "@/lib/auth";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  // Define which routes require authentication
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

  // If trying to access a protected route while logged out, redirect to login
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // If trying to access login/register while ALREADY logged in, redirect to dashboard
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

// The matcher defines which routes the proxy should run on.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};