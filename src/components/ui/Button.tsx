import type { ButtonHTMLAttributes, CSSProperties, Ref } from "react";
import { ButtonRipple } from "@/components/ui/ButtonRipple";
import { getMaterialButtonLayoutClasses } from "@/components/ui/material-button-layout";
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
  /** AndroidX `enabled` parameter; native `disabled` remains a Web compatibility alias. */
  enabled?: boolean;
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
  enabled = true,
  disabled,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps & { variant: ButtonStyle }) {
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
      disabled={disabled ?? !enabled}
      style={mergedStyle}
      className={[
        getMaterialButtonLayoutClasses(variant, { leadingIcon, multiline }),
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

