export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type LanguageDefinition = {
  code: Locale;
  label: string;
  nativeLabel: string;
  direction: "ltr" | "rtl";
  intlLocale: string;
  enabled: boolean;
  // Product readiness signal; it is intentionally not inferred from structural i18n checks.
  translationStatus: "complete" | "partial";
  flagCode: string;
};

export const languages: Record<Locale, LanguageDefinition> = {
  fr: { code: "fr", label: "French", nativeLabel: "Français", direction: "ltr", intlLocale: "fr-FR", enabled: true, translationStatus: "complete", flagCode: "fr" },
  en: { code: "en", label: "English", nativeLabel: "English", direction: "ltr", intlLocale: "en-US", enabled: true, translationStatus: "complete", flagCode: "world" },
};

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && locales.includes(value as Locale);
}

export function getLanguage(locale: Locale): LanguageDefinition {
  return languages[locale];
}

export function getIntlLocale(locale: Locale): string {
  return languages[locale].intlLocale;
}
