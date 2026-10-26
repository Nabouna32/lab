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

export class ModifierElement {
  private constructor(private readonly operations: readonly ModifierOperation[]) {}

  static empty(): ModifierElement {
    return new ModifierElement([]);
  }

  private append(operation: ModifierOperation): ModifierElement {
    return new ModifierElement([...this.operations, operation]);
  }

  padding(all: number): ModifierElement {
    assertNonNegative(all, "padding");
    return this.append((style) => ({ ...style, padding: `${all}px` }));
  }

  paddingHorizontal(horizontal: number): ModifierElement {
    assertNonNegative(horizontal, "paddingHorizontal");
    return this.append((style) => ({ ...style, paddingInline: `${horizontal}px` }));
  }

  paddingVertical(vertical: number): ModifierElement {
    assertNonNegative(vertical, "paddingVertical");
    return this.append((style) => ({ ...style, paddingBlock: `${vertical}px` }));
  }

  fillMaxWidth(): ModifierElement {
    return this.append((style) => ({ ...style, width: "100%" }));
  }

  widthIn(constraints: { min?: number; max?: number }): ModifierElement {
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

  then(other: ModifierElement): ModifierElement {
    return new ModifierElement([...this.operations, ...other.operations]);
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

export const Modifier = {
  padding: (all: number) => ModifierElement.empty().padding(all),
  paddingHorizontal: (horizontal: number) => ModifierElement.empty().paddingHorizontal(horizontal),
  paddingVertical: (vertical: number) => ModifierElement.empty().paddingVertical(vertical),
  fillMaxWidth: () => ModifierElement.empty().fillMaxWidth(),
  widthIn: (constraints: { min?: number; max?: number }) => ModifierElement.empty().widthIn(constraints),
} as const;
