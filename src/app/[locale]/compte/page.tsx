import Link from "next/link";
import { notFound } from "next/navigation";
import { signOut } from "./actions";
import AppLink from "@/components/ui/AppLink";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Column } from "@/components/layout/compose/Column";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
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
        <div className="mx-auto w-full max-w-[var(--layout-content-account)] px-[var(--layout-page-gutter)] flex min-h-[calc(100svh-12rem)] items-center py-[var(--space-8)] sm:py-[var(--space-10)]">
          <Panel as="section" className="w-full overflow-hidden p-6 sm:p-9">
            <div className="mb-6 h-1.5 w-16 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            <h1 className="m3-type-headline-medium">{t.account.title}</h1>
            <p className="m3-type-body-medium mt-3 max-w-xl text-[var(--muted)]">{t.account.anonymousDescription}</p>
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

  const [{ data: isAdmin }] = await Promise.all([
    supabase.rpc("has_admin_permission", { requested_permission: "admin.dashboard.view" }),
  ]);

  const statusMessage =
    query.status === "password-changed" ? t.account.passwordChanged :
    query.status === "email-updated" ? t.account.emailChangeUpdated :
    null;

  return (
    <main className="min-h-full">
      <div className="mx-auto w-full max-w-[var(--layout-content-narrow)] px-[var(--layout-page-gutter)] py-[var(--space-7)] sm:py-[var(--space-9)] lg:py-[var(--space-10)]">
        <Column verticalArrangement={Arrangement.spacedBy("var(--space-2)")} className="mb-8">
          <h1 className="m3-type-headline-medium">{t.account.title}</h1>
          <p className="max-w-2xl text-[var(--on-surface-variant)]">{t.account.pageDescription}</p>
        </Column>

        {statusMessage ? (
          <p
            className={`mb-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 m3-type-body-medium shadow-[var(--shadow-sm)] ${
              query.error ? "text-[var(--danger)]" : "text-[var(--success)]"
            }`}
            role="status"
          >
            {statusMessage}
          </p>
        ) : null}

        <Column verticalArrangement={Arrangement.spacedBy("var(--space-6)")} className="w-full">
          <section className="w-full overflow-hidden rounded-[var(--m3-panel-shape)] border border-[var(--outline-variant)] bg-[var(--surface)] shadow-[var(--shadow-sm)]" aria-labelledby="account-profile-title">
            <Column verticalArrangement={Arrangement.spacedBy("var(--space-1)")} className="px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-7">
              <h2 id="account-profile-title" className="m3-type-title-large">{t.account.profile}</h2>
            </Column>
            <div className="border-t border-[var(--outline-variant)]">
              <Link
                className="group block min-w-0 outline-none transition-colors hover:bg-[var(--surface-container-low)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] motion-reduce:transition-none"
                href={`/${locale}/compte/informations-personnelles`}
              >
                <ListItem
                  leading={<MaterialIcon name="person" size={24} />}
                  headline={t.account.personalInformation}
                  supporting={t.account.personalInformationDescription}
                  trailing={<MaterialIcon name="chevron_right" size={24} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />}
                  lines={2}
                />
              </Link>
            </div>
          </section>

          <section className="w-full overflow-hidden rounded-[var(--m3-panel-shape)] border border-[var(--outline-variant)] bg-[var(--surface)] shadow-[var(--shadow-sm)]" aria-labelledby="account-security-title">
            <Column verticalArrangement={Arrangement.spacedBy("var(--space-1)")} className="px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-7">
              <h2 id="account-security-title" className="m3-type-title-large">{t.account.security}</h2>
            </Column>
            <div className="border-t border-[var(--outline-variant)]">
              <div className="divide-y divide-[var(--outline-variant)]">
                <Link
                  className="group block min-w-0 outline-none transition-colors hover:bg-[var(--surface-container-low)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] motion-reduce:transition-none"
                  href={`/${locale}/compte/email`}
                >
                  <ListItem
                    leading={<MaterialIcon name="mail" size={24} />}
                    headline={t.account.emailSettingTitle}
                    supporting={t.account.emailSettingDescription}
                    trailing={<MaterialIcon name="chevron_right" size={24} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />}
                    lines={2}
                  />
                </Link>
                <Link
                  className="group block min-w-0 outline-none transition-colors hover:bg-[var(--surface-container-low)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] motion-reduce:transition-none"
                  href={`/${locale}/compte/mot-de-passe`}
                >
                  <ListItem
                    leading={<MaterialIcon name="lock" size={24} />}
                    headline={t.account.passwordSettingTitle}
                    supporting={t.account.passwordSettingDescription}
                    trailing={<MaterialIcon name="chevron_right" size={24} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />}
                    lines={2}
                  />
                </Link>
              </div>
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

          <section className="w-full rounded-[var(--m3-panel-shape)] border border-[var(--error)]/30 bg-[var(--error-container)]/35" aria-labelledby="delete-account-title">
            <Column verticalArrangement={Arrangement.spacedBy("var(--space-4)")} className="p-5 sm:p-7">
              <Column verticalArrangement={Arrangement.spacedBy("var(--space-1)")}>
                <p className="m3-type-label-large text-[var(--error)]">{t.account.dangerZone}</p>
                <h2 id="delete-account-title" className="m3-type-title-large">{t.account.deleteAccountTitle}</h2>
                <p className="m3-type-body-medium max-w-2xl text-[var(--muted)]">{t.account.deleteAccountDescription}</p>
              </Column>
              <AppLink
                href={`/${locale}/compte/suppression`}
                leadingIcon
                colors={{ contentColor: "var(--error)" }}
                variant="text"
              >
                <MaterialIcon name="delete" size={18} className="shrink-0" />
                {t.account.deleteAccount}
              </AppLink>
            </Column>
          </section>
        </Column>
      </div>
    </main>
  );
}
