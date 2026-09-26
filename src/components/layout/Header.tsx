"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageFlag from "@/components/layout/LanguageFlag";
import ToolSearch from "@/components/tools/ToolSearch";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { getLanguage, isLocale, type Locale, locales } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

function Icon({
  children,
  className = "h-4 w-4",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

const iconButton =
  "flex h-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-[var(--muted)] outline-none transition-all hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

export default function Header() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const locale: Locale = isLocale(segment) ? segment : "fr";
  const t = getMessages(locale);
  const suffix = pathname.startsWith("/" + locale) ? pathname.slice(locale.length + 1) : "";
  const currentLanguage = getLanguage(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/80 bg-[var(--background)]/88 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:h-[4.5rem] sm:gap-3 sm:px-6 lg:px-8">
        <Link
          href={"/" + locale}
          className="group flex shrink-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:gap-3"
          aria-label={"Utiluna - " + t.nav.home}
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[0.9rem] bg-[var(--accent)] text-sm font-black text-white shadow-[var(--shadow-sm)] sm:h-10 sm:w-10">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white/35,transparent_45%)]" />
            <span className="relative">U</span>
          </span>
          <span className="hidden text-xl font-bold tracking-[-0.03em] sm:inline">Utiluna</span>
        </Link>

        <ToolSearch
          locale={locale}
          instanceId="header-tool-search"
          compact
          className="min-w-0 flex-1 sm:ml-1 sm:max-w-[24rem] lg:max-w-[28rem]"
        />

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
          <Link
            href={"/" + locale + "/outils"}
            className="hidden h-10 items-center gap-2 rounded-xl border border-transparent px-3 text-sm font-semibold text-[var(--muted)] outline-none transition-all hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:inline-flex"
          >
            <Icon>
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <rect x="14" y="14" width="6" height="6" rx="1" />
            </Icon>
            {t.nav.explore}
          </Link>

          <details className="language-selector relative">
            <summary
              className={iconButton + " w-10 cursor-pointer list-none"}
              aria-label={t.nav.language + ": " + currentLanguage.nativeLabel}
              title={t.nav.language + ": " + currentLanguage.nativeLabel}
            >
              <LanguageFlag code={currentLanguage.flagCode} />
              <span className="sr-only">{currentLanguage.nativeLabel}</span>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 min-w-44 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-md)]">
              {locales.map((item) => {
                const language = getLanguage(item);
                const href = "/" + item + (suffix || "");
                return (
                  <Link
                    key={item}
                    href={href}
                    hrefLang={item}
                    aria-current={item === locale ? "page" : undefined}
                    className={item === locale
                      ? "flex items-center gap-3 rounded-xl bg-[var(--accent-soft)] px-3 py-2.5 text-sm text-[var(--foreground)]"
                      : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"}
                  >
                    <LanguageFlag code={language.flagCode} />
                    <span>{language.nativeLabel}</span>
                  </Link>
                );
              })}
            </div>
          </details>

          <Link
            prefetch={false}
            href={"/" + locale + "/compte"}
            className={iconButton + " w-10 sm:w-auto sm:gap-2 sm:px-3"}
            aria-label={t.nav.account}
            title={t.nav.account}
          >
            <Icon>
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 20c.8-3.1 3-4.7 6.5-4.7s5.7 1.6 6.5 4.7" />
            </Icon>
            <span className="hidden sm:inline">{t.nav.space}</span>
          </Link>

          <ThemeToggle />

          <details className="relative sm:hidden">
            <summary
              className={iconButton + " w-10 cursor-pointer list-none"}
              aria-label={t.nav.menu}
              title={t.nav.menu}
            >
              <Icon>
                <path d="M5 7h14M5 12h14M5 17h14" />
              </Icon>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 min-w-52 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-md)]">
              <Link href={"/" + locale + "/outils"} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)]">
                <Icon><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></Icon>
                {t.nav.explore}
              </Link>
              <Link href={"/" + locale + "/compte"} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)]">
                <Icon><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.8-3.1 3-4.7 6.5-4.7s5.7 1.6 6.5 4.7" /></Icon>
                {t.nav.space}
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
