import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const originalUrl = request.nextUrl.pathname + request.nextUrl.search;

    const signInUrl = new URL(`/sign-in`, request.url);
    signInUrl.searchParams.set("callbackUrl", originalUrl);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/availability", "/bookings", "/settings"],
};
