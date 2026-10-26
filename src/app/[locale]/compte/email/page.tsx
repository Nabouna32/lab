import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { changeEmail } from "../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
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
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-md items-center px-4 py-12">
      <Panel as="section" className="w-full">
        <p className="m3-type-label-large text-[var(--accent)]">{t.account.label}</p>
        <h1 className="m3-type-headline-large mt-2">{t.account.changeEmailTitle}</h1>
        <p className="m3-type-body-medium mt-3 text-[var(--muted)]">{t.account.changeEmailDescription}</p>
        <p className="m3-type-body-medium mt-5 border-l-2 border-[var(--border-strong)] py-1 pl-3">
          <span className="font-semibold">{t.account.emailAddress}:</span> {data.user.email}
        </p>
        {query.status === "confirmation" ? (
          <p className="m3-type-body-medium mt-5 border-l-2 border-[var(--success)] py-1 pl-3 text-[var(--success-foreground)]" role="status">{t.account.emailChangeConfirmation}</p>
        ) : null}
        {query.error ? (
          <p className="m3-type-body-medium mt-5 border-l-2 border-[var(--danger)] py-1 pl-3 text-[var(--danger-foreground)]" role="alert">
            {query.error === "same" ? t.account.emailSame : query.error === "rate-limited" ? t.account.authRateLimited : t.account.emailChangeError}
          </p>
        ) : null}
        <form action={changeEmail} className="mt-6 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <TextField label={t.account.email} inputId="change-email" name="email" type="email" autoComplete="email" required />
          <SubmitButton pendingLabel={t.account.changeEmail} className="w-full">
            {t.account.changeEmail}
          </SubmitButton>
        </form>
        <Link className="mt-6 inline-flex font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" href={`/${locale}/compte`}>
          {t.account.title}
        </Link>
      </Panel>
    </main>
  );
}
