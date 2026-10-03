import Link from "next/link";
import { notFound } from "next/navigation";
import { resendConfirmation, signIn } from "../actions";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const t = getMessages(locale);
  const query = await searchParams;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (claimsData?.claims) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-2xl items-center px-4 py-12">
        <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-8 text-center shadow-[var(--shadow-sm)]">
          <h1 className="text-2xl font-bold">{t.account.alreadySignedIn}</h1>
          <Link className="mt-6 inline-flex rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white" href={`/${locale}/compte`}>
            {t.account.title}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <p className="mb-2 text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t.account.signIn}</h1>
        {query.status === "confirmation" && (
          <div className="mt-4 rounded-2xl bg-[var(--success-soft)] p-4 text-sm text-[var(--success-foreground)]">
            <p>{t.account.confirmation}</p>
            <form action={resendConfirmation} className="mt-4 space-y-3">
              <input type="hidden" name="locale" value={locale} />
              <label className="block">
                <span className="sr-only">{t.account.email}</span>
                <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="email" type="email" autoComplete="email" placeholder={t.account.email} required />
              </label>
              <button className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--surface-soft)]" type="submit">{t.account.resendConfirmation}</button>
            </form>
          </div>
        )}
        {query.status === "confirmation-sent" && (
          <p className="mt-4 rounded-2xl bg-[var(--success-soft)] p-4 text-sm text-[var(--success-foreground)]" role="status">{t.account.confirmationSent}</p>
        )}
        {query.status === "deleted" && (
          <p className="mt-4 rounded-2xl bg-[var(--success-soft)] p-4 text-sm text-[var(--success-foreground)]" role="status">{t.account.accountDeleted}</p>
        )}
        {query.error && (
          <p className="mt-4 rounded-2xl bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger-foreground)]">
            {query.error === "rate-limited" ? t.account.authRateLimited : query.error === "invalid" ? t.account.invalidEmail : t.account.signInError}
          </p>
        )}
        <form action={signIn} className="mt-6 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.account.email}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="email" type="email" autoComplete="email" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.account.password}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90" type="submit">{t.account.submitSignIn}</button>
          <div className="text-center">
            <Link className="text-sm font-semibold text-[var(--accent)] hover:underline" href={`/${locale}/compte/mot-de-passe-oublie`}>
              {t.account.forgotPassword}
            </Link>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          {t.account.noAccount}{" "}
          <Link className="font-semibold text-[var(--accent)] hover:underline" href={`/${locale}/compte/inscription`}>{t.account.signUp}</Link>
        </p>
      </section>
    </main>
  );
}
