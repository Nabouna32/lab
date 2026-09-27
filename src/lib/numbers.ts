import { getIntlLocale, type Locale } from "./i18n/config.ts";

export function parseLocalizedNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;

  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatToolNumber(
  value: number,
  locale: Locale,
  maximumFractionDigits: number,
): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    maximumFractionDigits,
  }).format(value);
}
