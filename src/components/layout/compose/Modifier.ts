import type { CSSProperties } from "react";

/**
 * Limited Web adaptation of androidx.compose.ui.Modifier.
 * AndroidX reference: https://developer.android.com/develop/ui/compose/modifiers
 *
 * Values are CSS pixels in this adapter, not Android Dp. Modifier order is kept in
 * the operation list, but browser layout is not identical to Compose measurement.
 * Only add operations after checking the corresponding AndroidX contract.
 */
type ModifierOperation = (style: CSSProperties) => CSSProperties;

export class Modifier {
  private constructor(private readonly operations: readonly ModifierOperation[]) {}

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

    if (values.length === 1) {
      return this.append((style) => ({ ...style, padding: `${first}px` }));
    }

    if (values.length === 2) {
      return this.append((style) => ({ ...style, paddingInline: `${first}px`, paddingBlock: `${second!}px` }));
    }

    if (values.length === 4) {
      return this.append((style) => ({
        ...style,
        paddingInlineStart: `${first}px`,
        paddingBlockStart: `${second!}px`,
        paddingInlineEnd: `${third!}px`,
        paddingBlockEnd: `${fourth!}px`,
      }));
    }

    throw new TypeError("Modifier.padding expects 1, 2, or 4 dimension values.");
  }

  fillMaxWidth(): Modifier {
    return this.append((style) => ({ ...style, width: "100%" }));
  }

  widthIn(constraints: { min?: number; max?: number }): Modifier {
    if (constraints.min !== undefined) assertNonNegative(constraints.min, "widthIn.min");
    if (constraints.max !== undefined) assertNonNegative(constraints.max, "widthIn.max");
    if (constraints.min !== undefined && constraints.max !== undefined && constraints.min > constraints.max) {
      throw new RangeError("Modifier.widthIn min cannot exceed max.");
    }

    return this.append((style) => ({
      ...style,
      ...(constraints.min === undefined ? {} : { minWidth: `${constraints.min}px` }),
      ...(constraints.max === undefined ? {} : { maxWidth: `${constraints.max}px` }),
    }));
  }

  then(other: Modifier): Modifier {
    return new Modifier([...this.operations, ...other.operations]);
  }

  toStyle(): CSSProperties {
    return this.operations.reduce<CSSProperties>((style, operation) => operation(style), {});
  }
}

function assertNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`Modifier.${name} requires a finite, non-negative CSS pixel value.`);
  }
}
