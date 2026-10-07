"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@teispace/next-themes";
import { getLanguage, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getLocalizedPath } from "@/lib/tools/routes";
import { getMessages } from "@/lib/i18n/messages";

function Icon({ children, className = "h-4 w-4" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const triggerClass =
  "flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--foreground)] outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 hover:bg-[var(--surface-soft)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

const optionClass =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] outline-none transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:bg-[var(--surface-soft)] focus-visible:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)]";

export default function DesktopHeaderMenu({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const t = getMessages(locale);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentLocaleSegment = pathname.split("/")[1];
  const currentLocale: Locale = isLocale(currentLocaleSegment) ? currentLocaleSegment : locale;
  const currentLanguage = getLanguage(currentLocale);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menuRef.current?.contains(target)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  function selectTheme(value: string) {
    setTheme(value);
    closeMenu();
  }

  return (
    <div ref={menuRef} className="relative hidden lg:block">
      <button
        type="button"
        className={triggerClass + (open ? " border-[var(--accent)] bg-[var(--surface-soft)] shadow-[var(--shadow-sm)]" : "")}
        aria-expanded={open}
        aria-controls="desktop-header-menu"
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon>
          <path d="M5 7h14M5 12h14M5 17h14" />
        </Icon>
        <span>{t.nav.menu}</span>
      </button>

      <div
        id="desktop-header-menu"
        aria-hidden={!open}
        className={
          "absolute right-0 top-full z-[70] mt-3 w-80 origin-top-right rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-2 shadow-[var(--shadow-lg)] transition-[opacity,transform] duration-150 " +
          (open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0")
        }
      >
        <Link
          href={"/" + locale + "/compte"}
          prefetch={false}
          onClick={closeMenu}
          className="group flex items-center gap-3 rounded-xl px-3 py-3 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Icon className="h-[1.1rem] w-[1.1rem]">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 20c.8-3.1 3-4.7 6.5-4.7s5.7 1.6 6.5 4.7" />
            </Icon>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-[var(--foreground)]">{t.nav.space}</span>
            <span className="mt-0.5 block text-xs text-[var(--muted)]">{t.nav.account}</span>
          </span>
          <span className="text-[var(--muted)] transition-transform group-hover:translate-x-0.5" aria-hidden="true">↗</span>
        </Link>

        <div className="my-2 h-px bg-[var(--border)]" />

        <div className="px-2 pb-1 pt-1">
          <p className="px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{t.nav.language}</p>
          <div className="mt-1 grid grid-cols-2 gap-1">
            {locales.map((item) => {
              const language = getLanguage(item);
              const href = getLocalizedPath(pathname, item);
              const active = item === currentLocale;
              return (
                <Link
                  key={item}
                  href={href}
                  hrefLang={item}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                  className={
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] " +
                    (active
                      ? "bg-[var(--accent-soft)] font-semibold text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]")
                  }
                >
                  <span className="font-bold uppercase tracking-[0.04em]">{item}</span>
                  <span className="truncate">{language.nativeLabel}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="my-2 h-px bg-[var(--border)]" />

        <div className="px-2 pb-1 pt-1">
          <p className="px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{t.theme.title}</p>
          <div className="mt-1">
            {[
              { value: "system", label: t.theme.system, icon: "system" },
              { value: "light", label: t.theme.light, icon: "light" },
              { value: "dark", label: t.theme.dark, icon: "dark" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectTheme(option.value)}
                className={optionClass + " w-full"}
                aria-pressed={theme === option.value}
              >
                <Icon>
                  {option.icon === "system" ? (
                    <>
                      <rect x="3.5" y="4" width="17" height="12" rx="1.8" />
                      <path d="M8 20h8M12 16v4" />
                    </>
                  ) : option.icon === "dark" ? (
                    <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </>
                  )}
                </Icon>
                <span className="flex-1 text-left">{option.label}</span>
                {theme === option.value && <span aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <p className="px-3 pb-2 pt-1 text-[11px] text-[var(--muted)]">
          {currentLanguage.nativeLabel}
        </p>
      </div>
    </div>
  );
}
