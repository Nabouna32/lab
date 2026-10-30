import { notFound } from "next/navigation";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Column } from "@/components/layout/compose/Column";
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
      <main>
      <div className="mx-auto w-full max-w-[var(--layout-content-form)] px-[var(--layout-page-gutter)] flex min-h-[calc(100vh-4.5rem)] items-center py-[var(--space-12)]">
        <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
          <h1 className="m3-type-headline-medium">{t.account.resetPasswordTitle}</h1>
          <p className="mt-3 rounded-2xl bg-[var(--danger-soft)] p-4 m3-type-body-medium text-[var(--danger-foreground)]" role="alert">
            {t.account.passwordResetError}
          </p>
        </section>
        </div>
    </main>
    );
  }

  return (
    <main>
      <div className="mx-auto w-full max-w-[var(--layout-content-form)] px-[var(--layout-page-gutter)] flex min-h-[calc(100vh-4.5rem)] items-center py-[var(--space-12)]">
      <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <p className="m3-type-label-large mb-2 text-[var(--accent)]">{t.account.label}</p>
        <h1 className="m3-type-headline-large">{t.account.resetPasswordTitle}</h1>
        <p className="m3-type-body-medium mt-3 text-[var(--muted)]">{t.account.resetPasswordDescription}</p>
        {query.error ? (
          <p className="mt-5 rounded-2xl bg-[var(--danger-soft)] p-4 m3-type-body-medium text-[var(--danger-foreground)]" role="alert">
            {query.error === "weak-password" ? t.account.weakPassword : t.account.passwordResetError}
          </p>
        ) : null}
        <form action={resetPassword}>
          <Column verticalArrangement={Arrangement.spacedBy("var(--space-5)")}>
          <input type="hidden" name="locale" value={locale} />
          <label className="block">
            <span className="m3-type-label-large mb-2 block">{t.account.password}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
          </label>
          <label className="block">
            <span className="m3-type-label-large mb-2 block">{t.account.passwordConfirmation}</span>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
          </label>
          <SubmitButton pendingLabel={t.account.resetPassword} className="w-full">
            {t.account.resetPassword}
          </SubmitButton>
                  </Column>
        </form>
      </section>
      </div>
    </main>
  );
}
