import type { ButtonHTMLAttributes, CSSProperties, Ref } from "react";
import { ButtonRipple } from "@/components/ui/ButtonRipple";

export type ButtonColors = {
  /** Container color; maps to AndroidX ButtonColors.containerColor. */
  containerColor?: string;
  /** Content color; maps to AndroidX ButtonColors.contentColor. */
  contentColor?: string;
  /** Disabled container color; maps to AndroidX ButtonColors.disabledContainerColor. */
  disabledContainerColor?: string;
  /** Disabled content color; maps to AndroidX ButtonColors.disabledContentColor. */
  disabledContentColor?: string;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** AndroidX-inspired color customization. Values may be CSS colors or semantic theme tokens. */
  colors?: ButtonColors;
  /** React ref to the native button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Apply the AndroidX leading-icon content inset; the caller renders the icon. */
  leadingIcon?: boolean;
  /** Opt into wrapping a long label or honoring explicit line breaks. Constrain the width when wrapping is desired. */
  multiline?: boolean;
};

type ButtonStyle = "filled" | "elevated" | "filled-tonal" | "outlined" | "text";

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

const styles: Record<ButtonStyle, string> = {
  filled,
  elevated,
  "filled-tonal": filledTonal,
  outlined,
  text,
};

function MaterialButton({
  variant,
  colors,
  ref,
  style,
  leadingIcon = false,
  multiline = false,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps & { variant: ButtonStyle }) {
  const layout = multiline ? "min-w-0 shrink whitespace-pre-line text-center" : "min-w-[58px] shrink-0 whitespace-nowrap";
  const isTextVariant = variant === "text";
  const horizontalPadding = isTextVariant
    ? leadingIcon ? "pl-3 pr-4" : "px-3"
    : leadingIcon ? "pl-4 pr-6" : "px-6";
  const mergedStyle = {
    ...style,
    ...(colors?.containerColor !== undefined ? { "--button-container-color": colors.containerColor } : {}),
    ...(colors?.contentColor !== undefined ? { "--button-content-color": colors.contentColor } : {}),
    ...(colors?.disabledContainerColor !== undefined ? { "--button-disabled-container-color": colors.disabledContainerColor } : {}),
    ...(colors?.disabledContentColor !== undefined ? { "--button-disabled-content-color": colors.disabledContentColor } : {}),
  } as CSSProperties;

  return (
    <button
      ref={ref}
      type={type}
      style={mergedStyle}
      className={[
        "relative isolate inline-flex min-h-10 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium leading-5 tracking-[.006em]",
        layout,
        horizontalPadding,
        "transition-[background-color,border-color,color,box-shadow] duration-[var(--motion-standard)] motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        styles[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
      <ButtonRipple />
    </button>
  );
}

/** AndroidX Compose Material 3 Button (filled). */
export function Button(props: ButtonProps) {
  return <MaterialButton variant="filled" {...props} />;
}

/** AndroidX Compose Material 3 ElevatedButton. */
export function ElevatedButton(props: ButtonProps) {
  return <MaterialButton variant="elevated" {...props} />;
}

/** AndroidX Compose Material 3 FilledTonalButton. */
export function FilledTonalButton(props: ButtonProps) {
  return <MaterialButton variant="filled-tonal" {...props} />;
}

/** AndroidX Compose Material 3 OutlinedButton. */
export function OutlinedButton(props: ButtonProps) {
  return <MaterialButton variant="outlined" {...props} />;
}

/** AndroidX Compose Material 3 TextButton. */
export function TextButton(props: ButtonProps) {
  return <MaterialButton variant="text" {...props} />;
}

