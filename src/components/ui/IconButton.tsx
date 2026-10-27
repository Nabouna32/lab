import type { ButtonHTMLAttributes, CSSProperties, ReactNode, Ref } from "react";
import { ButtonRipple } from "@/components/ui/ButtonRipple";

type IconButtonStyle = "standard" | "filled" | "filled-tonal" | "outlined";

export type IconButtonColors = {
  containerColor?: string;
  contentColor?: string;
  disabledContainerColor?: string;
  disabledContentColor?: string;
};

export type IconToggleButtonColors = IconButtonColors & {
  checkedContainerColor?: string;
  checkedContentColor?: string;
};

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children" | "aria-pressed"> & {
  label: string;
  children: ReactNode;
  colors?: Partial<IconButtonColors>;
  shape?: CSSProperties["borderRadius"];
  ref?: Ref<HTMLButtonElement>;
};

type IconToggleButtonProps = Omit<IconButtonProps, "onClick" | "colors"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  colors?: Partial<IconToggleButtonColors>;
};

type IconButtonBaseProps = Omit<IconButtonProps, "colors"> & {
  variant: IconButtonStyle;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  colors?: Partial<IconToggleButtonColors>;
};

/*
 * State layers use the icon/content role as the overlay, matching the AndroidX
 * state-token model (hover 8%, focus 12%, pressed 12%). CSS color mixing is a
 * documented Web rendering adaptation, not pixel-identical Compose rendering.
 */
const standard = "border border-transparent bg-[var(--icon-button-container-color,transparent)] text-[var(--icon-button-content-color,var(--on-surface-variant))] group-hover:bg-[color-mix(in_srgb,var(--icon-button-container-color,transparent)_92%,var(--icon-button-content-color,var(--on-surface-variant)))] group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-container-color,transparent)_88%,var(--icon-button-content-color,var(--on-surface-variant)))] group-active:bg-[color-mix(in_srgb,var(--icon-button-container-color,transparent)_88%,var(--icon-button-content-color,var(--on-surface-variant)))] group-disabled:bg-[var(--icon-button-disabled-container-color,transparent)] group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]";
const filled = "border border-transparent bg-[var(--icon-button-container-color,var(--primary))] text-[var(--icon-button-content-color,var(--on-primary))] group-hover:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--primary))_92%,var(--icon-button-content-color,var(--on-primary)))] group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--primary))_88%,var(--icon-button-content-color,var(--on-primary)))] group-active:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--primary))_88%,var(--icon-button-content-color,var(--on-primary)))] group-disabled:bg-[var(--icon-button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_12%,transparent))] group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]";
const filledTonal = "border border-transparent bg-[var(--icon-button-container-color,var(--secondary-container))] text-[var(--icon-button-content-color,var(--on-secondary-container))] group-hover:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--secondary-container))_92%,var(--icon-button-content-color,var(--on-secondary-container)))] group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--secondary-container))_88%,var(--icon-button-content-color,var(--on-secondary-container)))] group-active:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--secondary-container))_88%,var(--icon-button-content-color,var(--on-secondary-container)))] group-disabled:bg-[var(--icon-button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_12%,transparent))] group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]";
const outlined = "border border-[var(--outline-variant)] bg-[var(--icon-button-container-color,transparent)] text-[var(--icon-button-content-color,var(--on-surface-variant))] group-hover:bg-[color-mix(in_srgb,var(--icon-button-container-color,transparent)_92%,var(--icon-button-content-color,var(--on-surface-variant)))] group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-container-color,transparent)_88%,var(--icon-button-content-color,var(--on-surface-variant)))] group-active:bg-[color-mix(in_srgb,var(--icon-button-container-color,transparent)_88%,var(--icon-button-content-color,var(--on-surface-variant)))] group-disabled:border-[color-mix(in_srgb,var(--outline-variant)_12%,transparent)] group-disabled:bg-[var(--icon-button-disabled-container-color,transparent)] group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]";

const variants: Record<IconButtonStyle, string> = {
  standard,
  filled,
  "filled-tonal": filledTonal,
  outlined,
};

/* Toggle defaults use their own AndroidX checked and unchecked color roles. */
const toggleUncheckedStyles: Record<IconButtonStyle, string> = {
  standard,
  filled: "border border-transparent bg-[var(--icon-button-container-color,var(--surface-variant))] text-[var(--icon-button-content-color,var(--on-surface-variant))] group-hover:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--surface-variant))_92%,var(--icon-button-content-color,var(--on-surface-variant)))] group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--surface-variant))_88%,var(--icon-button-content-color,var(--on-surface-variant)))] group-active:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--surface-variant))_88%,var(--icon-button-content-color,var(--on-surface-variant)))] group-disabled:bg-[var(--icon-button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_12%,transparent))] group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]",
  "filled-tonal": "border border-transparent bg-[var(--icon-button-container-color,var(--surface-variant))] text-[var(--icon-button-content-color,var(--on-surface-variant))] group-hover:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--surface-variant))_92%,var(--icon-button-content-color,var(--on-surface-variant)))] group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--surface-variant))_88%,var(--icon-button-content-color,var(--on-surface-variant)))] group-active:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--surface-variant))_88%,var(--icon-button-content-color,var(--on-surface-variant)))] group-disabled:bg-[var(--icon-button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_12%,transparent))] group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]",
  outlined,
};

const toggleCheckedStyles: Record<IconButtonStyle, string> = {
  standard: "border border-transparent bg-[var(--icon-button-checked-container-color,transparent)] text-[var(--icon-button-checked-content-color,var(--primary))] group-hover:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,transparent)_92%,var(--icon-button-checked-content-color,var(--primary)))] group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,transparent)_88%,var(--icon-button-checked-content-color,var(--primary)))] group-active:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,transparent)_88%,var(--icon-button-checked-content-color,var(--primary)))] group-disabled:bg-[var(--icon-button-disabled-container-color,transparent)] group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]",
  filled: "border border-transparent bg-[var(--icon-button-checked-container-color,var(--primary))] text-[var(--icon-button-checked-content-color,var(--on-primary))] group-hover:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,var(--primary))_92%,var(--icon-button-checked-content-color,var(--on-primary)))] group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,var(--primary))_88%,var(--icon-button-checked-content-color,var(--on-primary)))] group-active:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,var(--primary))_88%,var(--icon-button-checked-content-color,var(--on-primary)))] group-disabled:bg-[var(--icon-button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_12%,transparent))] group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]",
  "filled-tonal": "border border-transparent bg-[var(--icon-button-checked-container-color,var(--secondary-container))] text-[var(--icon-button-checked-content-color,var(--on-secondary-container))] group-hover:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,var(--secondary-container))_92%,var(--icon-button-checked-content-color,var(--on-secondary-container)))] group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,var(--secondary-container))_88%,var(--icon-button-checked-content-color,var(--on-secondary-container)))] group-active:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,var(--secondary-container))_88%,var(--icon-button-checked-content-color,var(--on-secondary-container)))] group-disabled:bg-[var(--icon-button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_12%,transparent))] group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]",
  outlined: "border border-transparent bg-[var(--icon-button-checked-container-color,var(--inverse-surface))] text-[var(--icon-button-checked-content-color,var(--inverse-on-surface))] group-hover:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,var(--inverse-surface))_92%,var(--icon-button-checked-content-color,var(--inverse-on-surface)))] group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,var(--inverse-surface))_88%,var(--icon-button-checked-content-color,var(--inverse-on-surface)))] group-active:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,var(--inverse-surface))_88%,var(--icon-button-checked-content-color,var(--inverse-on-surface)))] group-disabled:bg-[var(--icon-button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_12%,transparent))] group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]",
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
  colors,
  shape,
  style,
  ref,
  onClick,
  ...props
}: IconButtonBaseProps) {
  const isToggle = checked !== undefined && onCheckedChange !== undefined;
  const colorStyle = {
    "--icon-button-container-color": colors?.containerColor,
    "--icon-button-content-color": colors?.contentColor,
    "--icon-button-disabled-container-color": colors?.disabledContainerColor,
    "--icon-button-disabled-content-color": colors?.disabledContentColor,
    "--icon-button-checked-container-color": colors?.checkedContainerColor,
    "--icon-button-checked-content-color": colors?.checkedContentColor,
  } as CSSProperties;
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={isToggle ? checked : undefined}
      style={shape === undefined ? style : { ...style, borderRadius: shape }}
      onClick={(event) => {
        onClick?.(event);
        if (isToggle && !event.defaultPrevented) onCheckedChange(!checked);
      }}
      className={[
        "group relative isolate inline-flex shrink-0 items-center justify-center rounded-full bg-transparent p-0",
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
          isToggle ? (checked ? toggleCheckedStyles[variant] : toggleUncheckedStyles[variant]) : variants[variant],
        ].join(" ")}
        style={{ ...colorStyle, ...(shape === undefined ? {} : { borderRadius: shape }) }}
      >
        {children}
      </span>
      <ButtonRipple />
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
