import { createServerClient } from "@supabase/ssr";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest, options: { readProfileLocale?: boolean } = {}): Promise<{ response: NextResponse; userId: string | null; preferredLocale: Locale | null }> {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });

          for (const [key, value] of Object.entries(headers)) {
            supabaseResponse.headers.set(key, value);
          }
        },
      },
    },
  );

  const { data: claimsData } = await supabase.auth.getClaims();
  const claimSubject = claimsData?.claims?.sub;
  const userId = typeof claimSubject === "string" ? claimSubject : null;
  let preferredLocale: Locale | null = null;

  if (options.readProfileLocale && userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("locale")
      .eq("id", userId)
      .maybeSingle();
    if (isLocale(profile?.locale)) preferredLocale = profile.locale;
  }

  return { response: supabaseResponse, userId, preferredLocale };
}

export function copySessionResponse(
  source: NextResponse,
  target: NextResponse,
) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }

  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(header);
    if (value) target.headers.set(header, value);
  }

  return target;
}
