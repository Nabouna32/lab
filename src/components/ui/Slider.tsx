import type { CSSProperties } from "react";
import styles from "./slider.module.css";

type SliderStyle = CSSProperties & {
  "--slider-active"?: string;
  "--slider-inactive"?: string;
  "--slider-label-color"?: string;
  "--slider-value-color"?: string;
  "--slider-description-color"?: string;
  "--slider-focus-ring"?: string;
  "--slider-disabled-active"?: string;
  "--slider-disabled-inactive"?: string;
  "--slider-disabled-thumb"?: string;
  "--slider-disabled-label"?: string;
};

type SliderProps = {
  inputId: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  valueLabel?: string;
  valueText?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  style?: SliderStyle;
  onValueChange: (value: number) => void;
};

export function Slider({
  inputId,
  label,
  value,
  min,
  max,
  step = 1,
  valueLabel = String(value),
  valueText = valueLabel,
  description,
  disabled = false,
  className = "",
  style,
  onValueChange,
}: SliderProps) {
  const range = max - min;
  const progress = range > 0 ? Math.max(0, Math.min(100, ((value - min) / range) * 100)) : 0;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const semanticStyle: SliderStyle = {
    "--slider-active": "var(--primary)",
    "--slider-inactive": "var(--surface-variant)",
    "--slider-focus-ring": "var(--focus-ring)",
    "--slider-disabled-active": "color-mix(in srgb, var(--on-surface) 38%, transparent)",
    "--slider-disabled-inactive": "color-mix(in srgb, var(--on-surface) 12%, transparent)",
    "--slider-disabled-thumb": "color-mix(in srgb, var(--on-surface) 38%, transparent)",
    "--slider-disabled-label": "color-mix(in srgb, var(--on-surface) 38%, transparent)",
    ...style,
  };

  return (
    <div data-disabled={disabled ? "true" : "false"} className={[styles.root, className].filter(Boolean).join(" ")} style={semanticStyle}>
      <div className={styles.header}>
        <label htmlFor={inputId} className={styles.label}>{label}</label>
        <output htmlFor={inputId} className={styles.value}>{valueLabel}</output>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-describedby={descriptionId}
        aria-valuetext={valueText}
        onChange={(event) => onValueChange(Number(event.target.value))}
        className={styles.input}
        style={{ "--slider-progress": `${progress}%` } as CSSProperties}
      />
      {description && <p id={descriptionId} className={styles.description}>{description}</p>}
    </div>
  );
}
