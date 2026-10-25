import type { ButtonHTMLAttributes, CSSProperties, Ref } from "react";
import { ButtonRipple } from "@/components/ui/ButtonRipple";
import { materialButtonVariantStyles, type MaterialButtonVariant } from "@/components/ui/material-button-variant-styles";

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
}: ButtonProps & { variant: MaterialButtonVariant }) {
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
        materialButtonVariantStyles[variant],
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

