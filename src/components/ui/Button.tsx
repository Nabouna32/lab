import type { ButtonHTMLAttributes } from "react";
import { ButtonRipple } from "@/components/ui/ButtonRipple";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Apply the AndroidX leading-icon content inset; the caller renders the icon. */
  leadingIcon?: boolean;
  /** Opt into wrapping a long label or honoring explicit line breaks. Constrain the width when wrapping is desired. */
  multiline?: boolean;
};

type ButtonStyle = "filled" | "elevated" | "filled-tonal" | "outlined" | "text" | "danger";

const filled = [
  "border border-transparent bg-[var(--primary)] text-[var(--on-primary)]",
  "hover:bg-[color-mix(in_srgb,var(--primary)_92%,var(--on-primary))] hover:shadow-[var(--button-elevation-1)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--primary)_90%,var(--on-primary))] focus-visible:shadow-none",
  "active:shadow-none",
  "disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] disabled:shadow-none",
].join(" ");

const elevated = [
  "border border-transparent bg-[var(--surface-container-low)] text-[var(--primary)] shadow-[var(--button-elevation-1)]",
  "hover:shadow-[var(--button-elevation-2)] hover:bg-[color-mix(in_srgb,var(--surface-container-low)_92%,var(--primary))]",
  "focus-visible:bg-[color-mix(in_srgb,var(--surface-container-low)_90%,var(--primary))] focus-visible:shadow-[var(--button-elevation-1)]",
  "active:shadow-[var(--button-elevation-1)]",
  "disabled:bg-[var(--surface-container-low)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] disabled:shadow-none",
].join(" ");

const filledTonal = [
  "border border-transparent bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
  "hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))] hover:shadow-[var(--button-elevation-1)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--secondary-container)_90%,var(--on-secondary-container))] focus-visible:shadow-none",
  "active:shadow-none",
  "disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] disabled:shadow-none",
].join(" ");

const outlined = [
  "border border-[var(--outline)] bg-transparent text-[var(--primary)]",
  "hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]",
  "disabled:border-[color-mix(in_srgb,var(--on-surface)_12%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
].join(" ");

const text = [
  "border border-transparent bg-transparent text-[var(--primary)]",
  "hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]",
  "focus-visible:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]",
  "disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
].join(" ");

/** Loculary-only semantic extension; AndroidX Material 3 has no destructive Button variant. */
const destructive = [
  "border border-transparent bg-[var(--error)] text-[var(--on-error)]",
  "hover:bg-[color-mix(in_srgb,var(--error)_92%,var(--on-error))]",
  "focus-visible:bg-[color-mix(in_srgb,var(--error)_90%,var(--on-error))]",
  "disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
].join(" ");

const styles: Record<ButtonStyle, string> = {
  filled,
  elevated,
  "filled-tonal": filledTonal,
  outlined,
  text,
  danger: destructive,
};

function MaterialButton({
  variant,
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

  return (
    <button
      type={type}
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

/** Loculary extension for destructive actions; not an AndroidX Material 3 component. */
export function DestructiveButton(props: ButtonProps) {
  return <MaterialButton variant="danger" {...props} />;
}
