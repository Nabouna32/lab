import type { Locale } from "@/lib/i18n/config";

export const toolsPathSegments: Record<Locale, string> = {
  en: "tools",
  fr: "outils",
};

const categorySlugs: Record<string, Record<Locale, string>> = {
  calculations: { en: "calculations", fr: "calculs" },
  dates: { en: "dates", fr: "dates" },
  computing: { en: "computing", fr: "informatique" },
  images: { en: "images", fr: "images" },
  files: { en: "files", fr: "fichiers" },
  video: { en: "video", fr: "video" },
  development: { en: "development", fr: "developpement" },
};

const toolSlugs: Record<string, Record<Locale, string>> = {
  percentage: { en: "percentage-calculator", fr: "calculateur-de-pourcentage" },
  discount: { en: "discount-calculator", fr: "calculateur-de-reduction" },
  vat: { en: "vat-calculator", fr: "calculateur-de-tva" },
  "rule-of-three": { en: "rule-of-three", fr: "regle-de-trois" },
  age: { en: "age-calculator", fr: "calculateur-d-age" },
  duration: { en: "duration-calculator", fr: "calculateur-de-duree" },
  "download-speed": { en: "download-speed-converter", fr: "convertisseur-de-debit-internet" },
  "download-time": { en: "download-time-calculator", fr: "calculateur-de-temps-de-telechargement" },
  "file-size": { en: "file-size-calculator", fr: "calculateur-de-taille-de-fichier" },
  "file-size-converter": { en: "file-size-converter", fr: "convertisseur-de-taille-de-fichier" },
  "word-character-counter": { en: "word-character-counter", fr: "compteur-de-mots-et-caracteres" },
  "video-bitrate": { en: "video-bitrate-calculator", fr: "calculateur-de-bitrate-video" },
  "json-formatter": { en: "json-formatter", fr: "formateur-json" },
};

export function getToolsPath(locale: Locale): string {
  return `/${locale}/${toolsPathSegments[locale]}`;
}

export function getCategorySlug(locale: Locale, categoryId: string): string {
  return categorySlugs[categoryId]?.[locale] ?? categoryId;
}

export function getToolSlug(locale: Locale, toolId: string): string {
  return toolSlugs[toolId]?.[locale] ?? toolId;
}

export function getCategoryPath(locale: Locale, categoryId: string): string {
  return `${getToolsPath(locale)}/${getCategorySlug(locale, categoryId)}`;
}

export function getToolPath(locale: Locale, categoryId: string, toolId: string): string {
  return `${getCategoryPath(locale, categoryId)}/${getToolSlug(locale, toolId)}`;
}

export function getCategoryIdBySlug(locale: Locale, slug: string): string | undefined {
  return Object.entries(categorySlugs).find(([, slugs]) => slugs[locale] === slug)?.[0];
}

export function getToolIdBySlug(locale: Locale, slug: string): string | undefined {
  return Object.entries(toolSlugs).find(([, slugs]) => slugs[locale] === slug)?.[0];
}

export function getLocalizedPath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${targetLocale}`;

  const currentLocale = segments[0] as Locale;
  const currentToolsSegment = toolsPathSegments[currentLocale];
  if (!currentToolsSegment || segments[1] !== currentToolsSegment) {
    return `/${targetLocale}/${segments.slice(1).join("/")}`;
  }

  if (segments.length === 2) return getToolsPath(targetLocale);

  const categoryId = getCategoryIdBySlug(currentLocale, segments[2]);
  if (!categoryId) return `/${targetLocale}`;

  if (segments.length === 3) return getCategoryPath(targetLocale, categoryId);

  const toolId = getToolIdBySlug(currentLocale, segments[3]);
  if (!toolId) return getCategoryPath(targetLocale, categoryId);

  return getToolPath(targetLocale, categoryId, toolId);
}
