import { notFound } from "next/navigation";
import { resetPassword } from "../../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function ResetPasswordPage({
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

  if (!data.user) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-md items-center px-4 py-12">
        <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
          <h1 className="text-2xl font-bold">{t.account.resetPasswordTitle}</h1>
          <p className="mt-3 rounded-2xl bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger-foreground)]" role="alert">
            {t.account.passwordResetError}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <p className="mb-2 text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t.account.resetPasswordTitle}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">{t.account.resetPasswordDescription}</p>
        {query.error ? (
          <p className="mt-5 rounded-2xl bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger-foreground)]" role="alert">
            {query.error === "weak-password" ? t.account.weakPassword : t.account.passwordResetError}
          </p>
        ) : null}
        <form action={resetPassword} className="mt-6 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.account.password}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.account.passwordConfirmation}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
          </label>
          <SubmitButton pendingLabel={t.account.resetPassword} className="w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
            {t.account.resetPassword}
          </SubmitButton>
        </form>
      </section>
    </main>
  );
}
