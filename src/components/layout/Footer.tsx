import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getAboutPath, getBugReportPath, getContactPath, getLegalNoticePath, getPrivacyPolicyPath } from "@/lib/tools/routes";

const footerLink =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-transparent px-3 text-sm font-semibold text-[var(--muted)] outline-none transition-[background-color,color,border-color] duration-[var(--motion-standard)] hover:border-[var(--outline-variant)]/60 hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-[var(--content-wide)] flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5 lg:px-8">
        <nav
          aria-label={t.footer.navigationLabel}
          className="flex flex-wrap items-center gap-x-1 gap-y-1"
        >
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <Link href={getAboutPath(locale)} className={footerLink}>
              {t.footer.about}
            </Link>
            <Link href={getContactPath(locale)} className={footerLink}>
              {t.footer.contact}
            </Link>
            <Link href={getBugReportPath(locale)} className={footerLink}>
              {t.footer.reportBug}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-[var(--border)] pt-1 sm:ml-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
            <Link href={getLegalNoticePath(locale)} className={footerLink}>
              {t.footer.legalNotice}
            </Link>
            <Link href={getPrivacyPolicyPath(locale)} className={footerLink}>
              {t.footer.privacyPolicy}
            </Link>
          </div>
        </nav>
        <p className="shrink-0 border-t border-[var(--border)] pt-3 text-xs font-medium text-[var(--muted)] sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          © {new Date().getFullYear()} Loculary
        </p>
      </div>
    </footer>
  );
}
