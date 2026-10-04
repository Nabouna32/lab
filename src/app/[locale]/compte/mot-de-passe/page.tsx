import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { changePassword } from "../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
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
      <Panel as="section" className="w-full">
        <h1 className="text-3xl font-bold tracking-tight">{t.account.changePasswordTitle}</h1>
        {query.error ? (
          <p className="mt-5 border-l-2 border-[var(--danger)] py-1 pl-3 text-sm text-[var(--danger-foreground)]" role="alert">
            {query.error === "current-password" ? t.account.currentPasswordError : query.error === "weak-password" ? t.account.weakPassword : t.account.passwordError}
          </p>
        ) : null}
        <form action={changePassword} className="mt-6 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <TextField label={t.account.currentPassword} inputId="current-password" name="currentPassword" type="password" autoComplete="current-password" required />
          <TextField label={t.account.password} inputId="new-password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
          <TextField label={t.account.passwordConfirmation} inputId="password-confirmation" name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
          <SubmitButton pendingLabel={t.account.changePassword} className="w-full">
            {t.account.changePassword}
          </SubmitButton>
        </form>
        <Link className="mt-6 inline-flex font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" href={`/${locale}/compte`}>
          {t.account.title}
        </Link>
      </Panel>
    </main>
  );
}
