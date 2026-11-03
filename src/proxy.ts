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
  const session = needsSupabaseSession || hasSupabaseAuthCookie
    ? await updateSession(request, { readProfileLocale: !pathnameHasLocale })
    : null;

  if (pathnameHasLocale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete("x-loculary-user-id");
    if (session?.userId) requestHeaders.set("x-loculary-user-id", session.userId);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    return withDeploymentCommit(session ? copySessionResponse(session.response, response) : response);
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
