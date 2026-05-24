import { NextRequest, NextResponse } from "next/server";

function hasValidSessionCookie(rawCookie: string | undefined) {
  if (!rawCookie) return false;

  try {
    const decoded = decodeURIComponent(rawCookie);
    const parsed = JSON.parse(decoded) as {
      access_token?: unknown;
      user?: { id?: unknown };
    };

    return typeof parsed.access_token === "string" && typeof parsed.user?.id === "string";
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow internal Next.js and static asset requests
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Read session cookie set by the client-side auth helper
  const sessionCookie = req.cookies.get("interali.session")?.value;
  const hasSession = hasValidSessionCookie(sessionCookie);

  // Protect all routes under /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!hasSession) {
      const loginUrl = new URL("/login", req.url);
      // optional: pass original path so client can return after login
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // If an authenticated user visits login/register, redirect to dashboard
  if ((pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
};
