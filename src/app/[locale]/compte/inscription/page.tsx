import Link from "next/link";
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
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{t.account.signUp}</h1>
        {query.error && (
          <p className="mt-5 border-l-2 border-[var(--danger)] py-1 pl-3 text-sm text-[var(--danger-foreground)]" role="alert">
            {query.error === "rate-limited" ? t.account.authRateLimited : query.error === "weak-password" ? t.account.weakPassword : t.account.signUpError}
          </p>
        )}
        <form action={signUp} className="mt-6 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <TextField label={t.account.displayName} inputId="sign-up-display-name" name="displayName" type="text" autoComplete="name" maxLength={80} />
          <TextField label={t.account.email} inputId="sign-up-email" name="email" type="email" autoComplete="email" required />
          <TextField label={t.account.password} inputId="sign-up-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
          <SubmitButton pendingLabel={t.account.submitSignUp} className="w-full">
            {t.account.submitSignUp}
          </SubmitButton>
        </form>
        <p className="mt-6 border-t border-[var(--border)] pt-5 text-center text-sm text-[var(--muted)]">
          {t.account.hasAccount}{" "}
          <Link className="font-semibold text-[var(--accent)] hover:underline" href={`/${locale}/compte/connexion`}>{t.account.signIn}</Link>
        </p>
      </Panel>
    </main>
  );
}
