"use client";

import { useTheme } from "@teispace/next-themes";
import { useLocale } from "@/lib/i18n/use-locale";

function ThemeIcon({ theme }: { theme: string | undefined }) {
  if (theme === "light") {
    return <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />;
  }
  if (theme === "dark") {
    return <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />;
  }
  return <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.2 2.3 3.5 5 3.5 8.5S14.2 18.2 12 20.5C9.8 18.2 8.5 15.5 8.5 12S9.8 5.8 12 3.5Z" /></>;
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const labels = locale === "fr"
    ? { aria: "Choisir le thème", system: "Système", light: "Clair", dark: "Sombre", title: "Thème" }
    : { aria: "Choose theme", system: "System", light: "Light", dark: "Dark", title: "Theme" };

  const nextTheme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
  const currentLabel = theme === "light" ? labels.light : theme === "dark" ? labels.dark : labels.system;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={labels.aria + ": " + currentLabel}
      title={labels.title + ": " + currentLabel}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-[var(--muted)] outline-none transition-all hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[1.1rem] w-[1.1rem]" aria-hidden="true">
        <ThemeIcon theme={theme} />
      </svg>
      <span className="sr-only">{currentLabel}</span>
    </button>
  );
}
