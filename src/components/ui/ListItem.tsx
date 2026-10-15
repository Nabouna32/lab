import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ListItem.module.css";

type ListItemProps = HTMLAttributes<HTMLDivElement> & {
  headline: ReactNode;
  supporting?: ReactNode;
  overline?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  lines?: 1 | 2 | 3;
  interactive?: boolean;
};

/** Source-informed Web adaptation of AndroidX Material 3 ListItem. */
export function ListItem({
  headline, supporting, overline, leading, trailing, lines = supporting ? 2 : 1,
  interactive = false, className = "", ...props
}: ListItemProps) {
  return <div {...props} className={[styles.item, styles[`lines-${lines}`], interactive ? styles.interactive : "", className].filter(Boolean).join(" ")}
    data-interactive={interactive ? "true" : "false"}>
    {leading && <div className={styles.leading}>{leading}</div>}
    <div className={styles.content}>
      {overline && <span className={styles.overline}>{overline}</span>}
      <span className={styles.headline}>{headline}</span>
      {supporting && <span className={styles.supporting}>{supporting}</span>}
    </div>
    {trailing && <div className={styles.trailing}>{trailing}</div>}
  </div>;
}
