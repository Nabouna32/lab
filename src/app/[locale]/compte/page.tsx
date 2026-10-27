import Link from "next/link";
import { notFound } from "next/navigation";
import { signOut, updateProfile } from "./actions";
import AppLink from "@/components/ui/AppLink";
import { PageContainer } from "@/components/layout/PageLayout";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { ListItem } from "@/components/ui/ListItem";
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
      <main className="min-h-full">
        <PageContainer width="account" spacing="none" className="flex min-h-[calc(100svh-12rem)] items-center py-[var(--space-8)] sm:py-[var(--space-10)]">
          <Panel as="section" className="w-full overflow-hidden p-6 sm:p-9">
            <div className="mb-6 h-1.5 w-16 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            <h1 className="text-3xl font-black tracking-[-0.05em]">{t.account.title}</h1>
            <p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">{t.account.anonymousDescription}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AppLink href={`/${locale}/compte/connexion`} variant="filled">
                {t.account.signIn}
              </AppLink>
              <AppLink href={`/${locale}/compte/inscription`} variant="outlined">
                {t.account.signUp}
              </AppLink>
            </div>
          </Panel>
        </PageContainer>
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
    <main className="min-h-full">
      <PageContainer width="narrow" spacing="none" className="py-[var(--space-7)] sm:py-[var(--space-9)] lg:py-[var(--space-10)]">
        <header className="mb-5 rounded-[var(--m3-panel-shape)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-md)] sm:p-7">
          <h1 className="m3-type-headline-medium">{t.account.title}</h1>
        </header>

        {statusMessage ? (
          <p
            className={`mb-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm shadow-[var(--shadow-sm)] ${
              query.error ? "text-[var(--danger)]" : "text-[var(--success)]"
            }`}
            role="status"
          >
            {statusMessage}
          </p>
        ) : null}

        <div className="space-y-5">
          <Panel as="section">
            <div>
              <h2 className="m3-type-title-large">{t.account.profile}</h2>
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
                id="preferred-language"
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

          <section className="overflow-hidden rounded-[var(--m3-panel-shape)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]" aria-labelledby="account-security-title">
            <div className="px-5 pb-3 pt-5 sm:px-7 sm:pt-7">
              <h2 id="account-security-title" className="m3-type-title-large">{t.account.security}</h2>
            </div>
            <div className="divide-y divide-[var(--outline-variant)]">
              <Link
                className="group block min-w-0 outline-none transition-colors hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] motion-reduce:transition-none"
                href={`/${locale}/compte/email`}
              >
                <ListItem
                  headline={t.account.changeEmail}
                  supporting={user.email}
                  trailing={<MaterialIcon name="chevron_right" size={24} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />}
                  lines={2}
                />
              </Link>
              <Link
                className="group block min-w-0 outline-none transition-colors hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] motion-reduce:transition-none"
                href={`/${locale}/compte/mot-de-passe`}
              >
                <ListItem
                  headline={t.account.changePassword}
                  trailing={<MaterialIcon name="chevron_right" size={24} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />}
                  lines={1}
                />
              </Link>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {isAdmin === true ? (
              <AppLink href={`/${locale}/admin`} variant="filled">
                {t.admin.label}
              </AppLink>
            ) : <span />}
            <form action={signOut}>
              <input type="hidden" name="locale" value={locale} />
              <SubmitButton pendingLabel={t.account.signOut} variant="outlined">
                {t.account.signOut}
              </SubmitButton>
            </form>
          </div>

          <section className="rounded-[var(--radius-xl)] border border-[var(--danger)]/25 bg-[var(--danger-soft)]/40 p-5 sm:p-7" aria-labelledby="delete-account-title">
            <p className="text-sm font-black text-[var(--danger)]">{t.account.dangerZone}</p>
            <h2 id="delete-account-title" className="mt-1 text-lg font-black">{t.account.deleteAccountTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{t.account.deleteAccountDescription}</p>
            <AppLink
              className="mt-4"
              href={`/${locale}/compte/suppression`}
              leadingIcon
              colors={{ contentColor: "var(--error)" }}
              variant="text"
            >
              <MaterialIcon name="delete" size={18} className="shrink-0" />
              {t.account.deleteAccount}
            </AppLink>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
