import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { AbsoluteAlignment, Alignment, type BoxAlignment } from "./Alignment";
import { isModifier, type Modifier } from "./Modifier";

export type BoxProps = {
  children?: ReactNode;
  modifier?: Modifier;
  contentAlignment?: BoxAlignment;
  className?: string;
  style?: CSSProperties;
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
}: BoxProps) {
  const alignment: Record<BoxAlignment, { justifySelf: CSSProperties["justifySelf"]; alignSelf: CSSProperties["alignSelf"] }> = {
    topStart: { justifySelf: "start", alignSelf: "start" },
    topCenter: { justifySelf: "center", alignSelf: "start" },
    topEnd: { justifySelf: "end", alignSelf: "start" },
    centerStart: { justifySelf: "start", alignSelf: "center" },
    center: { justifySelf: "center", alignSelf: "center" },
    centerEnd: { justifySelf: "end", alignSelf: "center" },
    bottomStart: { justifySelf: "start", alignSelf: "end" },
    bottomCenter: { justifySelf: "center", alignSelf: "end" },
    bottomEnd: { justifySelf: "end", alignSelf: "end" },
    [AbsoluteAlignment.TopLeft]: { justifySelf: "left", alignSelf: "start" },
    [AbsoluteAlignment.TopRight]: { justifySelf: "right", alignSelf: "start" },
    [AbsoluteAlignment.CenterLeft]: { justifySelf: "left", alignSelf: "center" },
    [AbsoluteAlignment.CenterRight]: { justifySelf: "right", alignSelf: "center" },
    [AbsoluteAlignment.BottomLeft]: { justifySelf: "left", alignSelf: "end" },
    [AbsoluteAlignment.BottomRight]: { justifySelf: "right", alignSelf: "end" },
  };

  const layout = (
    <div
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

        const childStyle: CSSProperties = matchParentSize
          ? { gridArea: "1 / 1", position: "absolute", inset: 0, display: "grid" }
          : { gridArea: "1 / 1", ...alignment[childAlignment] };

        return <div style={childStyle}>{content}</div>;
      })}
    </div>
  );

  return modifier ? modifier.wrap(layout) : layout;
}
