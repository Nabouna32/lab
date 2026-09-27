import { getIntlLocale, type Locale } from "./config.ts";

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string;
};

export function getPluralForm(locale: Locale, value: number, forms: PluralForms): string {
  const category = new Intl.PluralRules(getIntlLocale(locale)).select(value);
  return forms[category] ?? forms.other;
}

export function formatPlural(locale: Locale, value: number, forms: PluralForms): string {
  return `${value} ${getPluralForm(locale, value, forms)}`;
}
