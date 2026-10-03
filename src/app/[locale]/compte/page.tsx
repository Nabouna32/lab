import Link from "next/link";
import { notFound } from "next/navigation";
import { signOut, updateProfile } from "./actions";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function AccountPage({
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
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-2xl items-center px-4 py-12 sm:px-6">
        <Panel as="section" className="w-full">
          <p className="text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{t.account.title}</h1>
          <p className="mt-3 text-[var(--muted)]">{t.account.anonymousDescription}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-4 py-2.5 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              href={`/${locale}/compte/connexion`}
            >
              {t.account.signIn}
            </Link>
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2.5 font-semibold transition-colors hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              href={`/${locale}/compte/inscription`}
            >
              {t.account.signUp}
            </Link>
          </div>
        </Panel>
      </main>
    );
  }

  const user = userData.user;
  const [{ data: isAdmin }, { data: profile }] = await Promise.all([
    supabase.rpc("has_admin_permission", { requested_permission: "admin.dashboard.view" }),
    supabase.from("profiles").select("display_name, locale, created_at").eq("id", user.id).maybeSingle(),
  ]);

  const statusMessage =
    query.status === "profile-updated" ? t.account.profileUpdated :
    query.status === "password-changed" ? t.account.passwordChanged :
    query.status === "email-updated" ? t.account.emailChangeUpdated :
    query.error === "profile" ? t.account.profileError :
    null;

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{t.account.title}</h1>
            <p className="text-sm text-[var(--muted)]">{user.email}</p>
          </div>
        </header>

        {statusMessage ? (
          <p
            className={`border-l-2 py-2 pl-3 text-sm ${
              query.error
                ? "border-[var(--danger)] text-[var(--danger-foreground)]"
                : "border-[var(--success)] text-[var(--success-foreground)]"
            }`}
            role="status"
          >
            {statusMessage}
          </p>
        ) : null}

        <Panel as="section">
          <div>
            <h2 className="text-lg font-semibold">{t.account.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
          </div>
          <form action={updateProfile} className="mt-6 space-y-5">
            <input type="hidden" name="locale" value={locale} />
            <TextField
              label={t.account.displayName}
              inputId="display-name"
              name="displayName"
              type="text"
              autoComplete="name"
              maxLength={80}
              defaultValue={profile?.display_name ?? ""}
            />
            <Select
              label={t.account.preferredLanguage}
              inputId="preferred-language"
              name="preferredLocale"
              defaultValue={profile?.locale ?? locale}
            >
              <option value="en">{t.account.english}</option>
              <option value="fr">{t.account.french}</option>
            </Select>
            <SubmitButton pendingLabel={t.account.saveProfile}>
              {t.account.saveProfile}
            </SubmitButton>
          </form>
        </Panel>

        <section aria-labelledby="account-security-title">
          <div className="border-b border-[var(--border)] pb-3">
            <h2 id="account-security-title" className="text-lg font-semibold">{t.account.changePassword}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t.account.password}</p>
          </div>
          <div className="divide-y divide-[var(--border)] border-b border-[var(--border)]">
            <Link
              className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)]"
              href={`/${locale}/compte/email`}
            >
              <span>
                <span className="block font-semibold">{t.account.changeEmail}</span>
                <span className="mt-1 block text-sm text-[var(--muted)]">{user.email}</span>
              </span>
              <span aria-hidden="true" className="text-[var(--muted)]">→</span>
            </Link>
            <Link
              className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)]"
              href={`/${locale}/compte/mot-de-passe`}
            >
              <span>
                <span className="block font-semibold">{t.account.changePassword}</span>
                <span className="mt-1 block text-sm text-[var(--muted)]">{t.account.password}</span>
              </span>
              <span aria-hidden="true" className="text-[var(--muted)]">→</span>
            </Link>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {isAdmin === true ? (
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-4 py-2.5 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              href={`/${locale}/admin`}
            >
              {t.admin.label}
            </Link>
          ) : <span />}
          <form action={signOut}>
            <input type="hidden" name="locale" value={locale} />
            <SubmitButton pendingLabel={t.account.signOut} className="border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-soft)]">
              {t.account.signOut}
            </SubmitButton>
          </form>
        </div>

        <section className="border-t border-[var(--border)] pt-6" aria-labelledby="delete-account-title">
          <p className="text-sm font-semibold text-[var(--danger-foreground)]">{t.account.deleteAccount}</p>
          <h2 id="delete-account-title" className="mt-1 text-lg font-semibold">{t.account.deleteAccountTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">{t.account.deleteAccountDescription}</p>
          <Link
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--danger)] px-4 py-2.5 font-semibold text-[var(--danger-foreground)] transition-colors hover:bg-[var(--danger-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            href={`/${locale}/compte/suppression`}
          >
            {t.account.deleteAccount}
          </Link>
        </section>
      </div>
    </main>
  );
}
