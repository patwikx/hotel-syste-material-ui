// middleware.ts

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Protect all routes by redirecting to sign-in if not logged in.
  if (!isLoggedIn && !nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/sign-in", nextUrl));
  }

  // Redirect authenticated users away from auth pages.
  if (isLoggedIn && nextUrl.pathname.startsWith("/auth")) {
    // Redirect to the user's first business unit after login.
    const assignments = req.auth?.user?.assignments;
    const firstBusinessUnitId = assignments?.[0]?.businessUnitId;
    if (firstBusinessUnitId) {
      return NextResponse.redirect(new URL(`/${firstBusinessUnitId}/admin`, nextUrl));
    }
    return NextResponse.redirect(new URL("/setup", nextUrl));
  }

  // The rest of the requests should proceed.
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}