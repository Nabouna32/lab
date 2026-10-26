import type { CSSProperties } from "react";

/**
 * Limited Web adaptation of androidx.compose.ui.Modifier.
 * AndroidX reference: https://developer.android.com/develop/ui/compose/modifiers
 *
 * Values are CSS pixels in this adapter, not Android Dp. Modifier order is kept in
 * the operation list, but browser layout is not identical to Compose measurement.
 * Only add operations after checking the corresponding AndroidX contract.
 */
type PaddingValues = {
  inlineStart: number;
  blockStart: number;
  inlineEnd: number;
  blockEnd: number;
};

type ModifierOperation =
  | { readonly kind: "padding"; readonly values: PaddingValues }
  | { readonly kind: "fillMaxWidth" }
  | { readonly kind: "widthIn"; readonly min?: number; readonly max?: number };

export class Modifier {
  private readonly operations: readonly ModifierOperation[];

  private constructor(operations: readonly ModifierOperation[]) {
    this.operations = operations;
  }

  static empty(): Modifier {
    return new Modifier([]);
  }

  static padding(...values: [number] | [number, number] | [number, number, number, number]): Modifier {
    const [first, second, third, fourth] = values;
    if (second === undefined) return Modifier.empty().padding(first);
    if (third === undefined) return Modifier.empty().padding(first, second);
    return Modifier.empty().padding(first, second, third, fourth!);
  }

  static fillMaxWidth(): Modifier {
    return Modifier.empty().fillMaxWidth();
  }

  static widthIn(constraints: { min?: number; max?: number }): Modifier {
    return Modifier.empty().widthIn(constraints);
  }

  private append(operation: ModifierOperation): Modifier {
    return new Modifier([...this.operations, operation]);
  }

  padding(all: number): Modifier;
  padding(horizontal: number, vertical: number): Modifier;
  padding(start: number, top: number, end: number, bottom: number): Modifier;
  padding(first: number, second?: number, third?: number, fourth?: number): Modifier {
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

  fillMaxWidth(): Modifier {
    return this.append({ kind: "fillMaxWidth" });
  }

  widthIn(constraints: { min?: number; max?: number }): Modifier {
    if (constraints.min !== undefined) assertNonNegative(constraints.min, "widthIn.min");
    if (constraints.max !== undefined) assertNonNegative(constraints.max, "widthIn.max");
    if (constraints.min !== undefined && constraints.max !== undefined && constraints.min > constraints.max) {
      throw new RangeError("Modifier.widthIn min cannot exceed max.");
    }

    return this.append({ kind: "widthIn", ...constraints });
  }

  then(other: Modifier): Modifier {
    return new Modifier([...this.operations, ...other.operations]);
  }

  toStyle(): CSSProperties {
    const padding: PaddingValues = { inlineStart: 0, blockStart: 0, inlineEnd: 0, blockEnd: 0 };
    let hasPadding = false;
    let style: CSSProperties = {};

    for (const operation of this.operations) {
      if (operation.kind === "padding") {
        hasPadding = true;
        padding.inlineStart += operation.values.inlineStart;
        padding.blockStart += operation.values.blockStart;
        padding.inlineEnd += operation.values.inlineEnd;
        padding.blockEnd += operation.values.blockEnd;
      } else if (operation.kind === "fillMaxWidth") {
        style = { ...style, width: "100%" };
      } else {
        style = {
          ...style,
          ...(operation.min === undefined ? {} : { minWidth: `${operation.min}px` }),
          ...(operation.max === undefined ? {} : { maxWidth: `${operation.max}px` }),
        };
      }
    }

    return {
      ...style,
      ...(hasPadding ? {
        paddingInlineStart: `${padding.inlineStart}px`,
        paddingBlockStart: `${padding.blockStart}px`,
        paddingInlineEnd: `${padding.inlineEnd}px`,
        paddingBlockEnd: `${padding.blockEnd}px`,
      } : {}),
    };
  }
}

function assertNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`Modifier.${name} requires a finite, non-negative CSS pixel value.`);
  }
}
