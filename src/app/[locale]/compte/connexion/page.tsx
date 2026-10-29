import AppLink from "@/components/ui/AppLink";
import { PageContainer } from "@/components/layout/PageLayout";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Column } from "@/components/layout/compose/Column";
import { notFound } from "next/navigation";
import { resendConfirmation, signIn } from "../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
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
      <main>
        <PageContainer
          width="account"
          spacing="none"
          className="flex min-h-[calc(100vh-4.5rem)] items-center py-[var(--space-12)]"
        >
          <Panel as="section" className="w-full text-center">
            <h1 className="m3-type-title-large">{t.account.alreadySignedIn}</h1>
            <AppLink variant="inline" className="mt-6 inline-flex" href={`/${locale}/compte`}>
              {t.account.title}
            </AppLink>
          </Panel>
        </PageContainer>
      </main>
    );
  }

  return (
    <main>
      <PageContainer width="form" spacing="none" className="flex min-h-[calc(100vh-4.5rem)] items-center py-[var(--space-12)]">
        <Panel as="section" className="w-full">
          <p className="m3-type-label-large text-[var(--primary)]">{t.account.label}</p>
          <h1 className="mt-2 m3-type-headline-large">{t.account.signIn}</h1>
          {query.status === "confirmation" && (
            <div className="mt-5 border-l-2 border-[var(--success)] py-1 pl-3 m3-type-body-medium text-[var(--success-foreground)]">
              <p>{t.account.confirmation}</p>
              <form action={resendConfirmation}>
          <Column verticalArrangement={Arrangement.spacedBy("var(--space-3)")}>
                <input type="hidden" name="locale" value={locale} />
                <TextField label={t.account.email} inputId="confirmation-email" name="email" type="email" autoComplete="email" required />
                <SubmitButton pendingLabel={t.account.resendConfirmation} className="border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-soft)]">
                  {t.account.resendConfirmation}
                </SubmitButton>
                        </Column>
        </form>
            </div>
          )}
          {query.status === "confirmation-sent" && (
            <p className="mt-5 border-l-2 border-[var(--success)] py-1 pl-3 m3-type-body-medium text-[var(--success-foreground)]" role="status">{t.account.confirmationSent}</p>
          )}
          {query.status === "deleted" && (
            <p className="mt-5 border-l-2 border-[var(--success)] py-1 pl-3 m3-type-body-medium text-[var(--success-foreground)]" role="status">{t.account.accountDeleted}</p>
          )}
          {query.error && (
            <p className="mt-5 border-l-2 border-[var(--danger)] py-1 pl-3 m3-type-body-medium text-[var(--danger-foreground)]" role="alert">
              {query.error === "rate-limited" ? t.account.authRateLimited : query.error === "invalid" ? t.account.invalidEmail : t.account.signInError}
            </p>
          )}
          <form action={signIn}>
          <Column verticalArrangement={Arrangement.spacedBy("var(--space-5)")}>
            <input type="hidden" name="locale" value={locale} />
            <TextField label={t.account.email} inputId="sign-in-email" name="email" type="email" autoComplete="email" required />
            <TextField label={t.account.password} inputId="sign-in-password" name="password" type="password" autoComplete="current-password" required />
            <SubmitButton pendingLabel={t.account.submitSignIn} className="w-full">
              {t.account.submitSignIn}
            </SubmitButton>
            <div className="text-center">
              <AppLink variant="inline" href={`/${locale}/compte/mot-de-passe-oublie`}>
                {t.account.forgotPassword}
              </AppLink>
            </div>
                    </Column>
        </form>
          <p className="mt-6 border-t border-[var(--border)] pt-5 text-center m3-type-body-medium text-[var(--muted)]">
            {t.account.noAccount}{" "}
            <AppLink variant="inline" href={`/${locale}/compte/inscription`}>{t.account.signUp}</AppLink>
          </p>
        </Panel>
      </PageContainer>
    </main>
  );
}
