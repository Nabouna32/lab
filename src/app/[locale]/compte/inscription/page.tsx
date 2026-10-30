import AppLink from "@/components/ui/AppLink";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Column } from "@/components/layout/compose/Column";
import { notFound } from "next/navigation";
import { signUp } from "../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function SignUpPage({
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
  const { data: claimsData } = await supabase.auth.getClaims();

  if (claimsData?.claims) {
    return (
      <main>
        <div className="mx-auto w-full max-w-[var(--layout-content-account)] px-[var(--layout-page-gutter)] flex min-h-[calc(100vh-4.5rem)] items-center py-[var(--space-12)]">
          <Panel as="section" className="w-full text-center">
            <h1 className="m3-type-title-large">{t.account.alreadySignedIn}</h1>
            <AppLink variant="inline" className="mt-6 inline-flex" href={`/${locale}/compte`}>
              {t.account.title}
            </AppLink>
          </Panel>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="mx-auto w-full max-w-[var(--layout-content-form)] px-[var(--layout-page-gutter)] flex min-h-[calc(100vh-4.5rem)] items-center py-[var(--space-12)]">
        <Panel as="section" className="w-full">
          <p className="m3-type-label-large text-[var(--primary)]">{t.account.label}</p>
          <h1 className="mt-2 m3-type-headline-large">{t.account.signUp}</h1>
          {query.error && (
            <p className="mt-5 border-l-2 border-[var(--danger)] py-1 pl-3 m3-type-body-medium text-[var(--danger-foreground)]" role="alert">
              {query.error === "rate-limited" ? t.account.authRateLimited : query.error === "weak-password" ? t.account.weakPassword : t.account.signUpError}
            </p>
          )}
          <form action={signUp}>
          <Column verticalArrangement={Arrangement.spacedBy("var(--space-5)")}>
            <input type="hidden" name="locale" value={locale} />
            <TextField label={t.account.displayName} inputId="sign-up-display-name" name="displayName" type="text" autoComplete="name" maxLength={80} />
            <TextField label={t.account.email} inputId="sign-up-email" name="email" type="email" autoComplete="email" required />
            <TextField label={t.account.password} inputId="sign-up-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
            <SubmitButton pendingLabel={t.account.submitSignUp} className="w-full">
              {t.account.submitSignUp}
            </SubmitButton>
                    </Column>
        </form>
          <p className="mt-6 border-t border-[var(--border)] pt-5 text-center m3-type-body-medium text-[var(--muted)]">
            {t.account.hasAccount}{" "}
            <AppLink variant="inline" href={`/${locale}/compte/connexion`}>{t.account.signIn}</AppLink>
          </p>
        </Panel>
      </div>
    </main>
  );
}
