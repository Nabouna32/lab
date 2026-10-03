import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteAccount } from "../actions";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function DeleteAccountPage({
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
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-xl items-center px-4 py-12">
      <Panel as="section" className="w-full border-[var(--danger)]/40">
        <p className="text-sm font-semibold text-[var(--danger-foreground)]">{t.account.deleteAccount}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{t.account.deleteAccountTitle}</h1>
        <p className="mt-4 text-[var(--muted)]">{t.account.deleteAccountDescription}</p>
        <p className="mt-6 border-l-2 border-[var(--danger)] py-1 pl-3 text-sm text-[var(--danger-foreground)]">
          {t.account.deleteAccountConsequences}
        </p>

        {query.error ? (
          <p className="mt-5 border-l-2 border-[var(--danger)] py-1 pl-3 text-sm text-[var(--danger-foreground)]" role="alert">
            {query.error === "last-super-admin" ? t.account.lastSuperAdmin : query.error === "confirmation" ? t.account.deleteAccountConfirmationLabel : query.error === "session" ? t.account.deleteAccountSessionError : t.account.deleteAccountError}
          </p>
        ) : null}

        <form action={deleteAccount} className="mt-7 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <TextField
            label={t.account.deleteAccountConfirmationLabel}
            inputId="delete-confirmation"
            name="confirmation"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            placeholder={t.account.deleteAccountConfirmationPlaceholder}
            className="font-mono"
            required
          />
          <SubmitButton
            pendingLabel={t.account.deleteAccountButton}
            danger
            className="w-full"
          >
            {t.account.deleteAccountButton}
          </SubmitButton>
        </form>

        <Link className="mt-6 inline-flex font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" href={`/${locale}/compte`}>
          {t.account.title}
        </Link>
      </Panel>
    </main>
  );
}
