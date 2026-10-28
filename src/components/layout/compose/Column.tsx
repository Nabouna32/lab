import type { CSSProperties, ReactNode } from "react";
import { Alignment, type HorizontalAlignment } from "./Alignment";
import { Arrangement, type VerticalArrangement } from "./Arrangement";
import { getColumnLayoutPresentation } from "./LayoutStyles";
import type { Modifier } from "./Modifier";

export type ColumnProps = {
  children?: ReactNode;
  modifier?: Modifier;
  verticalArrangement?: VerticalArrangement;
  horizontalAlignment?: HorizontalAlignment;
  className?: string;
  style?: CSSProperties;
};

/** Partial Web adaptation of androidx.compose.foundation.layout.Column. */
export function Column({
  children,
  modifier,
  verticalArrangement = Arrangement.Top,
  horizontalAlignment,
  className,
  style,
}: ColumnProps) {
  const presentation = getColumnLayoutPresentation(verticalArrangement, horizontalAlignment, className, style);
  const layout = (
    <div className={presentation.className} style={presentation.style}>
      {children}
    </div>
  );

  return modifier ? modifier.wrap(layout) : layout;
}
