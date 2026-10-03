import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteAccount } from "../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function DeleteAccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const t = getMessages(locale);
  const query = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect(`/${locale}/compte/connexion`);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-xl items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-[var(--danger-foreground)]/30 bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <p className="text-sm font-semibold text-[var(--danger-foreground)]">{t.account.deleteAccount}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{t.account.deleteAccountTitle}</h1>
        <p className="mt-4 text-[var(--muted)]">{t.account.deleteAccountDescription}</p>
        <div className="mt-6 rounded-2xl bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger-foreground)]">
          {t.account.deleteAccountConsequences}
        </div>

        {query.error ? (
          <p className="mt-5 rounded-2xl bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger-foreground)]" role="alert">
            {query.error === "last-super-admin" ? t.account.lastSuperAdmin : query.error === "confirmation" ? t.account.deleteAccountConfirmationLabel : query.error === "session" ? t.account.deleteAccountSessionError : t.account.deleteAccountError}
          </p>
        ) : null}

        <form action={deleteAccount} className="mt-7 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.account.deleteAccountConfirmationLabel}</span>
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              name="confirmation"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              placeholder={t.account.deleteAccountConfirmationPlaceholder}
              required
            />
          </label>
          <SubmitButton
            pendingLabel={t.account.deleteAccountButton}
            danger
            className="w-full rounded-xl border border-[var(--danger-foreground)] bg-[var(--danger-foreground)] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
          >
            {t.account.deleteAccountButton}
          </SubmitButton>
        </form>

        <Link className="mt-6 inline-flex font-semibold text-[var(--accent)] hover:underline" href={`/${locale}/compte`}>
          {t.account.title}
        </Link>
      </section>
    </main>
  );
}
