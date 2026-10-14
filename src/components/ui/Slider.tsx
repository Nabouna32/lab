import type { CSSProperties } from "react";
import styles from "./slider.module.css";

type SliderStyle = CSSProperties & {
  "--slider-active"?: string;
  "--slider-inactive"?: string;
  "--slider-label-color"?: string;
  "--slider-value-color"?: string;
  "--slider-description-color"?: string;
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

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} style={style}>
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
