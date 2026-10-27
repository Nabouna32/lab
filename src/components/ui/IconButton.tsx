import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

type IconButtonStyle = "standard" | "filled" | "filled-tonal" | "outlined";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children" | "aria-pressed"> & {
  label: string;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};

type IconToggleButtonProps = Omit<IconButtonProps, "onClick"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

type IconButtonBaseProps = IconButtonProps & {
  variant: IconButtonStyle;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const standard = "border border-transparent bg-transparent text-[var(--on-surface-variant)] group-hover:bg-[color-mix(in_srgb,var(--on-surface-variant)_8%,transparent)] group-active:bg-[color-mix(in_srgb,var(--on-surface-variant)_12%,transparent)] group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const filled = "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] group-hover:bg-[color-mix(in_srgb,var(--primary)_92%,var(--on-primary))] group-active:bg-[color-mix(in_srgb,var(--primary)_88%,var(--on-primary))] group-disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const filledTonal = "border border-transparent bg-[var(--secondary-container)] text-[var(--on-secondary-container)] group-hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))] group-active:bg-[color-mix(in_srgb,var(--secondary-container)_88%,var(--on-secondary-container))] group-disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const outlined = "border border-[var(--outline-variant)] bg-transparent text-[var(--on-surface-variant)] group-hover:bg-[color-mix(in_srgb,var(--on-surface-variant)_8%,transparent)] group-active:bg-[color-mix(in_srgb,var(--on-surface-variant)_12%,transparent)] group-disabled:border-[color-mix(in_srgb,var(--outline-variant)_38%,transparent)] group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";

const variants: Record<IconButtonStyle, string> = {
  standard,
  filled,
  "filled-tonal": filledTonal,
  outlined,
};

const selectedStyles: Record<IconButtonStyle, string> = {
  standard: "text-[var(--primary)] group-hover:text-[var(--primary)] group-active:text-[var(--primary)] group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] group-active:bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]",
  filled: "",
  "filled-tonal": "bg-[var(--secondary-container)] text-[var(--on-secondary-container)] group-hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))] group-active:bg-[color-mix(in_srgb,var(--secondary-container)_88%,var(--on-secondary-container))] group-disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]",
  outlined: "border-transparent bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] group-hover:bg-[color-mix(in_srgb,var(--inverse-surface)_92%,var(--inverse-on-surface))] group-active:bg-[color-mix(in_srgb,var(--inverse-surface)_88%,var(--inverse-on-surface))] group-disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]",
};

const targetDimensions = "h-12 min-h-12 w-12 min-w-12";
const surfaceDimensions = "h-10 min-h-10 w-10 min-w-10";

function IconButtonBase({
  label,
  children,
  className = "",
  type = "button",
  variant,
  checked,
  onCheckedChange,
  ref,
  onClick,
  ...props
}: IconButtonBaseProps) {
  const isToggle = checked !== undefined && onCheckedChange !== undefined;
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={isToggle ? checked : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (isToggle && !event.defaultPrevented) onCheckedChange(!checked);
      }}
      className={[
        "group inline-flex shrink-0 items-center justify-center rounded-full bg-transparent p-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        targetDimensions,
        className,
      ].join(" ")}
      {...props}
    >
      <span
        aria-hidden="true"
        className={[
          "inline-flex shrink-0 items-center justify-center rounded-full",
          "transition-[background-color,border-color,color] duration-[var(--motion-standard)] motion-reduce:transition-none",
          surfaceDimensions,
          variants[variant],
          selectedStyles[variant] && isToggle && checked ? selectedStyles[variant] : "",
        ].join(" ")}
      >
        {children}
      </span>
    </button>
  );
}

/** AndroidX Compose Material 3 IconButton (standard, non-toggle action). */
export function IconButton(props: IconButtonProps) {
  return <IconButtonBase variant="standard" {...props} />;
}

/** AndroidX Compose Material 3 FilledIconButton (non-toggle action). */
export function FilledIconButton(props: IconButtonProps) {
  return <IconButtonBase variant="filled" {...props} />;
}

/** AndroidX Compose Material 3 FilledTonalIconButton (non-toggle action). */
export function FilledTonalIconButton(props: IconButtonProps) {
  return <IconButtonBase variant="filled-tonal" {...props} />;
}

/** AndroidX Compose Material 3 OutlinedIconButton (non-toggle action). */
export function OutlinedIconButton(props: IconButtonProps) {
  return <IconButtonBase variant="outlined" {...props} />;
}

/** AndroidX Compose Material 3 IconToggleButton (standard toggle). */
export function IconToggleButton(props: IconToggleButtonProps) {
  return <IconButtonBase variant="standard" {...props} />;
}

/** AndroidX Compose Material 3 FilledIconToggleButton. */
export function FilledIconToggleButton(props: IconToggleButtonProps) {
  return <IconButtonBase variant="filled" {...props} />;
}

/** AndroidX Compose Material 3 FilledTonalIconToggleButton. */
export function FilledTonalIconToggleButton(props: IconToggleButtonProps) {
  return <IconButtonBase variant="filled-tonal" {...props} />;
}

/** AndroidX Compose Material 3 OutlinedIconToggleButton. */
export function OutlinedIconToggleButton(props: IconToggleButtonProps) {
  return <IconButtonBase variant="outlined" {...props} />;
}
