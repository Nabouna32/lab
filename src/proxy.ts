import { NextResponse, type NextRequest } from "next/server";
import { locales } from "./lib/i18n/config";
import { getPreferredLocale } from "./lib/i18n/request-locale";
import { copySessionResponse, updateSession } from "./lib/supabase/proxy";

function withDeploymentCommit(response: NextResponse): NextResponse {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA;
  if (commit) response.headers.set("X-Loculary-Commit", commit);
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsSupabaseSession = /(^|\/)(compte|auth|admin)(\/|$)/.test(pathname);

  const supabaseResponse = needsSupabaseSession ? await updateSession(request) : null;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === "/" + locale || pathname.startsWith("/" + locale + "/"),
  );

  if (pathnameHasLocale) {
    return withDeploymentCommit(supabaseResponse ?? NextResponse.next());
  }

  const url = request.nextUrl.clone();
  const preferredLocale = getPreferredLocale(request.headers.get("accept-language"));
  url.pathname = "/" + preferredLocale + pathname;

  const redirectResponse = NextResponse.redirect(url);
  return withDeploymentCommit(
    supabaseResponse
      ? copySessionResponse(supabaseResponse, redirectResponse)
      : redirectResponse,
  );
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
