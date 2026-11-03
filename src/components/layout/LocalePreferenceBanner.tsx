"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import AppLink from "@/components/ui/AppLink";
import { IconButton } from "@/components/ui/IconButton";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { localeNoticeMessages } from "@/lib/i18n/locale-notice";
import type { Locale } from "@/lib/i18n/config";
import { getLocalizedPath } from "@/lib/tools/routes";

export default function LocalePreferenceBanner({
  locale,
  preferredLocale,
}: {
  locale: Locale;
  preferredLocale: Locale | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const t = localeNoticeMessages[locale];

  useEffect(() => {
    setDismissed(false);
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
          onClick={() => setDismissed(true)}
          colors={{ contentColor: "var(--warning)" }}
        >
          <MaterialIcon name="close" size={18} />
        </IconButton>
      </div>
    </div>
  );
}
