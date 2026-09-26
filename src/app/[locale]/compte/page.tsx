import Link from "next/link";
import { notFound } from "next/navigation";
import { signOut } from "./actions";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();

  const locale: Locale = value;
  const t = getMessages(locale);
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-2xl items-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
          <p className="mb-2 text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
          <h1 className="text-3xl font-bold tracking-tight">{t.account.title}</h1>
          <p className="mt-3 text-[var(--muted)]">{t.account.anonymousDescription}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-xl bg-[var(--accent)] px-5 py-3 text-center font-semibold text-white" href={`/${locale}/compte/connexion`}>
              {t.account.signIn}
            </Link>
            <Link className="rounded-xl border border-[var(--border)] px-5 py-3 text-center font-semibold" href={`/${locale}/compte/inscription`}>
              {t.account.signUp}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, locale, created_at")
    .eq("id", claimsData.claims.sub)
    .maybeSingle();

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <p className="mb-2 text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t.account.title}</h1>
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl bg-[var(--surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t.account.email}</p>
            <p className="mt-1 break-all font-medium">{String(claimsData.claims.email ?? "")}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t.account.displayName}</p>
            <p className="mt-1 font-medium">{profile?.display_name || t.account.notSet}</p>
          </div>
        </div>
        <form action={signOut} className="mt-8">
          <input type="hidden" name="locale" value={locale} />
          <button className="rounded-xl border border-[var(--border)] px-5 py-3 font-semibold transition-colors hover:bg-[var(--surface-soft)]" type="submit">
            {t.account.signOut}
          </button>
        </form>
      </section>
    </main>
  );
}
