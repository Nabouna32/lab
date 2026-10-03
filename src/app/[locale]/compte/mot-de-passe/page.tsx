import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { changePassword } from "../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function ChangePasswordPage({
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
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <p className="mb-2 text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t.account.changePasswordTitle}</h1>
        {query.error ? (
          <p className="mt-5 rounded-2xl bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger-foreground)]" role="alert">
            {query.error === "current-password" ? t.account.currentPasswordError : query.error === "weak-password" ? t.account.weakPassword : t.account.profileError}
          </p>
        ) : null}
        <form action={changePassword} className="mt-6 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.account.currentPassword}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="currentPassword" type="password" autoComplete="current-password" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.account.password}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.account.passwordConfirmation}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
          </label>
          <SubmitButton pendingLabel={t.account.changePassword} className="w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
            {t.account.changePassword}
          </SubmitButton>
        </form>
        <Link className="mt-6 inline-flex font-semibold text-[var(--accent)] hover:underline" href={`/${locale}/compte`}>
          {t.account.title}
        </Link>
      </section>
    </main>
  );
}
