import type { CSSProperties } from "react";
import styles from "./progress-indicator.module.css";

type ProgressStyle = CSSProperties & {
  "--progress-color"?: string;
  "--progress-track"?: string;
};

type ProgressIndicatorProps = {
  label: string;
  value?: number;
  className?: string;
  style?: ProgressStyle;
};

export function ProgressIndicator({ label, value, className = "", style }: ProgressIndicatorProps) {
  const determinate = typeof value === "number" && Number.isFinite(value);
  const normalizedValue = determinate ? Math.max(0, Math.min(100, value)) : undefined;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      {...(normalizedValue === undefined ? {} : { "aria-valuenow": normalizedValue })}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={style}
    >
      <span className={styles.track} aria-hidden="true">
        <span
          className={styles.indicator}
          data-indeterminate={normalizedValue === undefined ? "true" : "false"}
          style={normalizedValue === undefined ? undefined : { width: `${normalizedValue}%` }}
        />
      </span>
    </div>
  );
}
