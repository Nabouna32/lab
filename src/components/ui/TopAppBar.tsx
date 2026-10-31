import type { CSSProperties, ReactNode } from "react";
import styles from "./TopAppBar.module.css";

type TopAppBarBaseProps = {
  /** AndroidX title composable; a Web title may be a brand link, not a document heading. */
  title: ReactNode;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Web adaptation for page gutters and a constrained content width. */
  contentStyle?: CSSProperties;
};

type TopAppBarNavigationProps =
  | {
      onNavigationClick: () => void;
      /** Required whenever a navigation action is rendered; callers supply a localized label. */
      navigationLabel: string;
      navigationIcon: ReactNode;
    }
  | {
      onNavigationClick?: undefined;
      navigationLabel?: never;
      navigationIcon?: never;
    };

export type TopAppBarProps = TopAppBarBaseProps & TopAppBarNavigationProps;

/** Small AndroidX Material 3 TopAppBar adapted for the shared Web application header. */
export function TopAppBar(props: TopAppBarProps) {
  const {
    title,
    actions,
    className = "",
    style,
    contentStyle,
  } = props;
  const navigation = "onNavigationClick" in props && typeof props.onNavigationClick === "function"
    ? props
    : null;

  return (
    <header className={[styles.root, className].filter(Boolean).join(" ")} style={style}>
      <div className={styles.row} style={contentStyle}>
        {navigation ? (
          <button
            type="button"
            className={styles.navigation}
            aria-label={navigation.navigationLabel}
            onClick={navigation.onNavigationClick}
          >
            {navigation.navigationIcon}
          </button>
        ) : null}
        <div className={styles.title}>{title}</div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </header>
  );
}
