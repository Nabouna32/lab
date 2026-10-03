import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n/config";

export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/" + locale + "/compte";
  const localeRoot = "/" + locale;
  const isSafeNext = requestedNext === localeRoot || requestedNext.startsWith(localeRoot + "/");
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") && isSafeNext
    ? requestedNext
    : localeRoot + "/compte";

  if (!isLocale(locale) || !code) {
    return NextResponse.redirect(new URL("/" + (isLocale(locale) ? locale : "fr") + "/compte/connexion?error=auth-callback", origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const destination = next.includes("/mot-de-passe/reinitialiser")
      ? "/" + locale + "/compte/mot-de-passe/reinitialiser?error=invalid-link"
      : "/" + locale + "/compte/connexion?error=auth-callback";
    return NextResponse.redirect(new URL(destination, origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}
