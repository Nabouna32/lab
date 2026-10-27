import { createElement, type CSSProperties, type ReactNode } from "react";
import type { BoxAlignment } from "./Alignment";

/**
 * Ordered Web adapter for androidx.compose.ui.Modifier and the layout modifiers
 * used by this port. Numeric dimensions are CSS pixels, not Android Dp.
 *
 * Each operation is represented by a wrapper so the chain order is retained.
 * Browser layout still differs from Compose measurement and constraint propagation.
 */
type PaddingValues = {
  inlineStart: number;
  blockStart: number;
  inlineEnd: number;
  blockEnd: number;
};

type SizeConstraints = {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
};

type ModifierOperation =
  | { readonly kind: "padding"; readonly values: PaddingValues }
  | { readonly kind: "fillMaxWidth"; readonly fraction: number }
  | { readonly kind: "fillMaxHeight"; readonly fraction: number }
  | { readonly kind: "fillMaxSize"; readonly fraction: number }
  | { readonly kind: "width"; readonly value: number }
  | { readonly kind: "height"; readonly value: number }
  | { readonly kind: "size"; readonly width: number; readonly height: number }
  | { readonly kind: "widthIn"; readonly constraints: Pick<SizeConstraints, "minWidth" | "maxWidth"> }
  | { readonly kind: "heightIn"; readonly constraints: Pick<SizeConstraints, "minHeight" | "maxHeight"> }
  | { readonly kind: "sizeIn"; readonly constraints: SizeConstraints }
  | { readonly kind: "weight"; readonly weight: number; readonly fill: boolean }
  | { readonly kind: "boxAlign"; readonly alignment: BoxAlignment }
  | { readonly kind: "matchParentSize" };

function assertNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`Modifier.${name} requires a finite, non-negative CSS pixel value.`);
  }
}

function assertFraction(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`Modifier.${name} requires a finite fraction between 0 and 1.`);
  }
}

function assertConstraints(constraints: SizeConstraints, name: string): void {
  for (const [key, value] of Object.entries(constraints)) {
    if (value !== undefined) assertNonNegative(value, `${name}.${key}`);
  }
  if (constraints.minWidth !== undefined && constraints.maxWidth !== undefined && constraints.minWidth > constraints.maxWidth) {
    throw new RangeError(`Modifier.${name} minWidth cannot exceed maxWidth.`);
  }
  if (constraints.minHeight !== undefined && constraints.maxHeight !== undefined && constraints.minHeight > constraints.maxHeight) {
    throw new RangeError(`Modifier.${name} minHeight cannot exceed maxHeight.`);
  }
}

function operationStyle(operation: ModifierOperation): CSSProperties {
  switch (operation.kind) {
    case "padding":
      return {
        paddingInlineStart: `${operation.values.inlineStart}px`,
        paddingBlockStart: `${operation.values.blockStart}px`,
        paddingInlineEnd: `${operation.values.inlineEnd}px`,
        paddingBlockEnd: `${operation.values.blockEnd}px`,
      };
    case "fillMaxWidth":
      return { width: `${operation.fraction * 100}%` };
    case "fillMaxHeight":
      return { height: `${operation.fraction * 100}%` };
    case "fillMaxSize":
      return { width: `${operation.fraction * 100}%`, height: `${operation.fraction * 100}%` };
    case "width":
      return { width: `${operation.value}px` };
    case "height":
      return { height: `${operation.value}px` };
    case "size":
      return { width: `${operation.width}px`, height: `${operation.height}px` };
    case "widthIn":
      return {
        ...(operation.constraints.minWidth === undefined ? {} : { minWidth: `${operation.constraints.minWidth}px` }),
        ...(operation.constraints.maxWidth === undefined ? {} : { maxWidth: `${operation.constraints.maxWidth}px` }),
      };
    case "heightIn":
      return {
        ...(operation.constraints.minHeight === undefined ? {} : { minHeight: `${operation.constraints.minHeight}px` }),
        ...(operation.constraints.maxHeight === undefined ? {} : { maxHeight: `${operation.constraints.maxHeight}px` }),
      };
    case "sizeIn":
      return {
        ...(operation.constraints.minWidth === undefined ? {} : { minWidth: `${operation.constraints.minWidth}px` }),
        ...(operation.constraints.maxWidth === undefined ? {} : { maxWidth: `${operation.constraints.maxWidth}px` }),
        ...(operation.constraints.minHeight === undefined ? {} : { minHeight: `${operation.constraints.minHeight}px` }),
        ...(operation.constraints.maxHeight === undefined ? {} : { maxHeight: `${operation.constraints.maxHeight}px` }),
      };
    case "weight":
      return {
        flexGrow: operation.fill ? operation.weight : 0,
        flexShrink: 1,
        flexBasis: operation.fill ? "0%" : "auto",
      };
    case "boxAlign":
    case "matchParentSize":
      return {};
  }
}

class ModifierChain {
  private readonly operations: readonly ModifierOperation[];

  private constructor(operations: readonly ModifierOperation[]) {
    this.operations = operations;
  }

  static empty(): ModifierChain {
    return new ModifierChain([]);
  }

  private append(operation: ModifierOperation): ModifierChain {
    return new ModifierChain([...this.operations, operation]);
  }

  padding(all: number): ModifierChain;
  padding(horizontal: number, vertical: number): ModifierChain;
  padding(start: number, top: number, end: number, bottom: number): ModifierChain;
  padding(first: number, second?: number, third?: number, fourth?: number): ModifierChain {
    const values = [first, second, third, fourth].filter((value): value is number => value !== undefined);
    values.forEach((value) => assertNonNegative(value, "padding"));

    let padding: PaddingValues;
    if (values.length === 1) {
      padding = { inlineStart: first, blockStart: first, inlineEnd: first, blockEnd: first };
    } else if (values.length === 2) {
      padding = {
        inlineStart: first,
        blockStart: second!,
        inlineEnd: first,
        blockEnd: second!,
      };
    } else if (values.length === 4) {
      padding = {
        inlineStart: first,
        blockStart: second!,
        inlineEnd: third!,
        blockEnd: fourth!,
      };
    } else {
      throw new TypeError("Modifier.padding expects 1, 2, or 4 dimension values.");
    }

    return this.append({ kind: "padding", values: padding });
  }

  fillMaxWidth(fraction = 1): ModifierChain {
    assertFraction(fraction, "fillMaxWidth");
    return this.append({ kind: "fillMaxWidth", fraction });
  }

  fillMaxHeight(fraction = 1): ModifierChain {
    assertFraction(fraction, "fillMaxHeight");
    return this.append({ kind: "fillMaxHeight", fraction });
  }

  fillMaxSize(fraction = 1): ModifierChain {
    assertFraction(fraction, "fillMaxSize");
    return this.append({ kind: "fillMaxSize", fraction });
  }

  width(width: number): ModifierChain {
    assertNonNegative(width, "width");
    return this.append({ kind: "width", value: width });
  }

  height(height: number): ModifierChain {
    assertNonNegative(height, "height");
    return this.append({ kind: "height", value: height });
  }

  size(size: number): ModifierChain;
  size(width: number, height: number): ModifierChain;
  size(width: number, height = width): ModifierChain {
    assertNonNegative(width, "size.width");
    assertNonNegative(height, "size.height");
    return this.append({ kind: "size", width, height });
  }

  widthIn(minWidth = 0, maxWidth?: number): ModifierChain {
    const constraints = { minWidth, ...(maxWidth === undefined ? {} : { maxWidth }) };
    assertConstraints(constraints, "widthIn");
    return this.append({ kind: "widthIn", constraints });
  }

  heightIn(minHeight = 0, maxHeight?: number): ModifierChain {
    const constraints = { minHeight, ...(maxHeight === undefined ? {} : { maxHeight }) };
    assertConstraints(constraints, "heightIn");
    return this.append({ kind: "heightIn", constraints });
  }

  sizeIn(minWidth = 0, minHeight = 0, maxWidth?: number, maxHeight?: number): ModifierChain {
    const constraints = {
      minWidth,
      minHeight,
      ...(maxWidth === undefined ? {} : { maxWidth }),
      ...(maxHeight === undefined ? {} : { maxHeight }),
    };
    assertConstraints(constraints, "sizeIn");
    return this.append({ kind: "sizeIn", constraints });
  }

  weight(weight: number, fill = true): ModifierChain {
    if (!Number.isFinite(weight) || weight <= 0) {
      throw new RangeError("Modifier.weight requires a finite, positive weight.");
    }
    return this.append({ kind: "weight", weight, fill });
  }

  align(alignment: BoxAlignment): ModifierChain {
    return this.append({ kind: "boxAlign", alignment });
  }

  matchParentSize(): ModifierChain {
    return this.append({ kind: "matchParentSize" });
  }

  boxScopeOptions(): { alignment?: BoxAlignment; matchParentSize: boolean } {
    let alignment: BoxAlignment | undefined;
    let matchParentSize = false;
    for (const operation of this.operations) {
      if (operation.kind === "boxAlign") alignment = operation.alignment;
      if (operation.kind === "matchParentSize") matchParentSize = true;
    }
    return { alignment, matchParentSize };
  }

  withoutBoxScopeOperations(): ModifierChain {
    return new ModifierChain(this.operations.filter((operation) => operation.kind !== "boxAlign" && operation.kind !== "matchParentSize"));
  }

  then(other: ModifierChain): ModifierChain {
    return new ModifierChain([...this.operations, ...other.operations]);
  }

  wrap(content: ReactNode): ReactNode {
    return this.operations
      .filter((operation) => operation.kind !== "boxAlign" && operation.kind !== "matchParentSize")
      .reduceRight<ReactNode>(
        (child, operation, index) => createElement("div", {
          key: `modifier-${index}`,
          style: operationStyle(operation),
        }, child),
        content,
      );
  }
}

export type Modifier = ModifierChain;

/** Compose-shaped empty modifier chain; each call returns a new ordered chain. */
export const Modifier = ModifierChain.empty();


export function isModifier(value: unknown): value is Modifier {
  return value instanceof ModifierChain;
}
