import Link from "next/link";
import { PageContainer } from "@/components/layout/PageLayout";
import { notFound, redirect } from "next/navigation";
import { changePassword } from "../actions";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";
import { Panel } from "@/components/ui/Panel";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
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
    <main>
      <PageContainer width="form" spacing="none" className="py-[var(--space-6)] sm:py-[var(--space-8)]">
        <Link
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full px-3 m3-type-label-large text-[var(--on-surface-variant)] outline-none hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          href={`/${locale}/compte`}
        >
          <MaterialIcon name="arrow_back" size={20} />
          {t.account.title}
        </Link>
        <Panel as="section" className="w-full overflow-hidden p-5 sm:p-8">
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]" aria-hidden="true">
            <MaterialIcon name="lock" size={28} />
          </div>
          <p className="m3-type-label-large text-[var(--primary)]">{t.account.security}</p>
          <h1 className="mt-2 m3-type-headline-medium">{t.account.changePasswordTitle}</h1>
          <p className="mt-3 m3-type-body-medium text-[var(--on-surface-variant)]">{t.account.changePasswordDescription}</p>

          <PasswordChangeForm locale={locale} t={t} serverError={query.error} />
        </Panel>
      </PageContainer>
    </main>
  );
}
