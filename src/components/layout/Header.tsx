import type { ReactNode } from "react";
import Link from "next/link";
import ToolSearch from "@/components/tools/ToolSearch";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSelector from "@/components/layout/LanguageSelector";
import MobileHeaderSearch from "@/components/layout/MobileHeaderSearch";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolsPath } from "@/lib/tools/routes";

function Icon({ children, className = "h-4 w-4" }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

const iconButton =
  "flex h-9 shrink-0 items-center justify-center border border-transparent text-[var(--muted)] outline-none transition-[border-color,background-color,color] hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

const textLink =
  "flex h-9 shrink-0 items-center gap-2 border border-transparent px-2.5 text-sm font-semibold text-[var(--muted)] outline-none transition-[border-color,background-color,color] hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

export default function Header({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/80 bg-[var(--background)]">
      <div className="mx-auto max-w-[var(--content-wide)] px-3 sm:px-6 lg:px-8">
        <div className="grid h-14 grid-cols-[auto_1fr_auto] items-center gap-2 sm:h-16 sm:gap-3 lg:grid-cols-[1fr_minmax(20rem,32rem)_1fr]">
          <Link
            href={"/" + locale}
            className="group flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:gap-2.5 md:justify-self-start"
            aria-label={"Loculary - " + t.nav.home}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] text-sm font-black text-white transition-transform duration-200 group-hover:scale-[1.03] sm:h-9 sm:w-9">
              L
            </span>
            <span className="hidden text-lg font-bold tracking-[-0.03em] sm:inline">Loculary</span>
          </Link>

          <div className="hidden w-full max-w-[32rem] justify-self-center lg:block">
            <ToolSearch locale={locale} instanceId="header-tool-search" compact />
          </div>

          <div className="flex shrink-0 items-center justify-self-end gap-0.5 sm:gap-1">
            <Link href={getToolsPath(locale)} className={textLink + " hidden sm:inline-flex"}>
              <Icon>
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
              </Icon>
              {t.nav.explore}
            </Link>

            <MobileHeaderSearch locale={locale} searchLabel={t.tools.searchLabel} closeLabel={t.nav.closeSearch} />

            <Link prefetch={false} href={"/" + locale + "/compte"} className={iconButton + " w-9 sm:w-auto sm:gap-2 sm:px-2.5"} aria-label={t.nav.account} title={t.nav.account}>
              <Icon>
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5.5 20c.8-3.1 3-4.7 6.5-4.7s5.7 1.6 6.5 4.7" />
              </Icon>
              <span className="hidden sm:inline">{t.nav.space}</span>
            </Link>

            <LanguageSelector locale={locale} />
            <ThemeToggle />

            <details className="relative sm:hidden">
              <summary className={iconButton + " w-9 cursor-pointer list-none"} aria-label={t.nav.menu} title={t.nav.menu}>
                <Icon><path d="M5 7h14M5 12h14M5 17h14" /></Icon>
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 min-w-52 border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-md)]">
                <Link href={getToolsPath(locale)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)]">
                  <Icon><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></Icon>
                  {t.nav.explore}
                </Link>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
