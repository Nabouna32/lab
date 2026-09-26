import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n/config";

export async function requireAdminPermission(
  locale: string,
  permission: string,
): Promise<{ userId: string; email: string | null; locale: Locale }> {
  if (!isLocale(locale)) redirect("/fr");

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;

  if (!claims?.sub) {
    redirect(`/${locale}/compte/connexion`);
  }

  const { data: allowed, error } = await supabase.rpc("has_admin_permission", {
    requested_permission: permission,
  });

  if (error || allowed !== true) {
    redirect(`/${locale}/compte?error=admin-forbidden`);
  }

  return {
    userId: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
    locale,
  };
}
