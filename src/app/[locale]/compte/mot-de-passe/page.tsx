import Link from "next/link";
import { PageContainer } from "@/components/layout/PageLayout";
import { notFound, redirect } from "next/navigation";
import { changePassword } from "../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
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
    <main>
      <PageContainer width="form" spacing="none" className="py-[var(--space-6)] sm:py-[var(--space-8)]">
        <Link
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full px-3 m3-type-label-large text-[var(--on-surface-variant)] outline-none hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          href={`/${locale}/compte`}
        >
          <MaterialIcon name="arrow_back" size={20} />
          {t.account.title}
        </Link>
        <Panel as="section" className="w-full overflow-hidden p-5 sm:p-8">
          <div className="mb-5 grid size-14 place-items-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]" aria-hidden="true">
            <MaterialIcon name="lock" size={28} />
          </div>
          <p className="m3-type-label-large text-[var(--primary)]">{t.account.security}</p>
          <h1 className="mt-2 m3-type-headline-medium">{t.account.changePasswordTitle}</h1>
          <p className="mt-3 m3-type-body-medium text-[var(--on-surface-variant)]">{t.account.changePasswordDescription}</p>

          {query.error ? (
            <p className="mt-5 rounded-[var(--shape-corner-medium)] bg-[var(--error-container)] px-4 py-3 m3-type-body-medium text-[var(--on-error-container)]" role="alert">
              {query.error === "current-password" ? t.account.currentPasswordError : query.error === "weak-password" ? t.account.weakPassword : t.account.passwordError}
            </p>
          ) : null}

          <form action={changePassword} className="mt-6">
            <input type="hidden" name="locale" value={locale} />
            <div className="grid gap-[var(--space-5)]">
              <TextField label={t.account.currentPassword} inputId="current-password" name="currentPassword" type="password" autoComplete="current-password" required />
              <div className="grid gap-2">
                <TextField label={t.account.password} inputId="new-password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
                <p className="m3-type-body-small text-[var(--on-surface-variant)]">{t.account.passwordLengthHint}</p>
              </div>
              <TextField label={t.account.passwordConfirmation} inputId="password-confirmation" name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
              <SubmitButton pendingLabel={t.account.changePassword} className="w-full">
                {t.account.changePassword}
              </SubmitButton>
            </div>
          </form>
        </Panel>
      </PageContainer>
    </main>
  );
}
