"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import LocularyLogo from "@/components/brand/LocularyLogo";
import { CollectionIcon } from "@/components/ui/CollectionIcon";
import { StarIcon } from "@/components/ui/StarIcon";
import { NavigationBar } from "@/components/ui/NavigationBar";
import { NavigationRail } from "@/components/ui/NavigationRail";
import { NavigationDrawer } from "@/components/ui/NavigationDrawer";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolsPath, getGuidedWorkflowsPath } from "@/lib/tools/routes";
import styles from "./AdaptiveAppNavigation.module.css";

type Destination = {
  key: string;
  href: string;
  label: string;
  icon: "home" | "apps" | "person" | "search";
  group: "main" | "personal";
  match: (pathname: string) => boolean;
  customIcon?: "star" | "collections";
};

/** Destinations shown in the compact bottom bar; the rail and drawer expose all of them. */
const compactKeys = ["home", "tools", "favorites", "collections", "account"];

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
      { key: "tools", href: tools, label: t.nav.explore, icon: "search", group: "main", match: (path) => path === tools || path.startsWith(tools + "/") || path.startsWith(`/${locale}/categories`) },
      { key: "guided", href: guided, label: t.guidedWorkflows.homeTitle, icon: "apps", group: "main", match: (path) => path === guided || path.startsWith(guided + "/") },
      { key: "favorites", href: favorites, label: t.nav.favorites, icon: "apps", group: "personal", customIcon: "star", match: (path) => path === favorites || path.startsWith(favorites + "/") },
      { key: "collections", href: collections, label: t.nav.collections, icon: "apps", group: "personal", customIcon: "collections", match: (path) => path === collections || path.startsWith(collections + "/") },
      { key: "account", href: account, label: t.nav.space, icon: "person", group: "personal", match: (path) => path === account || path.startsWith(account + "/") },
    ];
  }, [locale, t]);

  const active = destinations.find((item) => item.match(pathname))?.key ?? "home";

  function iconNodeFor(item: Destination) {
    if (item.customIcon === "star") return <StarIcon filled size={24} />;
    if (item.customIcon === "collections") return <CollectionIcon className="h-6 w-6" />;
    return undefined;
  }

  const items = destinations.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    iconNode: iconNodeFor(item),
    href: item.href,
    navKey: item.key,
    section: item.group === "personal" ? t.nav.space : undefined,
  }));
  const compactItems = items.filter((item) => compactKeys.includes(item.key));

  function brand(wordmarkClassName?: string) {
    return (
      <Link href={`/${locale}`} className={styles.brand} aria-label={`Loculary - ${t.nav.home}`}>
        <LocularyLogo wordmarkClassName={wordmarkClassName} />
      </Link>
    );
  }

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.railSlot}>
          <NavigationRail
            items={items}
            selectedKey={active}
            label={t.nav.primaryNavigation}
            className={styles.railScroll}
            header={brand("hidden")}
          />
        </div>
        <div className={styles.drawerSlot}>
          <NavigationDrawer
            open
            onOpenChange={() => {}}
            mode="permanent"
            items={items}
            selectedKey={active}
            label={t.nav.primaryNavigation}
            title={brand()}
          />
        </div>
      </aside>
      <div className={styles.mobileSlot}>
        <NavigationBar items={compactItems} selectedKey={active} label={t.nav.primaryNavigation} className={styles.mobileBar} />
      </div>
    </>
  );
}
