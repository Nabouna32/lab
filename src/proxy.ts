import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./lib/i18n/config";
import { copySessionResponse, updateSession } from "./lib/supabase/proxy";

function getSupabaseOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!configuredUrl) return null;

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return null;
  }
}

function applySecurityHeaders(response: NextResponse, request: NextRequest) {
  const supabaseOrigin = getSupabaseOrigin();
  const isDevelopment = process.env.NODE_ENV !== "production";
  const connectSources = ["'self'", ...(supabaseOrigin ? [supabaseOrigin] : [])];

  if (isDevelopment) {
    connectSources.push("ws://localhost:*");
  }

  const scriptSources = ["'self'", "'unsafe-inline'"];
  if (isDevelopment) {
    scriptSources.push("'unsafe-eval'");
  }

  const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${connectSources.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "accelerometer=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  );

  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  if (forwardedProtocol === "https" || request.nextUrl.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsSupabaseSession =
    pathname.includes("/compte") || pathname.includes("/auth/");

  const supabaseResponse = needsSupabaseSession ? await updateSession(request) : null;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === "/" + locale || pathname.startsWith("/" + locale + "/"),
  );

  if (pathnameHasLocale) {
    return applySecurityHeaders(
      supabaseResponse ?? NextResponse.next(),
      request,
    );
  }

  const url = request.nextUrl.clone();
  url.pathname = "/" + defaultLocale + pathname;

  const redirectResponse = NextResponse.redirect(url);
  const response = supabaseResponse
    ? copySessionResponse(supabaseResponse, redirectResponse)
    : redirectResponse;

  return applySecurityHeaders(response, request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\..*).*)"],
};
