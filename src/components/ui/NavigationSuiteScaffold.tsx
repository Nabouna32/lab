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
};

export type NavigationSuiteScaffoldProps = {
  items: NavigationSuiteItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
  content: ReactNode;
  label: string;
  title: string;
};

/**
 * Partial Web adaptation of AndroidX material3-adaptive-navigation-suite
 * NavigationSuiteScaffold. Its artifact version/source commit is not yet pinned.
 * CSS viewport breakpoints currently choose bottom navigation, rail or drawer;
 * this is not parity with NavigationSuiteType/WindowAdaptiveInfo and must not
 * impose a product-wide navigation choice. Rebuild with an explicit layout type.
 */
export function NavigationSuiteScaffold({
  items,
  selectedKey,
  onSelect,
  content,
  label,
  title,
}: NavigationSuiteScaffoldProps) {
  return (
    <div className={styles.root}>
      <div className={styles.mobileNavigation}>
        <NavigationBar items={items} selectedKey={selectedKey} onSelect={onSelect} label={label}/>
      </div>
      <div className={styles.mediumNavigation}>
        <NavigationRail items={items} selectedKey={selectedKey} onSelect={onSelect} label={label}/>
      </div>
      <div className={styles.expandedNavigation}>
        <NavigationDrawer open={true} onOpenChange={() => {}} mode="permanent" items={items} selectedKey={selectedKey} onSelect={onSelect} label={label} title={title}/>
      </div>
      <main className={styles.content}>{content}</main>
    </div>
  );
}
