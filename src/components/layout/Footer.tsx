import Link from "next/link";
import LocularyLogo from "@/components/brand/LocularyLogo";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolsPath } from "@/lib/tools/routes";

const footerLink =
  "inline-flex min-h-12 items-center rounded-full px-3 text-sm font-semibold text-[var(--muted)] outline-none transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/70">
      <div className="mx-auto flex max-w-[var(--content-wide)] flex-col gap-4 px-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Link
            href={"/" + locale}
            aria-label={"Loculary - " + t.nav.home}
            className="w-fit rounded-[var(--radius-lg)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            <LocularyLogo
              className="gap-2"
              wordmarkClassName="text-base font-bold tracking-[-0.03em] text-[var(--foreground)]"
            />
          </Link>
          <span className="hidden h-1 w-1 rounded-full bg-[var(--border-strong)] sm:block" aria-hidden="true" />
          <span className="max-w-[32rem] text-xs leading-5 text-[var(--muted)]">{t.footer.tagline}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:justify-end">
          <Link href={getToolsPath(locale)} className={footerLink}>
            {t.nav.tools}
          </Link>
          <Link href={"/" + locale + "/compte"} className={footerLink}>
            {t.nav.account}
          </Link>
          <span className="ml-1 pl-2 text-xs text-[var(--muted)] sm:border-l sm:border-[var(--border)] sm:pl-3">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
