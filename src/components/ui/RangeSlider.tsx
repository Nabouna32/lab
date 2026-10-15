import type { CSSProperties } from "react";
import styles from "./RangeSlider.module.css";

type RangeSliderStyle = CSSProperties & {
  "--range-active"?: string;
  "--range-inactive"?: string;
  "--range-thumb"?: string;
  "--range-focus"?: string;
  "--range-label"?: string;
};

export type RangeSliderProps = {
  inputId: string;
  label: string;
  value: [number, number];
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  minGap?: number;
  valueText?: (value: number) => string;
  onValueChange: (value: [number, number]) => void;
  className?: string;
  style?: RangeSliderStyle;
};

/** Shared Web adaptation of AndroidX Material 3 RangeSlider.
 * Uses two native range inputs for independent keyboard/accessibility controls.
 */
export function RangeSlider({
  inputId,
  label,
  value,
  min,
  max,
  step = 1,
  disabled = false,
  minGap = 0,
  valueText = (number) => String(number),
  onValueChange,
  className = "",
  style,
}: RangeSliderProps) {
  const safeMin = Math.min(min, max);
  const safeMax = Math.max(min, max);
  const lower = Math.max(safeMin, Math.min(value[0], value[1], safeMax));
  const upper = Math.min(safeMax, Math.max(value[0], value[1], safeMin));
  const range = safeMax - safeMin;
  const start = range > 0 ? ((lower - safeMin) / range) * 100 : 0;
  const end = range > 0 ? ((upper - safeMin) / range) * 100 : 100;
  const css = {
    "--range-start": `${start}%`,
    "--range-end": `${end}%`,
    ...style,
  } as RangeSliderStyle;

  function changeStart(next: number) {
    onValueChange([Math.max(safeMin, Math.min(next, upper - minGap)), upper]);
  }
  function changeEnd(next: number) {
    onValueChange([lower, Math.min(safeMax, Math.max(next, lower + minGap))]);
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} style={css} data-disabled={disabled ? "true" : "false"}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <output className={styles.value}>{valueText(lower)} – {valueText(upper)}</output>
      </div>
      <div className={styles.track}>
        <input
          id={`${inputId}-min`}
          className={`${styles.input} ${styles.startInput}`}
          type="range"
          aria-label={`${label} minimum`}
          aria-valuetext={valueText(lower)}
          min={safeMin}
          max={Math.max(safeMin, upper - minGap)}
          step={step}
          value={lower}
          disabled={disabled}
          onChange={(event) => changeStart(Number(event.target.value))}
        />
        <input
          id={`${inputId}-max`}
          className={`${styles.input} ${styles.endInput}`}
          type="range"
          aria-label={`${label} maximum`}
          aria-valuetext={valueText(upper)}
          min={Math.min(safeMax, lower + minGap)}
          max={safeMax}
          step={step}
          value={upper}
          disabled={disabled}
          onChange={(event) => changeEnd(Number(event.target.value))}
        />
      </div>
    </div>
  );
}
