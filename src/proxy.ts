import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./lib/i18n/config";
import { copySessionResponse, updateSession } from "./lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const supabaseResponse = await updateSession(request);
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some((locale) => pathname === "/" + locale || pathname.startsWith("/" + locale + "/"));
  if (pathnameHasLocale) return supabaseResponse;
  const url = request.nextUrl.clone();
  url.pathname = "/" + defaultLocale + pathname;
  return copySessionResponse(supabaseResponse, NextResponse.redirect(url));
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
