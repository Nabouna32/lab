import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { changeEmail } from "../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function ChangeEmailPage({
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
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect(`/${locale}/compte/connexion`);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <p className="mb-2 text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t.account.changeEmailTitle}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">{t.account.changeEmailDescription}</p>
        <div className="mt-5 rounded-2xl bg-[var(--surface-soft)] p-4 text-sm">
          <span className="font-semibold">{t.account.emailAddress}:</span> {data.user.email}
        </div>
        {query.status === "confirmation" ? (
          <p className="mt-5 rounded-2xl bg-[var(--success-soft)] p-4 text-sm text-[var(--success-foreground)]" role="status">{t.account.emailChangeConfirmation}</p>
        ) : null}
        {query.error ? (
          <p className="mt-5 rounded-2xl bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger-foreground)]" role="alert">
            {query.error === "same" ? t.account.emailSame : query.error === "rate-limited" ? t.account.authRateLimited : t.account.emailChangeError}
          </p>
        ) : null}
        <form action={changeEmail} className="mt-6 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.account.email}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="email" type="email" autoComplete="email" required />
          </label>
          <SubmitButton pendingLabel={t.account.changeEmail} className="w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
            {t.account.changeEmail}
          </SubmitButton>
        </form>
        <Link className="mt-6 inline-flex font-semibold text-[var(--accent)] hover:underline" href={`/${locale}/compte`}>
          {t.account.title}
        </Link>
      </section>
    </main>
  );
}
