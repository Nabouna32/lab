import type { CSSProperties, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./TopAppBar.module.css";

type TopAppBarBaseProps = {
  /** AndroidX title composable; a Web title may be a brand link, not a document heading. */
  title: ReactNode;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Web adaptation for page gutters and a constrained content width. */
  contentClassName?: string;
  contentStyle?: CSSProperties;
};

type TopAppBarNavigationProps =
  | {
      onNavigationClick: () => void;
      /** Required whenever a navigation action is rendered; callers supply a localized label. */
      navigationLabel: string;
      navigationIcon?: ReactNode;
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
    contentClassName = "",
    contentStyle,
  } = props;
  const navigation = "onNavigationClick" in props && typeof props.onNavigationClick === "function"
    ? props
    : null;

  return (
    <header className={[styles.root, className].filter(Boolean).join(" ")} style={style}>
      <div className={[styles.row, contentClassName].filter(Boolean).join(" ")} style={contentStyle}>
        {navigation ? (
          <button
            type="button"
            className={styles.navigation}
            aria-label={navigation.navigationLabel}
            onClick={navigation.onNavigationClick}
          >
            {navigation.navigationIcon ?? <MaterialIcon name="menu" size={24} />}
          </button>
        ) : null}
        <div className={styles.title}>{title}</div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </header>
  );
}
