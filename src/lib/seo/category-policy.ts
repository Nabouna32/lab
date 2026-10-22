export type CategorySeoPolicy = {
  description: Readonly<Record<"fr" | "en", string>>;
};

/**
 * Editorial content required to generate useful, localized category metadata.
 *
 * A category with published tools and complete localized descriptions is
 * indexable by default. Keep exclusions exceptional and document why each
 * category should not be a search landing page.
 */
export const categorySeoPolicy: Readonly<Record<string, CategorySeoPolicy>> = {
  calculations: { description: {
    fr: "Calculez des pourcentages, des remises, de la TVA, des intérêts composés ou la répartition de dépenses.",
    en: "Calculate percentages, discounts, VAT, compound interest, or how to split shared expenses.",
  } },
  dates: { description: {
    fr: "Calculez un âge, une durée ou une date, et convertissez des horaires entre fuseaux horaires.",
    en: "Calculate ages, durations, and dates, or convert times between time zones.",
  } },
  computing: { description: {
    fr: "Convertissez des unités et des tailles de fichiers, estimez des transferts et calculez des sous-réseaux IP.",
    en: "Convert units and file sizes, estimate downloads, and calculate IP subnets.",
  } },
  images: { description: {
    fr: "Inspectez les métadonnées, compressez et organisez des images ou assemblez-les en documents PDF.",
    en: "Inspect metadata, compress and organize images, or combine them into PDF documents.",
  } },
  files: { description: {
    fr: "Préparez et convertissez des fichiers dans votre navigateur, notamment pour créer des documents à partir d’images.",
    en: "Prepare and convert files in your browser, including creating documents from images.",
  } },
  video: { description: {
    fr: "Estimez le débit vidéo à partir de la taille, de la durée et des paramètres d’encodage.",
    en: "Estimate video bitrate from file size, duration, and encoding settings.",
  } },
  development: { description: {
    fr: "Formatez, validez, convertissez et comparez du JSON, du CSV, du YAML, du texte et d’autres données techniques.",
    en: "Format, validate, convert, and compare JSON, CSV, YAML, text, and other technical data.",
  } },
};

/**
 * Explicit exclusions are exceptional editorial decisions, not a category
 * allowlist. Each entry must include a reason so it can be reviewed over time.
 */
export const excludedCategorySeoReasons: Readonly<Record<string, string>> = {};

export function isCategorySeoIndexable(categoryId: string): boolean {
  return Boolean(categorySeoPolicy[categoryId]) && !excludedCategorySeoReasons[categoryId];
}

export function getCategorySeoDescription(locale: "fr" | "en", categoryId: string): string {
  const policy = categorySeoPolicy[categoryId];
  if (!policy) throw new Error(`Missing SEO policy for category "${categoryId}".`);
  return policy.description[locale];
}