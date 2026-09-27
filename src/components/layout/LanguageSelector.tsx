"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageFlag from "@/components/layout/LanguageFlag";
import { getLanguage, isLocale, type Locale, locales } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export default function LanguageSelector({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const currentLocale: Locale = isLocale(segment) ? segment : locale;
  const suffix = pathname.startsWith("/" + currentLocale)
    ? pathname.slice(currentLocale.length + 1)
    : "";
  const currentLanguage = getLanguage(currentLocale);
  const t = getMessages(currentLocale);

  return (
    <details className="language-selector relative">
      <summary
        className="flex h-10 w-10 shrink-0 cursor-pointer list-none items-center justify-center rounded-xl border border-transparent text-[var(--muted)] outline-none transition-all hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
              aria-current={item === currentLocale ? "page" : undefined}
              className={item === currentLocale
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
  );
}
