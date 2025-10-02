import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./lib/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  console.log(pathname);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);

  if (isLoggedIn && isAuthRoute)
    return NextResponse.redirect(new URL("/", req.nextUrl));
  if (!isLoggedIn && isProtectedRoute)
    return NextResponse.redirect(new URL("/", req.nextUrl));
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
