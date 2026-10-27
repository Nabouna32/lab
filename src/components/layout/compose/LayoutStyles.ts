import type { CSSProperties } from "react";
import type { BoxAlignment, HorizontalAlignment, VerticalAlignment } from "./Alignment";
import { Arrangement, type HorizontalArrangement, type VerticalArrangement } from "./Arrangement";

export type LayoutPresentation = {
  className?: string;
  style: CSSProperties;
};

function joinClassNames(...names: Array<string | undefined>): string | undefined {
  const result = names.filter(Boolean).join(" ");
  return result || undefined;
}

function rowJustifyContent(arrangement: HorizontalArrangement): CSSProperties["justifyContent"] {
  if (arrangement.kind === "spacedBy" || arrangement.kind === "spacedByCss") {
    if (arrangement.kind === "spacedBy" && arrangement.alignment) {
      return ({
        start: "flex-start",
        centerHorizontally: "center",
        end: "flex-end",
        left: "left",
        right: "right",
      } as const)[arrangement.alignment];
    }
    return "flex-start";
  }

  if (arrangement.kind === "aligned") {
    return ({
      start: "flex-start",
      centerHorizontally: "center",
      end: "flex-end",
      left: "left",
      right: "right",
    } as const)[arrangement.alignment];
  }

  return ({
    start: "flex-start",
    end: "flex-end",
    center: "center",
    spaceBetween: "space-between",
    spaceAround: "space-around",
    spaceEvenly: "space-evenly",
  } as const)[arrangement.kind];
}

function columnJustifyContent(arrangement: VerticalArrangement): CSSProperties["justifyContent"] {
  if (arrangement.kind === "spacedBy" || arrangement.kind === "spacedByCss") {
    if (arrangement.kind === "spacedBy" && arrangement.alignment) {
      return ({
        top: "flex-start",
        centerVertically: "center",
        bottom: "flex-end",
      } as const)[arrangement.alignment];
    }
    return "flex-start";
  }

  if (arrangement.kind === "aligned") {
    return ({
      top: "flex-start",
      centerVertically: "center",
      bottom: "flex-end",
    } as const)[arrangement.alignment];
  }

  return ({
    top: "flex-start",
    bottom: "flex-end",
    center: "center",
    spaceBetween: "space-between",
    spaceAround: "space-around",
    spaceEvenly: "space-evenly",
  } as const)[arrangement.kind];
}

function rowSpacingStyle(arrangement: HorizontalArrangement): CSSProperties {
  if (arrangement.kind === "spacedBy") {
    return arrangement.space < 0
      ? ({ gap: 0, "--compose-layout-negative-gap": `${arrangement.space}px` } as CSSProperties)
      : { gap: `${arrangement.space}px` };
  }
  return arrangement.kind === "spacedByCss" ? { gap: arrangement.space } : {};
}

function columnSpacingStyle(arrangement: VerticalArrangement): CSSProperties {
  if (arrangement.kind === "spacedBy") {
    return arrangement.space < 0
      ? ({ gap: 0, "--compose-layout-negative-gap": `${arrangement.space}px` } as CSSProperties)
      : { gap: `${arrangement.space}px` };
  }
  return arrangement.kind === "spacedByCss" ? { gap: arrangement.space } : {};
}

export function getRowLayoutPresentation(
  horizontalArrangement: HorizontalArrangement = Arrangement.Start,
  verticalAlignment: VerticalAlignment = "centerVertically",
  className?: string,
  style?: CSSProperties,
): LayoutPresentation {
  const hasNegativeGap = horizontalArrangement.kind === "spacedBy" && horizontalArrangement.space < 0;
  return {
    className: joinClassNames(className, hasNegativeGap ? "compose-layout-negative-gap-row" : undefined),
    style: {
      display: "flex",
      flexDirection: "row",
      justifyContent: rowJustifyContent(horizontalArrangement),
      alignItems: ({
        top: "flex-start",
        centerVertically: "center",
        bottom: "flex-end",
      } as const)[verticalAlignment],
      ...rowSpacingStyle(horizontalArrangement),
      ...style,
    },
  };
}

export function getColumnLayoutPresentation(
  verticalArrangement: VerticalArrangement = Arrangement.Top,
  horizontalAlignment: HorizontalAlignment = "start",
  className?: string,
  style?: CSSProperties,
): LayoutPresentation {
  const hasNegativeGap = verticalArrangement.kind === "spacedBy" && verticalArrangement.space < 0;
  const absoluteAlignmentClass = horizontalAlignment === "left"
    ? "compose-column-align-absolute-left"
    : horizontalAlignment === "right"
      ? "compose-column-align-absolute-right"
      : undefined;
  const alignItems = horizontalAlignment === "left" || horizontalAlignment === "right"
    ? undefined
    : ({
      start: "flex-start",
      centerHorizontally: "center",
      end: "flex-end",
    } as const)[horizontalAlignment];

  return {
    className: joinClassNames(
      className,
      hasNegativeGap ? "compose-layout-negative-gap-column" : undefined,
      absoluteAlignmentClass,
    ),
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: columnJustifyContent(verticalArrangement),
      alignItems,
      ...columnSpacingStyle(verticalArrangement),
      ...style,
    },
  };
}


export function getBoxChildStyle(alignment: BoxAlignment, matchParentSize = false): CSSProperties {
  if (matchParentSize) {
    return { gridArea: "1 / 1", position: "absolute", inset: 0, display: "grid" };
  }

  const alignmentStyles: Record<BoxAlignment, Pick<CSSProperties, "justifySelf" | "alignSelf">> = {
    topStart: { justifySelf: "start", alignSelf: "start" },
    topCenter: { justifySelf: "center", alignSelf: "start" },
    topEnd: { justifySelf: "end", alignSelf: "start" },
    centerStart: { justifySelf: "start", alignSelf: "center" },
    center: { justifySelf: "center", alignSelf: "center" },
    centerEnd: { justifySelf: "end", alignSelf: "center" },
    bottomStart: { justifySelf: "start", alignSelf: "end" },
    bottomCenter: { justifySelf: "center", alignSelf: "end" },
    bottomEnd: { justifySelf: "end", alignSelf: "end" },
    topLeft: { justifySelf: "left", alignSelf: "start" },
    topRight: { justifySelf: "right", alignSelf: "start" },
    centerLeft: { justifySelf: "left", alignSelf: "center" },
    centerRight: { justifySelf: "right", alignSelf: "center" },
    bottomLeft: { justifySelf: "left", alignSelf: "end" },
    bottomRight: { justifySelf: "right", alignSelf: "end" },
  };

  return { gridArea: "1 / 1", ...alignmentStyles[alignment] };
}
