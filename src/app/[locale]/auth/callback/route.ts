import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n/config";

export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/" + locale + "/compte";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/" + locale + "/compte";

  if (!isLocale(locale) || !code) {
    return NextResponse.redirect(new URL("/" + (isLocale(locale) ? locale : "fr") + "/compte/connexion?error=auth-callback", origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/" + locale + "/compte/connexion?error=auth-callback", origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}
