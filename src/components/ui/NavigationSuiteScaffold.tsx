import type { ReactNode } from "react";
import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { NavigationBar } from "@/components/ui/NavigationBar";
import { NavigationRail } from "@/components/ui/NavigationRail";
import { NavigationDrawer } from "@/components/ui/NavigationDrawer";
import styles from "./NavigationSuiteScaffold.module.css";

export type NavigationSuiteItem = {
  key: string;
  label: string;
  icon: MaterialIconName;
  disabled?: boolean;
  /** Optional product icon node (e.g. brand/collection icons) overriding the Material Symbol. */
  iconNode?: ReactNode;
  /** When provided, the destination renders as a link so navigation keeps its native semantics. */
  href?: string;
  /** Test/selector hook forwarded as `data-nav-key`; not part of the AndroidX contract. */
  navKey?: string;
};

export type NavigationSuiteType = "auto" | "bottom" | "rail" | "drawer";

export type NavigationSuiteScaffoldProps = {
  items: NavigationSuiteItem[];
  selectedKey: string;
  onSelect?: (key: string) => void;
  content: ReactNode;
  label: string;
  title: string;
  /** Explicit layout type. Default "auto" chooses based on viewport. */
  layoutType?: NavigationSuiteType;
};

/**
 * Web adaptation of AndroidX material3-adaptive-navigation-suite NavigationSuiteScaffold.
 * Stable artifact 1.4.0, immutable source commit and exact API dump are pinned.
 * Accepts explicit `layoutType` ("auto" | "bottom" | "rail" | "drawer") instead of
 * inferring from viewport, matching AndroidX NavigationSuiteType.
 */
export function NavigationSuiteScaffold({
  items,
  selectedKey,
  onSelect,
  content,
  label,
  title,
  layoutType = "auto",
}: NavigationSuiteScaffoldProps) {
  return (
    <div className={styles.root} data-layout={layoutType}>
      {(layoutType === "auto" || layoutType === "bottom") && (
        <div className={styles.mobileNavigation}>
          <NavigationBar items={items} selectedKey={selectedKey} onSelect={onSelect} label={label} />
        </div>
      )}
      {(layoutType === "auto" || layoutType === "rail") && (
        <div className={styles.mediumNavigation}>
          <NavigationRail items={items} selectedKey={selectedKey} onSelect={onSelect} label={label} />
        </div>
      )}
      {(layoutType === "auto" || layoutType === "drawer") && (
        <div className={styles.expandedNavigation}>
          <NavigationDrawer
            open={true}
            onOpenChange={() => {}}
            mode="permanent"
            items={items}
            selectedKey={selectedKey}
            onSelect={onSelect}
            label={label}
            title={title}
          />
        </div>
      )}
      <main className={styles.content}>{content}</main>
    </div>
  );
}