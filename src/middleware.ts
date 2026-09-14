import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return;
  }

  const pathnameLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameLocale === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname.replace(new RegExp(`^/${defaultLocale}(?=/|$)`), "") || "/";
    return NextResponse.redirect(url);
  }

  if (pathnameLocale) return;

  // Czech public URLs → internal /cs/articles routes
  if (pathname === "/clanky" || pathname.startsWith("/clanky/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/clanky/, `/${defaultLocale}/articles`);
    return NextResponse.rewrite(url);
  }

  // Canonical Czech articles path is /clanky
  if (pathname === "/articles" || pathname.startsWith("/articles/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/articles/, "/clanky");
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
