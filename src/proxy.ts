import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en"];
const defaultLocale = "fr";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths, API routes, static files, and special pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/code" ||
    pathname === "/email" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to the default locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|code|email).*)",
  ],
};
