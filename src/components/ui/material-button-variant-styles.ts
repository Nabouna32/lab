/**
 * Shared visual contract for AndroidX Material 3 Button variants.
 *
 * Used by native buttons and web anchors that intentionally adopt a button
 * treatment. Element semantics remain owned by each caller.
 */
import type { CSSProperties } from "react";

export type MaterialButtonVariant = "filled" | "elevated" | "filled-tonal" | "outlined" | "text";

export type MaterialButtonColors = {
  containerColor?: string;
  contentColor?: string;
  disabledContainerColor?: string;
  disabledContentColor?: string;
};

export function getMaterialButtonInlineStyle(
  variant: MaterialButtonVariant | null,
  colors: MaterialButtonColors | undefined,
  style: CSSProperties | undefined,
): CSSProperties {
  const suppliedStyle = style as (CSSProperties & Record<string, string | undefined>) | undefined;
  const explicitContainerColor = colors?.containerColor ?? suppliedStyle?.["--button-container-color"];
  return {
    ...style,
    ...(variant === "elevated" ? {
      "--button-container-color": explicitContainerColor ?? "color-mix(in srgb, var(--surface) 94.88%, var(--surface-tint))",
      "--button-elevated-hover-container-color": explicitContainerColor ?? "color-mix(in srgb, var(--surface) 93.06%, var(--surface-tint))",
    } : {}),
    ...(colors?.containerColor !== undefined ? { "--button-container-color": colors.containerColor } : {}),
    ...(colors?.contentColor !== undefined ? { "--button-content-color": colors.contentColor } : {}),
    ...(colors?.disabledContainerColor !== undefined ? { "--button-disabled-container-color": colors.disabledContainerColor } : {}),
    ...(colors?.disabledContentColor !== undefined ? { "--button-disabled-content-color": colors.disabledContentColor } : {}),
  } as CSSProperties;
}

const filled = [
  "border border-transparent bg-[var(--button-container-color,var(--primary))] text-[color:var(--button-content-color,var(--on-primary))]",
  "hover:bg-[color-mix(in_srgb,var(--button-container-color,var(--primary))_92%,var(--button-content-color,var(--on-primary)))] hover:shadow-[var(--button-elevation-1)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--button-container-color,var(--primary))_90%,var(--button-content-color,var(--on-primary)))] focus-visible:shadow-none",
  "active:shadow-none",
  "disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_10%,transparent))] disabled:text-[color:var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))] disabled:shadow-none",
].join(" ");

const elevated = [
  "border border-transparent bg-[var(--button-container-color)] text-[color:var(--button-content-color,var(--primary))] shadow-[var(--button-elevation-1)]",
  "hover:shadow-[var(--button-elevation-2)] hover:bg-[color-mix(in_srgb,var(--button-elevated-hover-container-color)_92%,var(--button-content-color,var(--primary)))]",
  "focus-visible:bg-[color-mix(in_srgb,var(--button-container-color)_90%,var(--button-content-color,var(--primary)))] focus-visible:shadow-[var(--button-elevation-1)]",
  "active:shadow-[var(--button-elevation-1)]",
  "disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_10%,transparent))] disabled:text-[color:var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))] disabled:shadow-none",
].join(" ");

const filledTonal = [
  "border border-transparent bg-[var(--button-container-color,var(--secondary-container))] text-[color:var(--button-content-color,var(--on-secondary-container))]",
  "hover:bg-[color-mix(in_srgb,var(--button-container-color,var(--secondary-container))_92%,var(--button-content-color,var(--on-secondary-container)))] hover:shadow-[var(--button-elevation-1)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--button-container-color,var(--secondary-container))_90%,var(--button-content-color,var(--on-secondary-container)))] focus-visible:shadow-none",
  "active:shadow-none",
  "disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_12%,transparent))] disabled:text-[color:var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))] disabled:shadow-none",
].join(" ");

const outlined = [
  "border border-[var(--outline)] bg-[var(--button-container-color,transparent)] text-[color:var(--button-content-color,var(--primary))]",
  "hover:bg-[color-mix(in_srgb,var(--button-content-color,var(--primary))_8%,transparent)]",
  "focus-visible:border-[var(--primary)] focus-visible:bg-[color-mix(in_srgb,var(--button-content-color,var(--primary))_10%,transparent)]",
  "disabled:bg-[var(--button-disabled-container-color,transparent)] disabled:border-[color-mix(in_srgb,var(--outline-variant)_10%,transparent)] disabled:text-[color:var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface-variant)_38%,transparent))]",
].join(" ");

const text = [
  "border border-transparent bg-[var(--button-container-color,transparent)] text-[color:var(--button-content-color,var(--primary))]",
  "hover:bg-[color-mix(in_srgb,var(--button-content-color,var(--primary))_8%,transparent)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--button-content-color,var(--primary))_10%,transparent)]",
  "disabled:bg-[var(--button-disabled-container-color,transparent)] disabled:text-[color:var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface-variant)_38%,transparent))]",
].join(" ");

export const materialButtonVariantStyles: Record<MaterialButtonVariant, string> = {
  filled,
  elevated,
  "filled-tonal": filledTonal,
  outlined,
  text,
};
