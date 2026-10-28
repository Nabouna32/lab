"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@teispace/next-themes";
import { getLanguage, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getLocalizedPath, getSearchResultsPagePath, getToolsPath } from "@/lib/tools/routes";
import { getMessages } from "@/lib/i18n/messages";
import { StarIcon } from "@/components/ui/StarIcon";
import { CollectionIcon } from "@/components/ui/CollectionIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const triggerClass =
  "flex h-12 min-w-12 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--foreground)] outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 hover:bg-[var(--surface-soft)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

const menuOpenAfterLocaleSwitchKey = "loculary:header-menu-open-after-locale-switch";
const menuOpenListeners = new Set<() => void>();
let menuOpenSnapshot = false;
let menuOpenRestoreHandled = false;

function subscribeMenuOpen(listener: () => void) {
  menuOpenListeners.add(listener);
  return () => menuOpenListeners.delete(listener);
}

function getMenuOpenSnapshot() {
  return menuOpenSnapshot;
}

function getServerMenuOpenSnapshot() {
  return false;
}

function subscribeHydrationReady() {
  return () => {};
}

function getHydrationReadySnapshot() {
  return true;
}

function getServerHydrationReadySnapshot() {
  return false;
}

function clearMenuOpenRestoreMarker() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(menuOpenAfterLocaleSwitchKey);
  } catch {
    // Session storage can be unavailable in restricted browsing contexts.
  }
}

function setMenuOpen(next: boolean) {
  clearMenuOpenRestoreMarker();
  if (menuOpenSnapshot === next) return;
  menuOpenSnapshot = next;
  menuOpenListeners.forEach((listener) => listener());
}

function restoreMenuOpenAfterLocaleSwitch() {
  if (menuOpenRestoreHandled || typeof window === "undefined") return;
  menuOpenRestoreHandled = true;

  let shouldOpen = false;
  try {
    shouldOpen = window.sessionStorage.getItem(menuOpenAfterLocaleSwitchKey) === "open";
    window.sessionStorage.removeItem(menuOpenAfterLocaleSwitchKey);
  } catch {
    // Session storage can be unavailable in restricted browsing contexts.
  }
  setMenuOpen(shouldOpen);
}

function preserveMenuOpenForLocaleSwitch() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(menuOpenAfterLocaleSwitchKey, "open");
  } catch {
    // If storage is unavailable, the popup still stays open for SPA navigation.
  }
}

export default function DesktopHeaderMenu({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const themeReady = useSyncExternalStore(
    subscribeHydrationReady,
    getHydrationReadySnapshot,
    getServerHydrationReadySnapshot,
  );
  const t = getMessages(locale);
  const open = useSyncExternalStore(subscribeMenuOpen, getMenuOpenSnapshot, getServerMenuOpenSnapshot);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const currentLocaleSegment = pathname.split("/")[1];
  const currentLocale: Locale = isLocale(currentLocaleSegment) ? currentLocaleSegment : locale;

  useEffect(() => {
    restoreMenuOpenAfterLocaleSwitch();
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menuRef.current?.contains(target)) setMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        triggerRef.current?.focus();
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
    setMenuOpen(false);
  }

  function selectTheme(value: string) {
    // Theme controls are persistent settings inside this disclosure, not
    // one-shot menu commands: keep the surface open for further choices.
    clearMenuOpenRestoreMarker();
    setTheme(value);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass + " lg:h-10 lg:min-w-0" + (open ? " border-[var(--accent)] bg-[var(--surface-soft)] shadow-[var(--shadow-sm)]" : "")}
        aria-label={t.nav.menu}
        aria-expanded={open}
        aria-controls="header-menu"
        onClick={() => setMenuOpen(!open)}
      >
        <MaterialIcon name="menu" size={18} />
        <span className="hidden lg:inline">{t.nav.menu}</span>
      </button>

      <div
        id="header-menu"
        aria-hidden={!open}
        inert={!open}
        className={
          "absolute right-0 top-full z-[70] mt-3 w-[min(18rem,calc(100vw-1.5rem))] origin-top-right rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-2 shadow-[var(--shadow-lg)] transition-[opacity,transform] duration-150 " +
          (open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0")
        }
      >
        <Link
          href={getToolsPath(locale)}
          onClick={closeMenu}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] lg:hidden"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]" aria-hidden="true">
            <MaterialIcon name="apps" size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-[var(--foreground)]">{t.nav.explore}</span>
            <span className="mt-0.5 block text-xs text-[var(--muted)]">{t.nav.exploreDescription}</span>
          </span>
        </Link>

        <Link
          href={`/${locale}/favoris`}
          onClick={closeMenu}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] lg:hidden"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-container)] text-[var(--on-primary-container)]" aria-hidden="true"><StarIcon filled className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-[var(--foreground)]">{t.nav.favorites}</span>
            <span className="mt-0.5 block text-xs text-[var(--muted)]">{t.nav.favoritesDescription}</span>
          </span>
        </Link>

        <Link
          href={`/${locale}/collections`}
          onClick={closeMenu}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] lg:hidden"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]" aria-hidden="true"><CollectionIcon className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-[var(--foreground)]">{t.nav.collections}</span>
            <span className="mt-0.5 block text-xs text-[var(--muted)]">{t.nav.collectionsDescription}</span>
          </span>
        </Link>

        <div className="my-1.5 h-px bg-[var(--border)]" />

        <Link
          href={"/" + locale + "/compte"}
          prefetch={false}
          onClick={closeMenu}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]" aria-hidden="true">
            <MaterialIcon name="person" size={18} className="h-[1.1rem] w-[1.1rem]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-[var(--foreground)]">{t.nav.space}</span>
            <span className="mt-0.5 block text-xs text-[var(--muted)]">{t.nav.account}</span>
          </span>
          <MaterialIcon name="chevron_right" size={16} className="h-4 w-4 text-[var(--muted)] transition-transform group-hover:translate-x-0.5" />
        </Link>

        <div className="my-1.5 h-px bg-[var(--border)]" />

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
                  onClick={(event) => {
                    // Locale changes recreate the root layout. Keep this tab's
                    // popup open across that navigation, without persisting it
                    // as a long-lived preference.
                    if (
                      item !== currentLocale &&
                      event.button === 0 &&
                      !event.metaKey &&
                      !event.ctrlKey &&
                      !event.shiftKey &&
                      !event.altKey
                    ) {
                      preserveMenuOpenForLocaleSwitch();
                    }
                    if (pathname === getSearchResultsPagePath(currentLocale) && window.location.hash) {
                      event.preventDefault();
                      router.push(href + window.location.hash);
                    }
                  }}
                  className={
                    "flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] " +
                    (active
                      ? "bg-[var(--primary-container)] font-semibold text-[var(--on-primary-container)]"
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

        <div className="my-1.5 h-px bg-[var(--border)]" />

        <div className="px-2 pb-1 pt-1">
          <p className="px-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{t.theme.title}</p>
          <div className="mt-1 grid grid-cols-3 gap-1">
            {[
              { value: "system", label: t.theme.system, icon: "system" },
              { value: "light", label: t.theme.light, icon: "light" },
              { value: "dark", label: t.theme.dark, icon: "dark" },
            ].map((option) => {
              const selected = themeReady && theme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectTheme(option.value)}
                  className={
                    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] " +
                    (selected
                      ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]")
                  }
                  aria-pressed={selected}
                >
                  <MaterialIcon name={option.icon === "system" ? "devices" : option.icon === "dark" ? "dark_mode" : "light_mode"} size={18} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
