import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ListItem.module.css";

type ListItemProps = HTMLAttributes<HTMLDivElement> & {
  /** Main label, equivalent to AndroidX ListItem's content/headline slot. */
  headline: ReactNode;
  /** Supporting text rendered below the headline. */
  supporting?: ReactNode;
  /** Short label rendered above the headline. */
  overline?: ReactNode;
  /** Optional leading icon, avatar or other content. */
  leading?: ReactNode;
  /** Optional trailing metadata, icon or control. */
  trailing?: ReactNode;
  /** Explicit layout template; defaults from the supplied text slots. */
  lines?: 1 | 2 | 3;
};

/**
 * Web composition port of the standard AndroidX Material 3 ListItem.
 * Navigation and actions must remain native anchors/buttons outside this
 * presentational component so browser semantics are preserved.
 */
export function ListItem({
  headline,
  supporting,
  overline,
  leading,
  trailing,
  lines = overline && supporting ? 3 : supporting || overline ? 2 : 1,
  className = "",
  ...props
}: ListItemProps) {
  return (
    <div
      {...props}
      className={[styles.item, styles[`lines-${lines}`], className]
        .filter(Boolean)
        .join(" ")}
    >
      {leading ? <div className={styles.leading}>{leading}</div> : null}
      <div className={styles.content}>
        {overline ? <span className={styles.overline}>{overline}</span> : null}
        <span className={styles.headline}>{headline}</span>
        {supporting ? <span className={styles.supporting}>{supporting}</span> : null}
      </div>
      {trailing ? <div className={styles.trailing}>{trailing}</div> : null}
    </div>
  );
}
