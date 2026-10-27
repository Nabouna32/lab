import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateProfile } from "../actions";
import { PageContainer } from "@/components/layout/PageLayout";
import SubmitButton from "@/components/account/SubmitButton";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function PersonalInformationPage({
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

  if (!userData.user) redirect(`/${locale}/compte/connexion`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, locale")
    .eq("id", userData.user.id)
    .maybeSingle();

  const statusMessage =
    query.status === "profile-updated" ? t.account.profileUpdated :
    query.error === "profile" ? t.account.profileError :
    null;

  return (
    <main className="min-h-full">
      <PageContainer width="narrow" spacing="none" className="py-[var(--space-7)] sm:py-[var(--space-9)] lg:py-[var(--space-10)]">
        <Link
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-medium text-[var(--on-surface-variant)] outline-none transition-colors hover:text-[var(--on-surface)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] motion-reduce:transition-none"
          href={`/${locale}/compte`}
        >
          <MaterialIcon name="arrow_back" size={20} />
          {t.account.title}
        </Link>

        <header className="mb-8 space-y-2">
          <h1 className="m3-type-headline-medium">{t.account.personalInformation}</h1>
          <p className="max-w-2xl text-[var(--on-surface-variant)]">{t.account.personalInformationDescription}</p>
        </header>

        {statusMessage ? (
          <p
            className={`mb-5 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3 text-sm shadow-[var(--shadow-sm)] ${
              query.error ? "text-[var(--error)]" : "text-[var(--success)]"
            }`}
            role={query.error ? "alert" : "status"}
          >
            {statusMessage}
          </p>
        ) : null}

        <Panel as="section" className="w-full">
          <form action={updateProfile} className="space-y-5">
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
      </PageContainer>
    </main>
  );
}
