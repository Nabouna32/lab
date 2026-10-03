export const UNIT_CONVERTER_MAX_VALUE = 1e100;

export const UNIT_CONVERTER_CATEGORIES = [
  "length",
  "mass",
  "temperature",
  "volume",
  "area",
] as const;

export type UnitConverterCategory = (typeof UNIT_CONVERTER_CATEGORIES)[number];

type LinearUnit = {
  id: string;
  symbol: string;
  factor: number;
};

export const UNIT_CONVERTER_UNITS = {
  length: [
    { id: "mm", symbol: "mm", factor: 0.001 },
    { id: "cm", symbol: "cm", factor: 0.01 },
    { id: "m", symbol: "m", factor: 1 },
    { id: "km", symbol: "km", factor: 1000 },
    { id: "in", symbol: "in", factor: 0.0254 },
    { id: "ft", symbol: "ft", factor: 0.3048 },
    { id: "yd", symbol: "yd", factor: 0.9144 },
    { id: "mi", symbol: "mi", factor: 1609.344 },
  ],
  mass: [
    { id: "mg", symbol: "mg", factor: 0.000001 },
    { id: "g", symbol: "g", factor: 0.001 },
    { id: "kg", symbol: "kg", factor: 1 },
    { id: "oz", symbol: "oz", factor: 0.028349523125 },
    { id: "lb", symbol: "lb", factor: 0.45359237 },
  ],
  temperature: [
    { id: "c", symbol: "°C" },
    { id: "f", symbol: "°F" },
    { id: "k", symbol: "K" },
  ],
  volume: [
    { id: "ml", symbol: "mL", factor: 0.001 },
    { id: "l", symbol: "L", factor: 1 },
    { id: "tsp", symbol: "tsp (US)", factor: 0.00492892159375 },
    { id: "tbsp", symbol: "tbsp (US)", factor: 0.01478676478125 },
    { id: "cup", symbol: "cup (US)", factor: 0.2365882365 },
    { id: "fl-oz", symbol: "fl oz (US)", factor: 0.0295735295625 },
    { id: "gal", symbol: "gal (US)", factor: 3.785411784 },
  ],
  area: [
    { id: "mm2", symbol: "mm²", factor: 0.000001 },
    { id: "cm2", symbol: "cm²", factor: 0.0001 },
    { id: "m2", symbol: "m²", factor: 1 },
    { id: "km2", symbol: "km²", factor: 1000000 },
    { id: "in2", symbol: "in²", factor: 0.00064516 },
    { id: "ft2", symbol: "ft²", factor: 0.09290304 },
    { id: "yd2", symbol: "yd²", factor: 0.83612736 },
    { id: "mi2", symbol: "mi²", factor: 2589988.110336 },
  ],
} as const satisfies Record<UnitConverterCategory, readonly LinearUnit[] | readonly { id: string; symbol: string }[]>;

export type UnitConverterUnit = (typeof UNIT_CONVERTER_UNITS)[UnitConverterCategory][number]["id"];

function isFiniteWithinLimit(value: number): boolean {
  return Number.isFinite(value) && Math.abs(value) <= UNIT_CONVERTER_MAX_VALUE;
}

function getUnit(category: UnitConverterCategory, id: string) {
  return UNIT_CONVERTER_UNITS[category].find((unit) => unit.id === id);
}

function toBaseTemperature(value: number, unit: string): number | null {
  switch (unit) {
    case "c":
      return value + 273.15;
    case "f":
      return (value - 32) * (5 / 9) + 273.15;
    case "k":
      return value;
    default:
      return null;
  }
}

function fromBaseTemperature(value: number, unit: string): number | null {
  switch (unit) {
    case "c":
      return value - 273.15;
    case "f":
      return (value - 273.15) * (9 / 5) + 32;
    case "k":
      return value;
    default:
      return null;
  }
}

export function convertUnit(
  value: number,
  category: UnitConverterCategory,
  from: string,
  to: string,
): number | null {
  if (!isFiniteWithinLimit(value)) return null;

  const fromUnit = getUnit(category, from);
  const toUnit = getUnit(category, to);
  if (!fromUnit || !toUnit) return null;

  if (category === "temperature") {
    if (from === "k" && value < 0) return null;
    const base = toBaseTemperature(value, from);
    if (base === null || base < 0 || !isFiniteWithinLimit(base)) return null;
    const result = fromBaseTemperature(base, to);
    return result !== null && isFiniteWithinLimit(result) ? result : null;
  }

  if (value < 0) return null;

  const fromFactor = "factor" in fromUnit ? fromUnit.factor : null;
  const toFactor = "factor" in toUnit ? toUnit.factor : null;
  if (fromFactor === null || toFactor === null) return null;

  const result = (value * fromFactor) / toFactor;
  return isFiniteWithinLimit(result) ? result : null;
}
