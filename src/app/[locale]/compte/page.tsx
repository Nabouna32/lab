import Link from "next/link";
import { notFound } from "next/navigation";
import { signOut, updateProfile } from "./actions";
import SubmitButton from "@/components/account/SubmitButton";
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
        <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
          <p className="mb-2 text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
          <h1 className="text-3xl font-bold tracking-tight">{t.account.title}</h1>
          <p className="mt-3 text-[var(--muted)]">{t.account.anonymousDescription}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-xl bg-[var(--accent)] px-5 py-3 text-center font-semibold text-white" href={`/${locale}/compte/connexion`}>
              {t.account.signIn}
            </Link>
            <Link className="rounded-xl border border-[var(--border)] px-5 py-3 text-center font-semibold" href={`/${locale}/compte/inscription`}>
              {t.account.signUp}
            </Link>
          </div>
        </section>
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
      <div className="space-y-6">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--accent)]">{t.account.label}</p>
              <h1 className="text-3xl font-bold tracking-tight">{t.account.title}</h1>
            </div>
            <p className="text-sm text-[var(--muted)]">{user.email}</p>
          </div>

          {statusMessage ? (
            <p className={`mt-6 rounded-2xl ${query.error ? "bg-[var(--danger-soft)] text-[var(--danger-foreground)]" : "bg-[var(--success-soft)] text-[var(--success-foreground)]"} p-4 text-sm`} role="status">
              {statusMessage}
            </p>
          ) : null}

          <form action={updateProfile} className="mt-8 space-y-5">
            <input type="hidden" name="locale" value={locale} />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">{t.account.displayName}</span>
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                name="displayName"
                type="text"
                autoComplete="name"
                maxLength={80}
                defaultValue={profile?.display_name ?? ""}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">{t.account.preferredLanguage}</span>
              <select
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                name="preferredLocale"
                defaultValue={profile?.locale ?? locale}
              >
                <option value="en">{t.account.english}</option>
                <option value="fr">{t.account.french}</option>
              </select>
            </label>

            <SubmitButton
              pendingLabel={t.account.saveProfile}
              className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
            >
              {t.account.saveProfile}
            </SubmitButton>
          </form>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 transition-colors hover:bg-[var(--surface-soft)]" href={`/${locale}/compte/email`}>
            <h2 className="font-semibold">{t.account.changeEmail}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
          </Link>
          <Link className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 transition-colors hover:bg-[var(--surface-soft)]" href={`/${locale}/compte/mot-de-passe`}>
            <h2 className="font-semibold">{t.account.changePassword}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t.account.password}</p>
          </Link>
        </section>

        {isAdmin === true ? (
          <Link className="inline-flex rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white" href={`/${locale}/admin`}>
            {t.admin.label}
          </Link>
        ) : null}

        <form action={signOut} className="pt-2">
          <input type="hidden" name="locale" value={locale} />
          <SubmitButton
            pendingLabel={t.account.signOut}
            className="rounded-xl border border-[var(--border)] px-5 py-3 font-semibold transition-colors hover:bg-[var(--surface-soft)] disabled:cursor-wait disabled:opacity-60"
          >
            {t.account.signOut}
          </SubmitButton>
        </form>

        <section className="rounded-3xl border border-[var(--danger-foreground)]/30 bg-[var(--danger-soft)] p-6">
          <p className="text-sm font-semibold text-[var(--danger-foreground)]">{t.account.deleteAccount}</p>
          <p className="mt-2 text-sm text-[var(--danger-foreground)]/90">{t.account.deleteAccountDescription}</p>
          <Link className="mt-5 inline-flex rounded-xl border border-[var(--danger-foreground)]/40 px-5 py-3 font-semibold text-[var(--danger-foreground)] transition-colors hover:bg-[var(--danger-foreground)]/10" href={`/${locale}/compte/suppression`}>
            {t.account.deleteAccount}
          </Link>
        </section>
      </div>
    </main>
  );
}
