import type { Locale } from "@/lib/i18n/config";
import type { ToolId } from "./types";

export const toolsPathSegments: Record<Locale, string> = {
  en: "tools",
  fr: "outils",
};

export const categoriesPathSegments: Record<Locale, string> = {
  en: "categories",
  fr: "categories",
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

const toolSlugs: Record<ToolId, Record<Locale, string>> = {
  "compound-interest": { en: "compound-interest-calculator", fr: "calculateur-d-interets-composes" },
  percentage: { en: "percentage-calculator", fr: "calculateur-de-pourcentage" },
  discount: { en: "discount-calculator", fr: "calculateur-de-reduction" },
  vat: { en: "vat-calculator", fr: "calculateur-de-tva" },
  "rule-of-three": { en: "rule-of-three", fr: "regle-de-trois" },
  age: { en: "age-calculator", fr: "calculateur-d-age" },
  duration: { en: "duration-calculator", fr: "calculateur-de-duree" },
  "date-calculator": { en: "date-calculator", fr: "calculateur-de-date" },
  "download-speed": { en: "download-speed-converter", fr: "convertisseur-de-debit-internet" },
  "download-time": { en: "download-time-calculator", fr: "calculateur-de-temps-de-telechargement" },
  "file-size": { en: "file-size-calculator", fr: "calculateur-de-taille-de-fichier" },
  "file-size-converter": { en: "file-size-converter", fr: "convertisseur-de-taille-de-fichier" },
  "word-character-counter": { en: "word-character-counter", fr: "compteur-de-mots-et-caracteres" },
  "text-case-converter": { en: "text-case-converter", fr: "convertisseur-de-casse" },
  "unit-converter": { en: "unit-converter", fr: "convertisseur-d-unites" },
  "video-bitrate": { en: "video-bitrate-calculator", fr: "calculateur-de-bitrate-video" },
  "json-formatter": { en: "json-formatter", fr: "formateur-json" },
  "yaml-formatter-validator": { en: "yaml-formatter-validator", fr: "formateur-validateur-yaml" },
  "url-encoder-decoder": { en: "url-encoder-decoder", fr: "encodeur-decodeur-url" },
  "url-parser": { en: "url-parser", fr: "analyseur-url" },
  "base64-encoder-decoder": { en: "base64-encoder-decoder", fr: "encodeur-base64" },
  "html-entity-encoder-decoder": { en: "html-entity-encoder-decoder", fr: "encodeur-decodeur-entites-html" },
  "json-to-typescript": { en: "json-to-typescript", fr: "json-vers-typescript" },
  "csv-json-converter": { en: "csv-json-converter", fr: "convertisseur-csv-json" },
  "uuid-generator": { en: "uuid-generator", fr: "generateur-uuid" },
  "unix-timestamp": { en: "unix-timestamp-converter", fr: "convertisseur-timestamp-unix" },
  "hash-generator": { en: "hash-generator", fr: "generateur-hash" },
  "jwt-decoder": { en: "jwt-decoder", fr: "decodeur-jwt" },
  "regex-tester": { en: "regex-tester", fr: "testeur-regex" },
  "password-generator": { en: "password-generator", fr: "generateur-de-mot-de-passe" },
  "contrast-checker": { en: "color-contrast-checker", fr: "verificateur-de-contraste-des-couleurs" },
  "ip-subnet-calculator": { en: "ipv4-subnet-calculator", fr: "calculateur-de-sous-reseau-ipv4" },
  "color-converter": { en: "color-converter", fr: "convertisseur-de-couleur" },
  "number-base-converter": { en: "number-base-converter", fr: "convertisseur-de-bases" },
  "color-palette-generator": { en: "color-palette-generator", fr: "generateur-de-palette-de-couleurs" },
  "text-diff-checker": { en: "text-diff-checker", fr: "comparateur-de-texte" },
  "cron-expression": { en: "cron-expression", fr: "expression-cron" },
  "qr-code-generator": { en: "qr-code-generator", fr: "generateur-de-qr-code" },
  "markdown-table-generator": { en: "markdown-table-generator", fr: "generateur-de-tableau-markdown" },
  "image-compressor": { en: "image-compressor", fr: "compresseur-d-image" },
  "image-metadata": { en: "image-metadata-viewer", fr: "analyseur-de-metadonnees-image" },
  "html-previewer": { en: "html-preview", fr: "apercu-html" },
  "timezone-converter": { en: "time-zone-converter", fr: "convertisseur-de-fuseaux-horaires" },
  "xml-formatter-validator": { en: "xml-formatter-validator", fr: "formateur-validateur-xml" },
};

export function getToolsPath(locale: Locale): string {
  return `/${locale}/${toolsPathSegments[locale]}`;
}

export function getCategoriesPath(locale: Locale): string {
  return `/${locale}/${categoriesPathSegments[locale]}`;
}

export function getCategorySlug(locale: Locale, categoryId: string): string {
  return categorySlugs[categoryId]?.[locale] ?? categoryId;
}

export function getToolSlug(locale: Locale, toolId: ToolId): string {
  return toolSlugs[toolId][locale];
}

export function getCategoryPath(locale: Locale, categoryId: string): string {
  return `${getCategoriesPath(locale)}/${getCategorySlug(locale, categoryId)}`;
}

export function getToolPath(locale: Locale, toolId: ToolId): string {
  return `${getToolsPath(locale)}/${getToolSlug(locale, toolId)}`;
}

export function getCategoryIdBySlug(locale: Locale, slug: string): string | undefined {
  return Object.entries(categorySlugs).find(([, slugs]) => slugs[locale] === slug)?.[0];
}

export function getToolIdBySlug(locale: Locale, slug: string): ToolId | undefined {
  return Object.entries(toolSlugs).find(([, slugs]) => slugs[locale] === slug)?.[0] as ToolId | undefined;
}

export function getLocalizedPath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${targetLocale}`;

  const currentLocale = segments[0] as Locale;
  if (segments.length === 1) return `/${targetLocale}`;

  const currentToolsSegment = toolsPathSegments[currentLocale];
  const currentCategoriesSegment = categoriesPathSegments[currentLocale];

  if (segments.length === 2 && segments[1] === currentToolsSegment) {
    return getToolsPath(targetLocale);
  }

  if (segments.length === 3 && segments[1] === currentToolsSegment) {
    const toolId = getToolIdBySlug(currentLocale, segments[2]);
    return toolId ? getToolPath(targetLocale, toolId) : `/${targetLocale}`;
  }

  if (segments.length === 3 && segments[1] === currentCategoriesSegment) {
    const categoryId = getCategoryIdBySlug(currentLocale, segments[2]);
    return categoryId ? getCategoryPath(targetLocale, categoryId) : `/${targetLocale}`;
  }

  if (segments[1] === currentToolsSegment || segments[1] === currentCategoriesSegment) {
    return `/${targetLocale}`;
  }

  return `/${targetLocale}/${segments.slice(1).join("/")}`;
}
