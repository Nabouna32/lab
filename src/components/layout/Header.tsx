"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageFlag from "@/components/layout/LanguageFlag";
import ToolSearch from "@/components/tools/ToolSearch";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { getLanguage, isLocale, type Locale, locales } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export default function Header() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const locale: Locale = isLocale(segment) ? segment : "fr";
  const t = getMessages(locale);
  const suffix = pathname.startsWith("/" + locale) ? pathname.slice(locale.length + 1) : "";
  const currentLanguage = getLanguage(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/80 bg-[var(--background)]/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href={"/" + locale}
          className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          aria-label={"Utiluna - " + t.nav.home}
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] bg-[var(--accent)] text-sm font-black text-white shadow-[var(--shadow-sm)] sm:h-10 sm:w-10">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white/35,transparent_45%)]" />
            <span className="relative">U</span>
          </span>
          <span className="hidden text-xl font-bold tracking-[-0.03em] sm:inline">Utiluna</span>
        </Link>

        <ToolSearch
          locale={locale}
          instanceId="header-tool-search"
          compact
          className="min-w-0 flex-1 sm:max-w-sm lg:max-w-md"
        />

        <nav className="flex shrink-0 items-center gap-0.5 text-sm font-semibold" aria-label="Primary">
          <Link
            href={"/" + locale + "/outils"}
            className="hidden rounded-xl px-4 py-2.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] sm:inline-flex"
          >
            {t.nav.tools}
          </Link>

          <details className="relative sm:hidden">
            <summary
              className="flex min-h-10 cursor-pointer list-none items-center justify-center rounded-xl px-2.5 py-2.5 text-[var(--muted)] outline-none transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              aria-label={t.nav.menu}
            >
              <span className="text-lg leading-none" aria-hidden="true">☰</span>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-md)]">
              <Link href={"/" + locale + "/outils"} className="flex items-center rounded-xl px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)]">{t.nav.tools}</Link>
              <Link href={"/" + locale + "/compte"} className="flex items-center rounded-xl px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)]">{t.nav.account}</Link>
            </div>
          </details>

          <details className="language-selector relative">
            <summary
              className="flex cursor-pointer list-none items-center rounded-xl px-2.5 py-2.5 text-xs font-bold text-[var(--muted)] outline-none transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              aria-label={t.nav.language + ": " + currentLanguage.nativeLabel}
            >
              <LanguageFlag code={currentLanguage.flagCode} />
              <span className="sr-only">{currentLanguage.nativeLabel}</span>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 min-w-44 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-md)]">
              {locales.map((item) => {
                const language = getLanguage(item);
                const href = "/" + item + (suffix || "");
                return (
                  <Link key={item} href={href} hrefLang={item} aria-current={item === locale ? "page" : undefined} className={item === locale ? "flex items-center gap-3 rounded-xl bg-[var(--accent-soft)] px-3 py-2.5 text-sm text-[var(--foreground)]" : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"}>
                    <LanguageFlag code={language.flagCode} />
                    <span>{language.nativeLabel}</span>
                  </Link>
                );
              })}
            </div>
          </details>

          <Link prefetch={false} href={"/" + locale + "/compte"} className="hidden rounded-xl px-4 py-2.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] sm:inline-flex">
            {t.nav.account}
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
