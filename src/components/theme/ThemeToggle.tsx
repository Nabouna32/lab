"use client";

import { useTheme } from "@teispace/next-themes";
import { useLocale } from "@/lib/i18n/use-locale";

function ThemeIcon({ theme }: { theme: string | undefined }) {
  if (theme === "dark") {
    return <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />;
  }
  return <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />;
}

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const locale = useLocale();
  const labels = locale === "fr"
    ? { aria: "Choisir le thème", system: "Système", light: "Clair", dark: "Sombre", title: "Thème", automatic: "Automatique" }
    : { aria: "Choose theme", system: "System", light: "Light", dark: "Dark", title: "Theme", automatic: "Automatic" };

  const currentLabel = theme === "light" ? labels.light : theme === "dark" ? labels.dark : labels.system;
  const visualTheme = theme === "dark" ? "dark" : theme === "light" ? "light" : resolvedTheme;

  return (
    <details className="relative">
      <summary
        className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-transparent text-[var(--muted)] outline-none transition-all hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        aria-label={labels.aria + ": " + currentLabel}
        title={labels.title + ": " + currentLabel}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[1.1rem] w-[1.1rem]" aria-hidden="true">
          <ThemeIcon theme={visualTheme} />
        </svg>
        <span className="sr-only">{currentLabel}</span>
      </summary>

      <div className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-md)]">
        {[
          { value: "system", label: labels.system },
          { value: "light", label: labels.light },
          { value: "dark", label: labels.dark },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={(event) => {
              event.currentTarget.closest("details")?.removeAttribute("open");
              setTheme(option.value);
            }}
            className={"flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors " + (theme === option.value
              ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
              : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]")}
            aria-pressed={theme === option.value}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">
              {option.value === "system" ? (
                <><rect x="3.5" y="4" width="17" height="12" rx="1.8" /><path d="M8 20h8M12 16v4" /></>
              ) : (
                <ThemeIcon theme={option.value} />
              )}
            </svg>
            <span className="flex-1">{option.label}</span>
            {theme === option.value && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
    </details>
  );
}
