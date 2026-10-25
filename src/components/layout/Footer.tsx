import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getAboutPath, getBugReportPath, getContactPath, getLegalNoticePath, getPrivacyPolicyPath } from "@/lib/tools/routes";

const footerLink =
  "inline-flex min-h-11 items-center rounded-sm px-2 text-sm text-[var(--muted)] underline-offset-4 outline-none transition-colors hover:text-[var(--foreground)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/70">
      <div className="mx-auto flex max-w-[var(--content-wide)] flex-col gap-4 px-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <nav aria-label={t.footer.navigationLabel} className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href={getAboutPath(locale)} className={footerLink}>{t.footer.about}</Link>
          <Link href={getContactPath(locale)} className={footerLink}>{t.footer.contact}</Link>
          <Link href={getBugReportPath(locale)} className={footerLink}>{t.footer.reportBug}</Link>
          <Link href={getLegalNoticePath(locale)} className={footerLink}>{t.footer.legalNotice}</Link>
          <Link href={getPrivacyPolicyPath(locale)} className={footerLink}>{t.footer.privacyPolicy}</Link>
        </nav>
        <p className="shrink-0 text-xs text-[var(--muted)]">© {new Date().getFullYear()} Loculary</p>
      </div>
    </footer>
  );
}
