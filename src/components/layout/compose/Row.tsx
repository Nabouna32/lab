import type { HTMLAttributes, ReactNode } from "react";
import { Alignment, type VerticalAlignment } from "./Alignment";
import { Arrangement, type HorizontalArrangement } from "./Arrangement";
import { getRowLayoutPresentation } from "./LayoutStyles";
import type { Modifier } from "./Modifier";

export type RowProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children?: ReactNode;
  modifier?: Modifier;
  horizontalArrangement?: HorizontalArrangement;
  verticalAlignment?: VerticalAlignment;
};

/** Partial Web adaptation of androidx.compose.foundation.layout.Row. */
export function Row({
  children,
  modifier,
  horizontalArrangement = Arrangement.Start,
  verticalAlignment = Alignment.CenterVertically,
  className,
  style,
  ...domProps
}: RowProps) {
  const presentation = getRowLayoutPresentation(horizontalArrangement, verticalAlignment, className, style);
  const layout = (
    <div {...domProps} className={presentation.className} style={presentation.style}>
      {children}
    </div>
  );

  return modifier ? modifier.wrap(layout) : layout;
}
