import AppLink from "@/components/ui/AppLink";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getAboutPath, getBugReportPath, getContactPath, getLegalNoticePath, getPrivacyPolicyPath } from "@/lib/tools/routes";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-[var(--content-wide)] flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5 lg:px-8">
        <nav
          aria-label={t.footer.navigationLabel}
          className="flex flex-wrap items-center gap-x-1 gap-y-1"
        >
          <AppLink href={getAboutPath(locale)} variant="tonal">
            {t.footer.about}
          </AppLink>
          <AppLink href={getContactPath(locale)} variant="tonal">
            {t.footer.contact}
          </AppLink>
          <AppLink href={getBugReportPath(locale)} variant="tonal">
            {t.footer.reportBug}
          </AppLink>
          <AppLink href={getLegalNoticePath(locale)} variant="tonal">
            {t.footer.legalNotice}
          </AppLink>
          <AppLink href={getPrivacyPolicyPath(locale)} variant="tonal">
            {t.footer.privacyPolicy}
          </AppLink>
        </nav>
        <p className="shrink-0 border-t border-[var(--border)] pt-3 text-xs font-medium text-[var(--muted)] sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          © {new Date().getFullYear()} Loculary
        </p>
      </div>
    </footer>
  );
}
