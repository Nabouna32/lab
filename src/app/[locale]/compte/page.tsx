import Link from "next/link";
import { notFound } from "next/navigation";
import { signOut, updateProfile } from "./actions";
import AppLink from "@/components/ui/AppLink";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
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
      <main className="min-h-full px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex min-h-[calc(100svh-12rem)] max-w-2xl items-center">
          <Panel as="section" className="w-full overflow-hidden p-6 sm:p-9">
            <div className="mb-6 h-1.5 w-16 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            <h1 className="m3-type-headline-large font-black tracking-[-0.05em]">{t.account.title}</h1>
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
        </div>
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
    <main className="min-h-full px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-md)] sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="m3-type-label-small uppercase text-[var(--accent)]">{t.account.label}</p>
              <h1 className="m3-type-headline-large mt-2 font-black tracking-[-0.05em]">{t.account.title}</h1>
            </div>
            <p className="m3-type-body-medium text-[var(--muted)]">{user.email}</p>
          </div>
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
              <h2 className="m3-type-title-large font-bold">{t.account.profile}</h2>
              <p className="m3-type-body-medium mt-1 text-[var(--muted)]">{user.email}</p>
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

          <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-7" aria-labelledby="account-security-title">
            <div className="border-b border-[var(--border)] pb-4">
              <h2 id="account-security-title" className="m3-type-title-large font-bold">{t.account.security}</h2>
            </div>
            <div className="mt-1 divide-y divide-[var(--border)]">
              <Link
                className="group flex items-center justify-between gap-4 rounded-xl px-2 py-4 transition-[background-color,transform] hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)]"
                href={`/${locale}/compte/email`}
              >
                <span>
                  <span className="m3-type-title-medium block font-semibold">{t.account.changeEmail}</span>
                  <span className="m3-type-body-medium mt-1 block text-[var(--muted)]">{user.email}</span>
                </span>
                <MaterialIcon name="chevron_right" size={20} className="h-5 w-5 text-[var(--muted)] transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                className="group flex items-center justify-between gap-4 rounded-xl px-2 py-4 transition-[background-color,transform] hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)]"
                href={`/${locale}/compte/mot-de-passe`}
              >
                <span>
                  <span className="m3-type-title-medium block font-semibold">{t.account.changePassword}</span>
                  <span className="m3-type-body-medium mt-1 block text-[var(--muted)]">{t.account.password}</span>
                </span>
                <MaterialIcon name="chevron_right" size={20} className="h-5 w-5 text-[var(--muted)] transition-transform group-hover:translate-x-1" />
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
            <p className="m3-type-label-large text-[var(--danger)]">{t.account.dangerZone}</p>
            <h2 id="delete-account-title" className="m3-type-title-large mt-1 font-bold">{t.account.deleteAccountTitle}</h2>
            <p className="m3-type-body-medium mt-2 max-w-2xl text-[var(--muted)]">{t.account.deleteAccountDescription}</p>
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
      </div>
    </main>
  );
}
