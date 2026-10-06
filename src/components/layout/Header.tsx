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
  "flex h-9 shrink-0 items-center justify-center rounded-xl border border-transparent text-[var(--muted)] outline-none transition-[transform,border-color,background-color,color] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

const navLink =
  "group inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border border-transparent px-3 text-sm font-semibold text-[var(--muted)] outline-none transition-[transform,border-color,background-color,color] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

export default function Header({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <header
      data-app-header
      className="sticky top-0 z-50 border-b border-[var(--border)]/80 bg-[var(--surface)]/82 backdrop-blur-2xl"
    >
      <div className="mx-auto w-full px-3 sm:px-5 lg:px-7">
        <div className="grid h-[4.25rem] grid-cols-[auto_1fr_auto] items-center gap-2 sm:h-[4.75rem] sm:gap-4">
          <Link
            href={"/" + locale}
            className="group flex min-w-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            aria-label={"Loculary - " + t.nav.home}
          >
            <span className="loculary-brand-mark relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[0.8rem] bg-[var(--accent)] text-sm font-black text-[var(--accent-foreground)] shadow-[var(--shadow-accent)] transition-transform duration-[var(--motion-standard)] group-hover:scale-105 sm:h-10 sm:w-10">
              <span className="relative z-10">L</span>
              <span className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-white/25 blur-md" aria-hidden="true" />
            </span>
            <span className="hidden truncate text-[1.05rem] font-black tracking-[-0.04em] sm:inline">Loculary</span>
          </Link>

          <div className="hidden w-full max-w-[36rem] justify-self-center lg:block">
            <ToolSearch locale={locale} instanceId="header-tool-search" compact />
          </div>

          <nav aria-label={t.nav.explore} className="flex items-center justify-self-end gap-1 sm:gap-1.5">
            <Link href={getToolsPath(locale)} className={navLink + " hidden sm:inline-flex"}>
              <Icon>
                <rect x="4" y="4" width="6" height="6" rx="1.5" />
                <rect x="14" y="4" width="6" height="6" rx="1.5" />
                <rect x="4" y="14" width="6" height="6" rx="1.5" />
                <rect x="14" y="14" width="6" height="6" rx="1.5" />
              </Icon>
              {t.nav.explore}
            </Link>

            <MobileHeaderSearch locale={locale} searchLabel={t.tools.searchLabel} closeLabel={t.nav.closeSearch} />

            <Link
              prefetch={false}
              href={"/" + locale + "/compte"}
              className={iconButton + " w-9 sm:w-auto sm:gap-2 sm:px-3"}
              aria-label={t.nav.account}
              title={t.nav.account}
            >
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
              <div className="absolute right-0 top-full z-50 mt-2 min-w-52 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-xl)]">
                <Link href={getToolsPath(locale)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)]">
                  <Icon><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></Icon>
                  {t.nav.explore}
                </Link>
              </div>
            </details>
          </nav>
        </div>
      </div>
    </header>
  );
}
