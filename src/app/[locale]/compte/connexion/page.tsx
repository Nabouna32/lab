import Link from "next/link";
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
      <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-2xl items-center px-4 py-12">
        <Panel as="section" className="w-full text-center">
          <h1 className="text-2xl font-bold">{t.account.alreadySignedIn}</h1>
          <Link className="mt-6 inline-flex font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" href={`/${locale}/compte`}>
            {t.account.title}
          </Link>
        </Panel>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-md items-center px-4 py-12">
      <Panel as="section" className="w-full">
        <p className="text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{t.account.signIn}</h1>
        {query.status === "confirmation" && (
          <div className="mt-5 border-l-2 border-[var(--success)] py-1 pl-3 text-sm text-[var(--success-foreground)]">
            <p>{t.account.confirmation}</p>
            <form action={resendConfirmation} className="mt-4 space-y-3">
              <input type="hidden" name="locale" value={locale} />
              <TextField label={t.account.email} inputId="confirmation-email" name="email" type="email" autoComplete="email" required />
              <SubmitButton pendingLabel={t.account.resendConfirmation} className="border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-soft)]">
                {t.account.resendConfirmation}
              </SubmitButton>
            </form>
          </div>
        )}
        {query.status === "confirmation-sent" && (
          <p className="mt-5 border-l-2 border-[var(--success)] py-1 pl-3 text-sm text-[var(--success-foreground)]" role="status">{t.account.confirmationSent}</p>
        )}
        {query.status === "deleted" && (
          <p className="mt-5 border-l-2 border-[var(--success)] py-1 pl-3 text-sm text-[var(--success-foreground)]" role="status">{t.account.accountDeleted}</p>
        )}
        {query.error && (
          <p className="mt-5 border-l-2 border-[var(--danger)] py-1 pl-3 text-sm text-[var(--danger-foreground)]" role="alert">
            {query.error === "rate-limited" ? t.account.authRateLimited : query.error === "invalid" ? t.account.invalidEmail : t.account.signInError}
          </p>
        )}
        <form action={signIn} className="mt-6 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <TextField label={t.account.email} inputId="sign-in-email" name="email" type="email" autoComplete="email" required />
          <TextField label={t.account.password} inputId="sign-in-password" name="password" type="password" autoComplete="current-password" required />
          <SubmitButton pendingLabel={t.account.submitSignIn} className="w-full">
            {t.account.submitSignIn}
          </SubmitButton>
          <div className="text-center">
            <Link className="text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" href={`/${locale}/compte/mot-de-passe-oublie`}>
              {t.account.forgotPassword}
            </Link>
          </div>
        </form>
        <p className="mt-6 border-t border-[var(--border)] pt-5 text-center text-sm text-[var(--muted)]">
          {t.account.noAccount}{" "}
          <Link className="font-semibold text-[var(--accent)] hover:underline" href={`/${locale}/compte/inscription`}>{t.account.signUp}</Link>
        </p>
      </Panel>
    </main>
  );
}
