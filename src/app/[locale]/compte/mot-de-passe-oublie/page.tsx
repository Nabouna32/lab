import Link from "next/link";
import { notFound } from "next/navigation";
import { requestPasswordReset } from "../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function ForgotPasswordPage({
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

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <p className="mb-2 text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t.account.forgotPasswordTitle}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">{t.account.forgotPasswordDescription}</p>

        {query.status === "sent" || query.status === "rate-limited" ? (
          <p className="mt-5 rounded-2xl bg-[var(--success-soft)] p-4 text-sm text-[var(--success-foreground)]" role="status">
            {query.status === "rate-limited" ? t.account.authRateLimited : t.account.forgotPasswordSent}
          </p>
        ) : null}

        {query.error ? (
          <p className="mt-5 rounded-2xl bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger-foreground)]" role="alert">
            {query.error === "invalid" ? t.account.invalidEmail : t.account.forgotPasswordError}
          </p>
        ) : null}

        <form action={requestPasswordReset} className="mt-6 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.account.email}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="email" type="email" autoComplete="email" required />
          </label>
          <SubmitButton pendingLabel={t.account.forgotPassword} className="w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
            {t.account.forgotPassword}
          </SubmitButton>
        </form>

        <Link className="mt-6 inline-flex font-semibold text-[var(--accent)] hover:underline" href={`/${locale}/compte/connexion`}>
          {t.account.signIn}
        </Link>
      </section>
    </main>
  );
}
