import type { CSSProperties } from "react";
import styles from "./circular-progress-indicator.module.css";

type CircularProgressStyle = CSSProperties & {
  "--progress-color"?: string;
  "--progress-track"?: string;
};

export type CircularProgressIndicatorProps = {
  label: string;
  value?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CircularProgressStyle;
};

/** Source-informed Web adaptation of AndroidX Material 3 CircularProgressIndicator. */
export function CircularProgressIndicator({
  label, value, size = 40, strokeWidth = 4, className = "", style,
}: CircularProgressIndicatorProps) {
  const determinate = typeof value === "number" && Number.isFinite(value);
  const normalizedValue = determinate ? Math.max(0, Math.min(100, value)) : undefined;
  const radius = Math.max(0, (size - strokeWidth) / 2);
  const circumference = 2 * Math.PI * radius;
  const dashOffset = normalizedValue === undefined ? undefined : circumference * (1 - normalizedValue / 100);

  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100}
      {...(normalizedValue === undefined ? {} : { "aria-valuenow": normalizedValue })}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, ...style }}
      data-indeterminate={normalizedValue === undefined ? "true" : "false"}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" aria-hidden="true" focusable="false">
        <circle className={styles.track} cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} />
        <circle className={styles.indicator} cx={size / 2} cy={size / 2} r={radius} fill="none"
          strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={dashOffset}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
    </div>
  );
}
