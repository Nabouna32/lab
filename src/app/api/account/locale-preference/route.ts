import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const claimSubject = claimsData?.claims?.sub;

  if (claimsError || typeof claimSubject !== "string") {
    return NextResponse.json(
      { locale: null },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("locale")
    .eq("id", claimSubject)
    .maybeSingle();

  const locale = !profileError && isLocale(profile?.locale) ? profile.locale : null;

  return NextResponse.json(
    { locale },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
