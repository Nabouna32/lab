import { Children, cloneElement, isValidElement, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { Alignment, type BoxAlignment } from "./Alignment";
import { getBoxChildStyle } from "./LayoutStyles";
import { isModifier, type Modifier } from "./Modifier";

export type BoxProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children?: ReactNode;
  modifier?: Modifier;
  contentAlignment?: BoxAlignment;
};

/**
 * Web adaptation of androidx.compose.foundation.layout.Box.
 * Children share one CSS grid cell to approximate Compose's stacking behavior.
 * Compose's constraint and measurement rules are not fully reproduced.
 */
export function Box({
  children,
  modifier,
  contentAlignment = Alignment.TopStart,
  className,
  style,
  ...domProps
}: BoxProps) {
  const layout = (
    <div
      {...domProps}
      className={className}
      style={{ display: "grid", position: "relative", ...style }}
    >
      {Children.map(children, (child) => {
        let content = child;
        let childAlignment = contentAlignment;
        let matchParentSize = false;

        if (isValidElement(child)) {
          const childProps = child.props as { modifier?: unknown };
          if (isModifier(childProps.modifier)) {
            const scope = childProps.modifier.boxScopeOptions();
            childAlignment = scope.alignment ?? contentAlignment;
            matchParentSize = scope.matchParentSize;
            content = cloneElement(child as ReactElement<{ modifier?: Modifier }>, {
              modifier: childProps.modifier.withoutBoxScopeOperations(),
            });
          }
        }

        return <div style={getBoxChildStyle(childAlignment, matchParentSize)}>{content}</div>;
      })}
    </div>
  );

  return modifier ? modifier.wrap(layout) : layout;
}
