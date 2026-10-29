/**
 * Shared Web layout contract for AndroidX Material 3 Button variants.
 *
 * Button and button-styled anchors share geometry and content insets.
 * Native element semantics and variant colors remain owned by each caller.
 */
import type { MaterialButtonVariant } from "@/components/ui/material-button-variant-styles";

export type MaterialButtonLayoutOptions = {
  leadingIcon?: boolean;
  multiline?: boolean;
};

export function getMaterialButtonLayoutClasses(
  variant: MaterialButtonVariant,
  { leadingIcon = false, multiline = false }: MaterialButtonLayoutOptions = {},
): string {
  const isTextVariant = variant === "text";
  const layout = multiline
    ? "min-w-0 shrink whitespace-pre-line text-center"
    : "min-w-[58px] shrink-0 whitespace-nowrap";
  const horizontalPadding = isTextVariant
    ? leadingIcon ? "pl-3 pr-4" : "px-3"
    : leadingIcon ? "pl-4 pr-6" : "px-6";

  return [
    "m3-type-label-large relative isolate inline-flex min-h-10 items-center justify-center gap-2 rounded-full py-2",
    layout,
    horizontalPadding,
    "transition-[background-color,border-color,color,box-shadow] duration-[var(--motion-standard)] motion-reduce:transition-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
  ].join(" ");
}
