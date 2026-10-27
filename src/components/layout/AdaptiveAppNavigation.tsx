"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import LocularyLogo from "@/components/brand/LocularyLogo";
import { CollectionIcon } from "@/components/ui/CollectionIcon";
import { StarIcon } from "@/components/ui/StarIcon";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolsPath, getGuidedWorkflowsPath } from "@/lib/tools/routes";
import styles from "./AdaptiveAppNavigation.module.css";

type Destination = {
  key: string;
  href: string;
  label: string;
  icon: "home" | "apps" | "person";
  group: "main" | "personal";
  match: (pathname: string) => boolean;
  customIcon?: "star" | "collections";
};

export default function AdaptiveAppNavigation({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = getMessages(locale);
  const destinations = useMemo<Destination[]>(() => {
    const home = `/${locale}`;
    const tools = getToolsPath(locale);
    const guided = getGuidedWorkflowsPath(locale);
    const favorites = `/${locale}/favoris`;
    const collections = `/${locale}/collections`;
    const account = `/${locale}/compte`;
    return [
      { key: "home", href: home, label: t.nav.home, icon: "home", group: "main", match: (path) => path === home },
      { key: "tools", href: tools, label: t.nav.explore, icon: "apps", group: "main", match: (path) => path === tools || path.startsWith(tools + "/") || path.startsWith(`/${locale}/categories`) },
      { key: "guided", href: guided, label: t.guidedWorkflows.homeTitle, icon: "apps", group: "main", match: (path) => path === guided || path.startsWith(guided + "/") },
      { key: "favorites", href: favorites, label: t.nav.favorites, icon: "apps", group: "personal", customIcon: "star", match: (path) => path === favorites || path.startsWith(favorites + "/") },
      { key: "collections", href: collections, label: t.nav.collections, icon: "apps", group: "personal", customIcon: "collections", match: (path) => path === collections || path.startsWith(collections + "/") },
      { key: "account", href: account, label: t.nav.space, icon: "person", group: "personal", match: (path) => path === account || path.startsWith(account + "/") },
    ];
  }, [locale, t]);

  const active = destinations.find((item) => item.match(pathname))?.key ?? "home";
  const primary = destinations.filter((item) => ["home", "tools", "guided", "favorites", "account"].includes(item.key));

  function iconFor(item: Destination) {
    if (item.customIcon === "star") return <StarIcon filled className={styles.customIcon} />;
    if (item.customIcon === "collections") return <CollectionIcon className={styles.customIcon} />;
    return <MaterialIcon name={item.icon} size={24} />;
  }

  function link(item: Destination, compact = false) {
    const selected = active === item.key;
    return (
      <Link
        key={item.key}
        href={item.href}
        prefetch={item.key === "account" ? false : undefined}
        aria-current={selected ? "page" : undefined}
        data-selected={selected ? "true" : "false"}
        className={compact ? styles.mobileItem : styles.desktopItem}
      >
        <span className={compact ? styles.mobileIcon : styles.desktopIcon} aria-hidden="true">{iconFor(item)}</span>
        <span className={compact ? styles.mobileLabel : styles.desktopLabel}>{item.label}</span>
      </Link>
    );
  }

  return (
    <>
      <aside className={styles.sidebar} aria-label={t.nav.menu}>
        <Link href={`/${locale}`} className={styles.brand} aria-label={`Loculary — ${t.nav.home}`}>
          <LocularyLogo wordmarkClassName="hidden text-base font-bold tracking-[-0.03em] min-[1200px]:inline" />
        </Link>
        <nav className={styles.desktopNav} aria-label={t.nav.menu}>
          <div className={styles.group}>{destinations.filter((item) => item.group === "main").map((item) => link(item))}</div>
          <div className={styles.separator} />
          <p className={styles.groupLabel}>{t.nav.space}</p>
          <div className={styles.group}>{destinations.filter((item) => item.group === "personal").map((item) => link(item))}</div>
        </nav>
        <div className={styles.sidebarFooter}>
          <span className={styles.footerHint}>{t.nav.account}</span>
        </div>
      </aside>
      <nav className={styles.mobileNav} aria-label={t.nav.menu}>
        {primary.map((item) => link(item, true))}
      </nav>
    </>
  );
}
