import { getIntlLocale, type Locale } from "./i18n/config.ts";

function getNumberSymbols(locale: Locale): { decimal: string; group: string } {
  const parts = new Intl.NumberFormat(getIntlLocale(locale)).formatToParts(12_345.6);
  return {
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
    group: parts.find((part) => part.type === "group")?.value ?? ",",
  };
}

function isValidGrouping(value: string, separators: RegExp): boolean {
  const groups = value.split(separators);
  if (groups.length < 2) return false;
  const first = groups[0].replace(/^[+-]/, "");
  return first.length >= 1 && first.length <= 3 && /^\d+$/.test(first) && groups.slice(1).every((group) => /^\d{3}$/.test(group));
}

export function parseLocalizedNumber(value: string, locale: Locale = "en"): number | null {
  const trimmed = value.trim().replace(/\u2212/g, "-");
  if (trimmed === "") return null;

  const { decimal, group } = getNumberSymbols(locale);
  const hasDot = trimmed.includes(".");
  const hasComma = trimmed.includes(",");
  let decimalSeparator: string | null = null;

  if (trimmed.includes(decimal)) {
    decimalSeparator = decimal;
  } else if (hasDot && hasComma) {
    decimalSeparator = trimmed.lastIndexOf(".") > trimmed.lastIndexOf(",") ? "." : ",";
  } else {
    const separator = hasDot ? "." : hasComma ? "," : null;
    if (separator) {
      if (!(separator === group && isValidGrouping(trimmed, /[.,]/g))) decimalSeparator = separator;
    }
  }

  if (decimalSeparator && trimmed.indexOf(decimalSeparator) !== trimmed.lastIndexOf(decimalSeparator)) return null;

  const parts = decimalSeparator ? trimmed.split(decimalSeparator) : [trimmed];
  if (parts.length > 2) return null;
  const integerPart = parts[0] ?? "";
  const fractionPart = parts.length === 2 ? parts[1] : undefined;
  if (fractionPart !== undefined && !/^\d*$/.test(fractionPart)) return null;

  const hasGrouping = /[.,\s\u00a0\u202f\u2009\u2007]/.test(integerPart.replace(/^[+-]/, ""));
  let normalizedInteger = integerPart;
  if (hasGrouping) {
    if (!isValidGrouping(integerPart, /[.,\s\u00a0\u202f\u2009\u2007]+/)) return null;
    normalizedInteger = integerPart.replace(/[.,\s\u00a0\u202f\u2007\u2009]/g, "");
  } else if (!/^[+-]?\d*$/.test(integerPart)) {
    return null;
  }

  if (normalizedInteger === "" || /^[+-]$/.test(normalizedInteger)) {
    if (fractionPart === undefined || fractionPart === "") return null;
    normalizedInteger += "0";
  }

  const normalized = fractionPart === undefined ? normalizedInteger : normalizedInteger + "." + fractionPart;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatToolNumber(value: number, locale: Locale, maximumFractionDigits: number): string {
  return new Intl.NumberFormat(getIntlLocale(locale), { maximumFractionDigits }).format(value);
}
