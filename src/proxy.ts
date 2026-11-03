import { NextResponse, type NextRequest } from "next/server";
import { locales } from "./lib/i18n/config";
import { resolvePreferredLocale } from "./lib/i18n/request-locale";
import { copySessionResponse, updateSession } from "./lib/supabase/proxy";

function withDeploymentCommit(response: NextResponse): NextResponse {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA;
  if (commit) response.headers.set("X-Loculary-Commit", commit);
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname === "/" + locale || pathname.startsWith("/" + locale + "/"),
  );
  const needsSupabaseSession = /(^|\/)(compte|auth|admin)(\/|$)/.test(pathname);
  const hasSupabaseAuthCookie = request.cookies.getAll().some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name));
  const readProfileLocale = !pathnameHasLocale && hasSupabaseAuthCookie;
  const session = needsSupabaseSession || readProfileLocale
    ? await updateSession(request, { readProfileLocale })
    : null;

  if (pathnameHasLocale) {
    return withDeploymentCommit(session?.response ?? NextResponse.next());
  }

  const url = request.nextUrl.clone();
  const preferredLocale = resolvePreferredLocale(request.headers.get("accept-language"), session?.preferredLocale ?? null);
  url.pathname = "/" + preferredLocale + pathname;

  const redirectResponse = NextResponse.redirect(url);
  return withDeploymentCommit(
    session
      ? copySessionResponse(session.response, redirectResponse)
      : redirectResponse,
  );
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
