import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./lib/i18n/config";
import { copySessionResponse, updateSession } from "./lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsSupabaseSession = /(^|\/)(compte|auth)(\/|$)/.test(pathname);

  const supabaseResponse = needsSupabaseSession ? await updateSession(request) : null;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === "/" + locale || pathname.startsWith("/" + locale + "/"),
  );

  if (pathnameHasLocale) {
    return supabaseResponse ?? NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/" + defaultLocale + pathname;

  const redirectResponse = NextResponse.redirect(url);
  return supabaseResponse
    ? copySessionResponse(supabaseResponse, redirectResponse)
    : redirectResponse;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
