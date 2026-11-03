"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import AppLink from "@/components/ui/AppLink";
import { IconButton } from "@/components/ui/IconButton";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { localeNoticeMessages } from "@/lib/i18n/locale-notice";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getLocalizedPath } from "@/lib/tools/routes";

type NoticeState = {
  pathname: string;
  preferredLocale: Locale | null;
  dismissed: boolean;
};

export default function LocalePreferenceBanner({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [noticeState, setNoticeState] = useState<NoticeState>({
    pathname: "",
    preferredLocale: null,
    dismissed: false,
  });
  const t = localeNoticeMessages[locale];
  const isCurrentPath = noticeState.pathname === pathname;
  const preferredLocale = isCurrentPath ? noticeState.preferredLocale : null;
  const dismissed = isCurrentPath && noticeState.dismissed;

  useEffect(() => {
    const hasSupabaseSessionCookie = document.cookie.split(";").some((cookie) => {
      const name = cookie.trim().split("=")[0];
      return /^sb-.+-auth-token(?:\.\d+)?$/.test(name);
    });
    if (!hasSupabaseSessionCookie) return;

    const controller = new AbortController();
    void fetch("/api/account/locale-preference", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the account language.");
        const data = await response.json() as { locale?: string | null };
        setNoticeState({
          pathname,
          preferredLocale: isLocale(data.locale ?? undefined) ? data.locale : null,
          dismissed: false,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setNoticeState({ pathname, preferredLocale: null, dismissed: false });
        }
      });

    return () => controller.abort();
  }, [pathname]);

  if (!preferredLocale || preferredLocale === locale || dismissed) return null;

  const targetPath = getLocalizedPath(pathname, preferredLocale);

  function handleSwitch(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    const suffix = window.location.search + window.location.hash;
    if (!suffix) return;

    event.preventDefault();
    router.push(targetPath + suffix);
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full border-b border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--warning)]"
    >
      <div className="mx-auto flex min-h-14 w-full max-w-[var(--layout-content-wide)] items-center gap-[var(--space-2)] px-[var(--layout-page-gutter)] py-[var(--space-1)]">
        <MaterialIcon name="warning" size={18} className="shrink-0" />
        <p className="m3-type-body-small min-w-0 flex-1">{t.message}</p>
        <AppLink
          variant="text"
          href={targetPath}
          onClick={handleSwitch}
          colors={{ contentColor: "var(--warning)" }}
          className="shrink-0"
        >
          {t.action}
        </AppLink>
        <IconButton
          label={t.dismiss}
          onClick={() => setNoticeState({ pathname, preferredLocale, dismissed: true })}
          colors={{ contentColor: "var(--warning)" }}
        >
          <MaterialIcon name="close" size={18} />
        </IconButton>
      </div>
    </div>
  );
}
