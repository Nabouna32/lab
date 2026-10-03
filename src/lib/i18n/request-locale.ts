import { defaultLocale, type Locale } from "./config";

export function getPreferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const preferences = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [rawTag, ...parameters] = part.trim().split(";");
      const tag = rawTag?.toLowerCase();
      if (!tag) return null;

      const qualityParameter = parameters.find((parameter) => parameter.trim().toLowerCase().startsWith("q="));
      const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
      if (!Number.isFinite(quality) || quality <= 0) return null;

      return { tag, quality, index };
    })
    .filter((preference): preference is { tag: string; quality: number; index: number } => preference !== null)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const preference of preferences) {
    if (preference.tag === "fr" || preference.tag.startsWith("fr-")) return "fr";
    if (preference.tag === "en" || preference.tag.startsWith("en-")) return "en";
  }

  return defaultLocale;
}
