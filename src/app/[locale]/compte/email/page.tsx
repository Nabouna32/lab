import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { changeEmail } from "../actions";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Column } from "@/components/layout/compose/Column";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
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
    <main>
      <div className="mx-auto w-full max-w-[var(--layout-content-form)] px-[var(--layout-page-gutter)] py-[var(--space-6)] sm:py-[var(--space-8)]">
        <Link
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full px-3 m3-type-label-large text-[var(--on-surface-variant)] outline-none hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          href={`/${locale}/compte`}
        >
          <MaterialIcon name="arrow_back" size={20} />
          {t.account.title}
        </Link>
        <Panel as="section" className="w-full overflow-hidden p-5 sm:p-8">
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]" aria-hidden="true">
            <MaterialIcon name="mail" size={28} />
          </div>
          <p className="m3-type-label-large text-[var(--primary)]">{t.account.security}</p>
          <h1 className="mt-2 m3-type-headline-medium">{t.account.changeEmailTitle}</h1>
          <p className="mt-3 m3-type-body-medium text-[var(--on-surface-variant)]">{t.account.changeEmailDescription}</p>

          <section className="mt-6 rounded-[var(--shape-corner-large)] bg-[var(--surface-container-low)] p-4" aria-label={t.account.emailAddress}>
            <p className="m3-type-label-medium text-[var(--on-surface-variant)]">{t.account.emailAddress}</p>
            <p className="mt-1 break-all m3-type-body-large text-[var(--on-surface)]">{data.user.email}</p>
          </section>

          {query.status === "confirmation" ? (
            <p className="mt-5 rounded-[var(--shape-corner-medium)] bg-[var(--success-soft)] px-4 py-3 m3-type-body-medium text-[var(--success-foreground)]" role="status">
              {t.account.emailChangeConfirmation}
            </p>
          ) : null}
          {query.error ? (
            <p className="mt-5 rounded-[var(--shape-corner-medium)] bg-[var(--error-container)] px-4 py-3 m3-type-body-medium text-[var(--on-error-container)]" role="alert">
              {query.error === "same" ? t.account.emailSame : query.error === "rate-limited" ? t.account.authRateLimited : t.account.emailChangeError}
            </p>
          ) : null}

          <form action={changeEmail} className="mt-6">
            <Column verticalArrangement={Arrangement.spacedBy("var(--space-5)")}>
              <input type="hidden" name="locale" value={locale} />
              <TextField label={t.account.email} inputId="change-email" name="email" type="email" autoComplete="email" required />
              <SubmitButton pendingLabel={t.account.changeEmail} className="w-full">
                {t.account.changeEmail}
              </SubmitButton>
            </Column>
          </form>
        </Panel>
      </div>
    </main>
  );
}
