import type { ButtonHTMLAttributes, Ref } from "react";
import { ButtonRipple } from "@/components/ui/ButtonRipple";
import { getMaterialButtonInlineStyle, materialButtonVariantStyles, type MaterialButtonColors, type MaterialButtonVariant } from "@/components/ui/material-button-variant-styles";

export type ButtonColors = MaterialButtonColors;

export type ButtonContentPadding = {
  /** Logical start inset (AndroidX PaddingValues.start). */
  start?: CSSProperties["paddingInlineStart"];
  top?: CSSProperties["paddingBlockStart"];
  /** Logical end inset (AndroidX PaddingValues.end). */
  end?: CSSProperties["paddingInlineEnd"];
  bottom?: CSSProperties["paddingBlockEnd"];
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** AndroidX-inspired color customization. Values may be CSS colors or semantic theme tokens. */
  colors?: ButtonColors;
  /** Web mapping for AndroidX Shape; accepts CSS border-radius values. */
  shape?: CSSProperties["borderRadius"];
  /** Web mapping for AndroidX BorderStroke; null removes the border. */
  border?: CSSProperties["border"] | null;
  /** Logical padding values adapted from AndroidX PaddingValues. */
  contentPadding?: ButtonContentPadding;
  /** React ref to the native button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Apply the AndroidX leading-icon content inset; the caller renders the icon. */
  leadingIcon?: boolean;
  /** Opt into wrapping a long label or honoring explicit line breaks. Constrain the width when wrapping is desired. */
  multiline?: boolean;
};

type ButtonStyle = MaterialButtonVariant;

const styles = materialButtonVariantStyles;

function MaterialButton({
  variant,
  colors,
  shape,
  border,
  contentPadding,
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
    ...getMaterialButtonInlineStyle(variant, colors, style),
    ...(shape === undefined ? {} : { borderRadius: shape }),
    ...(border === undefined ? {} : { border: border ?? "none" }),
    ...(contentPadding === undefined ? {} : {
      paddingBlockStart: contentPadding.top,
      paddingInlineEnd: contentPadding.end,
      paddingBlockEnd: contentPadding.bottom,
      paddingInlineStart: contentPadding.start,
    }),
  };

  return (
    <button
      ref={ref}
      type={type}
      style={mergedStyle}
      className={[
        "m3-type-label-large relative isolate inline-flex min-h-10 items-center justify-center gap-2 rounded-full py-2",
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

