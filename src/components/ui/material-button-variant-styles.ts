/**
 * Shared visual contract for AndroidX Material 3 Button variants.
 *
 * Used by native buttons and web anchors that intentionally adopt a button
 * treatment. Element semantics remain owned by each caller.
 */
export type MaterialButtonVariant = "filled" | "elevated" | "filled-tonal" | "outlined" | "text";

const filled = [
  "border border-transparent bg-[var(--button-container-color,var(--primary))] text-[var(--button-content-color,var(--on-primary))]",
  "hover:bg-[color-mix(in_srgb,var(--button-container-color,var(--primary))_92%,var(--button-content-color,var(--on-primary)))] hover:shadow-[var(--button-elevation-1)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--button-container-color,var(--primary))_90%,var(--button-content-color,var(--on-primary)))] focus-visible:shadow-none",
  "active:shadow-none",
  "disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_10%,transparent))] disabled:text-[var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface-variant)_38%,transparent))] disabled:shadow-none",
].join(" ");

const elevated = [
  "border border-transparent bg-[var(--button-container-color,var(--surface-container-low))] text-[var(--button-content-color,var(--primary))] shadow-[var(--button-elevation-1)]",
  "hover:shadow-[var(--button-elevation-2)] hover:bg-[color-mix(in_srgb,var(--button-container-color,var(--surface-container-low))_92%,var(--button-content-color,var(--primary)))]",
  "focus-visible:bg-[color-mix(in_srgb,var(--button-container-color,var(--surface-container-low))_90%,var(--button-content-color,var(--primary)))] focus-visible:shadow-[var(--button-elevation-1)]",
  "active:shadow-[var(--button-elevation-1)]",
  "disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_10%,transparent))] disabled:text-[var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface-variant)_38%,transparent))] disabled:shadow-none",
].join(" ");

const filledTonal = [
  "border border-transparent bg-[var(--button-container-color,var(--secondary-container))] text-[var(--button-content-color,var(--on-secondary-container))]",
  "hover:bg-[color-mix(in_srgb,var(--button-container-color,var(--secondary-container))_92%,var(--button-content-color,var(--on-secondary-container)))] hover:shadow-[var(--button-elevation-1)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--button-container-color,var(--secondary-container))_90%,var(--button-content-color,var(--on-secondary-container)))] focus-visible:shadow-none",
  "active:shadow-none",
  "disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_10%,transparent))] disabled:text-[var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface-variant)_38%,transparent))] disabled:shadow-none",
].join(" ");

const outlined = [
  "border border-[var(--outline)] bg-[var(--button-container-color,transparent)] text-[var(--button-content-color,var(--primary))]",
  "hover:bg-[color-mix(in_srgb,var(--button-content-color,var(--primary))_8%,transparent)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--button-content-color,var(--primary))_10%,transparent)]",
  "disabled:bg-[var(--button-disabled-container-color,transparent)] disabled:border-[color-mix(in_srgb,var(--on-surface)_12%,transparent)] disabled:text-[var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface-variant)_38%,transparent))]",
].join(" ");

const text = [
  "border border-transparent bg-[var(--button-container-color,transparent)] text-[var(--button-content-color,var(--primary))]",
  "hover:bg-[color-mix(in_srgb,var(--button-content-color,var(--primary))_8%,transparent)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--button-content-color,var(--primary))_10%,transparent)]",
  "disabled:bg-[var(--button-disabled-container-color,transparent)] disabled:text-[var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface-variant)_38%,transparent))]",
].join(" ");

export const materialButtonVariantStyles: Record<MaterialButtonVariant, string> = {
  filled,
  elevated,
  "filled-tonal": filledTonal,
  outlined,
  text,
};
