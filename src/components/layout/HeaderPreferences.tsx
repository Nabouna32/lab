"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@teispace/next-themes";
import { getLanguage, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getGuidedWorkflowsPath, getLocalizedPath, getSearchResultsPagePath } from "@/lib/tools/routes";
import { getMessages } from "@/lib/i18n/messages";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

function subscribeHydrationReady() {
  return () => {};
}

function getHydrationReadySnapshot() {
  return true;
}

function getServerHydrationReadySnapshot() {
  return false;
}

const themeOptions = [
  { value: "system", icon: "devices" },
  { value: "light", icon: "light_mode" },
  { value: "dark", icon: "dark_mode" },
] as const;

export default function HeaderPreferences({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const themeReady = useSyncExternalStore(
    subscribeHydrationReady,
    getHydrationReadySnapshot,
    getServerHydrationReadySnapshot,
  );
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const currentLocaleSegment = pathname.split("/")[1];
  const currentLocale: Locale = isLocale(currentLocaleSegment) ? currentLocaleSegment : locale;
  const t = getMessages(locale);
  const guidedPath = getGuidedWorkflowsPath(locale);
  const guidedActive = pathname === guidedPath || pathname.startsWith(guidedPath + "/");

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!rootRef.current?.contains(target)) setOpenPath(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpenPath(null);
      triggerRef.current?.focus();
    }

    function handlePopState() {
      setOpenPath(null);
    }

    const desktopQuery = window.matchMedia("(min-width: 768px)");
    function handleViewportChange() {
      if (desktopQuery.matches) setOpenPath(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("popstate", handlePopState);
    desktopQuery.addEventListener("change", handleViewportChange);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("popstate", handlePopState);
      desktopQuery.removeEventListener("change", handleViewportChange);
    };
  }, [open]);

  function languageHref(nextLocale: Locale) {
    return getLocalizedPath(pathname, nextLocale);
  }

  function handleLanguageClick(event: MouseEvent<HTMLAnchorElement>, nextLocale: Locale) {
    setOpenPath(null);
    if (
      pathname === getSearchResultsPagePath(currentLocale) &&
      window.location.hash &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      router.push(languageHref(nextLocale) + window.location.hash);
    }
  }

  function renderThemeOptions(compact: boolean) {
    return themeOptions.map((option) => {
      const label = t.theme[option.value];
      const selected = themeReady && theme === option.value;
      return (
        <label
          key={option.value}
          className={
            compact
              ? "min-w-0 cursor-pointer"
              : "cursor-pointer"
          }
        >
          <input
            type="radio"
            name={compact ? "loculary-theme-mobile" : "loculary-theme-desktop"}
            value={option.value}
            aria-label={label}
            checked={selected}
            onChange={() => setTheme(option.value)}
            className="peer sr-only"
          />
          <span
            className={
              compact
                ? "m3-type-label-medium flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[var(--muted)] outline-none transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-[var(--focus-ring)] peer-checked:bg-[var(--primary-container)] peer-checked:text-[var(--on-primary-container)]"
                : "flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted)] outline-none transition-colors hover:bg-[var(--surface-soft)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--focus-ring)] peer-checked:bg-[var(--primary-container)] peer-checked:text-[var(--on-primary-container)]"
            }
            title={label}
          >
            <MaterialIcon
              name={option.icon}
              size={compact ? 18 : 20}
            />
            {compact ? <span>{label}</span> : null}
          </span>
        </label>
      );
    });
  }

  return (
    <>
      <div className="hidden items-center gap-3 md:flex">
        <nav aria-label={t.nav.language} className="flex items-center gap-1 rounded-full bg-[var(--surface-container)] p-1">
          {locales.map((item) => {
            const language = getLanguage(item);
            const active = item === currentLocale;
            return (
              <Link
                key={item}
                href={languageHref(item)}
                hrefLang={item}
                aria-label={language.nativeLabel}
                aria-current={active ? "page" : undefined}
                onClick={(event) => handleLanguageClick(event, item)}
                className={
                  "m3-type-label-medium flex h-8 min-w-9 items-center justify-center rounded-full px-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] " +
                  (active
                    ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
                    : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)]")
                }
              >
                {item.toUpperCase()}
              </Link>
            );
          })}
        </nav>
        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">{t.theme.title}</legend>
          {renderThemeOptions(false)}
        </fieldset>
      </div>

      <div ref={rootRef} className="relative md:hidden">
        <button
          ref={triggerRef}
          type="button"
          className={
            "flex h-12 min-w-12 items-center justify-center rounded-full text-[var(--on-surface)] outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] " +
            ((open || guidedActive) ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]" : "")
          }
          aria-label={t.nav.more}
          aria-expanded={open}
          aria-controls={open ? "mobile-secondary-navigation" : undefined}
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          <MaterialIcon name="more_horiz" size={24} />
        </button>

        <div
          id="mobile-secondary-navigation"
          aria-hidden={!open}
          inert={!open}
          className={
            "absolute end-0 top-full z-[70] mt-2 w-[min(20rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-9rem)] overflow-y-auto overscroll-contain origin-top rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container)] p-2 shadow-[var(--shadow-lg)] transition-[opacity,transform] duration-150 " +
            (open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0")
          }
        >
          <nav aria-label={t.nav.primaryNavigation}>
            <Link
              href={guidedPath}
              aria-current={guidedActive ? "page" : undefined}
              onClick={() => setOpenPath(null)}
              className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 text-[var(--on-surface)] outline-none transition-colors hover:bg-[var(--surface-container-high)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--secondary-container)] text-[var(--on-secondary-container)]" aria-hidden="true">
                <MaterialIcon name="apps" size={20} />
              </span>
              <span className="m3-type-label-large">{t.guidedWorkflows.homeTitle}</span>
            </Link>
          </nav>

          <div className="my-2 h-px bg-[var(--outline-variant)]" />

          <div className="px-2 pb-1 pt-1">
            <p className="m3-type-label-small px-1 text-[var(--on-surface-variant)]">{t.nav.language}</p>
            <nav aria-label={t.nav.language} className="mt-1 grid grid-cols-2 gap-1">
              {locales.map((item) => {
                const language = getLanguage(item);
                const active = item === currentLocale;
                return (
                  <Link
                    key={item}
                    href={languageHref(item)}
                    hrefLang={item}
                    aria-current={active ? "page" : undefined}
                    onClick={(event) => handleLanguageClick(event, item)}
                    className={
                      "m3-type-label-large flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] " +
                      (active
                        ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                        : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)]")
                    }
                  >
                    <span className="m3-type-label-small uppercase">{item}</span>
                    <span className="truncate">{language.nativeLabel}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="my-2 h-px bg-[var(--outline-variant)]" />

          <fieldset className="min-w-0 px-2 pb-1 pt-1">
            <legend className="m3-type-label-small px-1 text-[var(--on-surface-variant)]">{t.theme.title}</legend>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {renderThemeOptions(true)}
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
}
