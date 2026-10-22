export type CategorySeoPolicy = {
  indexable: boolean;
  description: Readonly<Record<"fr" | "en", string>>;
};

/**
 * Editorial decisions for category landing pages.
 *
 * Indexability is intentionally explicit: having tools in a category is not
 * enough to justify a search landing page. Keep both locales aligned and write
 * descriptions that explain the category's actual jobs rather than its name.
 */
export const categorySeoPolicy: Readonly<Record<string, CategorySeoPolicy>> = {
  calculations: {
    indexable: true,
    description: {
      fr: "Calculez des pourcentages, des remises, de la TVA, des intérêts composés ou la répartition de dépenses.",
      en: "Calculate percentages, discounts, VAT, compound interest, or how to split shared expenses.",
    },
  },
  dates: {
    indexable: true,
    description: {
      fr: "Calculez un âge, une durée ou une date, et convertissez des horaires entre fuseaux horaires.",
      en: "Calculate ages, durations, and dates, or convert times between time zones.",
    },
  },
  computing: {
    indexable: true,
    description: {
      fr: "Convertissez des unités et des tailles de fichiers, estimez des transferts et calculez des sous-réseaux IP.",
      en: "Convert units and file sizes, estimate downloads, and calculate IP subnets.",
    },
  },
  images: {
    indexable: true,
    description: {
      fr: "Inspectez les métadonnées, compressez et organisez des images ou assemblez-les en documents PDF.",
      en: "Inspect metadata, compress and organize images, or combine them into PDF documents.",
    },
  },
  files: {
    indexable: true,
    description: {
      fr: "Préparez et convertissez des fichiers dans votre navigateur, notamment pour créer des documents à partir d’images.",
      en: "Prepare and convert files in your browser, including creating documents from images.",
    },
  },
  video: {
    indexable: false,
    description: {
      fr: "Estimez le débit vidéo à partir de la taille, de la durée et des paramètres d’encodage.",
      en: "Estimate video bitrate from file size, duration, and encoding settings.",
    },
  },
  development: {
    indexable: true,
    description: {
      fr: "Formatez, validez, convertissez et comparez du JSON, du CSV, du YAML, du texte et d’autres données techniques.",
      en: "Format, validate, convert, and compare JSON, CSV, YAML, text, and other technical data.",
    },
  },
};

export function isCategorySeoIndexable(categoryId: string): boolean {
  return categorySeoPolicy[categoryId]?.indexable ?? false;
}

export function getCategorySeoDescription(locale: "fr" | "en", categoryId: string): string {
  const policy = categorySeoPolicy[categoryId];
  if (!policy) throw new Error(`Missing SEO policy for category "${categoryId}".`);
  return policy.description[locale];
}
