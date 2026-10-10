import {
  Contrast,
  Hct,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeRainbow,
  SchemeTonalSpot,
  SchemeVibrant,
  argbFromHex,
  hexFromArgb,
} from "@material/material-color-utilities";
import type { DynamicScheme } from "@material/material-color-utilities";

export type SchemeSpecVersion = "2021" | "2025";
export type SchemePlatform = "phone" | "watch";

export type SchemeVariant =
  | "content"
  | "expressive"
  | "fidelity"
  | "fruit-salad"
  | "monochrome"
  | "neutral"
  | "rainbow"
  | "tonal-spot"
  | "vibrant";

export const schemeVariants: Array<{
  key: SchemeVariant;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
}> = [
  { key: "content", name: "Content", nameFr: "Content", description: "Preserves the source color's character.", descriptionFr: "Préserve le caractère de la couleur source." },
  { key: "expressive", name: "Expressive", nameFr: "Expressive", description: "A deliberately colorful, hue-shifting scheme.", descriptionFr: "Une palette expressive qui varie volontairement les teintes." },
  { key: "fidelity", name: "Fidelity", nameFr: "Fidelity", description: "Keeps the source color's appearance as faithfully as possible.", descriptionFr: "Conserve au mieux l'apparence de la couleur source." },
  { key: "fruit-salad", name: "Fruit Salad", nameFr: "Fruit Salad", description: "A playful scheme with more independent secondary hues.", descriptionFr: "Une palette vive avec des teintes secondaires plus indépendantes." },
  { key: "monochrome", name: "Monochrome", nameFr: "Monochrome", description: "A low-chroma, nearly colorless direction.", descriptionFr: "Une direction très peu chromatique, presque sans couleur." },
  { key: "neutral", name: "Neutral", nameFr: "Neutral", description: "Restrained color with understated surfaces.", descriptionFr: "Des couleurs discrètes et des surfaces sobres." },
  { key: "rainbow", name: "Rainbow", nameFr: "Rainbow", description: "A colorful spectrum with restrained neutral surfaces.", descriptionFr: "Un spectre coloré avec des surfaces neutres." },
  { key: "tonal-spot", name: "Tonal Spot", nameFr: "Tonal Spot", description: "The familiar balanced Material baseline.", descriptionFr: "La base Material équilibrée et familière." },
  { key: "vibrant", name: "Vibrant", nameFr: "Vibrant", description: "Maximizes colorfulness across the scheme.", descriptionFr: "Maximise l'intensité des couleurs de la palette." },
];

export const seedPresets = [
  { name: "Material Purple", nameFr: "Violet Material", seed: "#6750A4" },
  { name: "Loculary Indigo", nameFr: "Indigo Loculary", seed: "#3F51B5" },
  { name: "Google Blue", nameFr: "Bleu Google", seed: "#4285F4" },
  { name: "Deep Blue", nameFr: "Bleu franc", seed: "#0B57D0" },
  { name: "Teal", nameFr: "Turquoise", seed: "#00897B" },
  { name: "Green", nameFr: "Vert", seed: "#2E7D32" },
  { name: "Yellow", nameFr: "Jaune", seed: "#F9A825" },
  { name: "Orange", nameFr: "Orange", seed: "#EF6C00" },
  { name: "Red", nameFr: "Rouge", seed: "#D32F2F" },
  { name: "Coral", nameFr: "Corail", seed: "#E64A19" },
  { name: "Pink", nameFr: "Rose", seed: "#C2185B" },
  { name: "Neutral Gray", nameFr: "Gris neutre", seed: "#777777" },
] as const;

export function normalizeHexSeed(value: string): string | null {
  const trimmed = value.trim();
  const withoutHash = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  if (/^[\da-f]{3}$/i.test(withoutHash)) {
    return `#${withoutHash.split("").map((digit) => digit + digit).join("").toUpperCase()}`;
  }
  if (/^[\da-f]{6}$/i.test(withoutHash)) {
    return `#${withoutHash.toUpperCase()}`;
  }
  return null;
}

export function createM3Scheme(
  seed: string,
  variant: SchemeVariant,
  isDark: boolean,
  contrastLevel: number,
  specVersion: SchemeSpecVersion = "2021",
  platform: SchemePlatform = "phone",
): DynamicScheme {
  const source = Hct.fromInt(argbFromHex(seed));
  switch (variant) {
    case "content": return new SchemeContent(source, isDark, contrastLevel, specVersion, platform);
    case "expressive": return new SchemeExpressive(source, isDark, contrastLevel, specVersion, platform);
    case "fidelity": return new SchemeFidelity(source, isDark, contrastLevel, specVersion, platform);
    case "fruit-salad": return new SchemeFruitSalad(source, isDark, contrastLevel, specVersion, platform);
    case "monochrome": return new SchemeMonochrome(source, isDark, contrastLevel, specVersion, platform);
    case "neutral": return new SchemeNeutral(source, isDark, contrastLevel, specVersion, platform);
    case "rainbow": return new SchemeRainbow(source, isDark, contrastLevel, specVersion, platform);
    case "tonal-spot": return new SchemeTonalSpot(source, isDark, contrastLevel, specVersion, platform);
    case "vibrant": return new SchemeVibrant(source, isDark, contrastLevel, specVersion, platform);
  }
}

export function colorHex(argb: number): string {
  return hexFromArgb(argb).toUpperCase();
}

export const semanticRoleNames = [
  "primary", "onPrimary", "primaryContainer", "onPrimaryContainer",
  "secondary", "onSecondary", "secondaryContainer", "onSecondaryContainer",
  "tertiary", "onTertiary", "tertiaryContainer", "onTertiaryContainer",
  "error", "onError", "errorContainer", "onErrorContainer",
  "background", "onBackground", "surface", "onSurface",
  "surfaceVariant", "onSurfaceVariant", "outline", "outlineVariant",
  "shadow", "scrim", "inverseSurface", "inverseOnSurface", "inversePrimary",
] as const;

export type SemanticRoleName = (typeof semanticRoleNames)[number];

export function getSemanticRoles(scheme: DynamicScheme): Array<{
  name: SemanticRoleName;
  color: string;
}> {
  const colors: Record<SemanticRoleName, number> = {
    primary: scheme.primary,
    onPrimary: scheme.onPrimary,
    primaryContainer: scheme.primaryContainer,
    onPrimaryContainer: scheme.onPrimaryContainer,
    secondary: scheme.secondary,
    onSecondary: scheme.onSecondary,
    secondaryContainer: scheme.secondaryContainer,
    onSecondaryContainer: scheme.onSecondaryContainer,
    tertiary: scheme.tertiary,
    onTertiary: scheme.onTertiary,
    tertiaryContainer: scheme.tertiaryContainer,
    onTertiaryContainer: scheme.onTertiaryContainer,
    error: scheme.error,
    onError: scheme.onError,
    errorContainer: scheme.errorContainer,
    onErrorContainer: scheme.onErrorContainer,
    background: scheme.background,
    onBackground: scheme.onBackground,
    surface: scheme.surface,
    onSurface: scheme.onSurface,
    surfaceVariant: scheme.surfaceVariant,
    onSurfaceVariant: scheme.onSurfaceVariant,
    outline: scheme.outline,
    outlineVariant: scheme.outlineVariant,
    shadow: scheme.shadow,
    scrim: scheme.scrim,
    inverseSurface: scheme.inverseSurface,
    inverseOnSurface: scheme.inverseOnSurface,
    inversePrimary: scheme.inversePrimary,
  };
  return semanticRoleNames.map((name) => ({ name, color: colorHex(colors[name]) }));
}

export function getRolePairs(scheme: DynamicScheme): Array<{
  name: string;
  background: string;
  foreground: string;
  ratio: number;
}> {
  const pairs = [
    { name: "Primary / on-primary", background: scheme.primary, foreground: scheme.onPrimary },
    { name: "Primary container", background: scheme.primaryContainer, foreground: scheme.onPrimaryContainer },
    { name: "Secondary / on-secondary", background: scheme.secondary, foreground: scheme.onSecondary },
    { name: "Secondary container", background: scheme.secondaryContainer, foreground: scheme.onSecondaryContainer },
    { name: "Tertiary / on-tertiary", background: scheme.tertiary, foreground: scheme.onTertiary },
    { name: "Tertiary container", background: scheme.tertiaryContainer, foreground: scheme.onTertiaryContainer },
    { name: "Error / on-error", background: scheme.error, foreground: scheme.onError },
    { name: "Error container", background: scheme.errorContainer, foreground: scheme.onErrorContainer },
    { name: "Surface / on-surface", background: scheme.surface, foreground: scheme.onSurface },
    { name: "Surface variant", background: scheme.surfaceVariant, foreground: scheme.onSurfaceVariant },
    { name: "Background / on-background", background: scheme.background, foreground: scheme.onBackground },
    { name: "Inverse surface", background: scheme.inverseSurface, foreground: scheme.inverseOnSurface },
  ];
  return pairs.map((pair) => ({
    name: pair.name,
    background: colorHex(pair.background),
    foreground: colorHex(pair.foreground),
    ratio: Contrast.ratioOfTones(
      Hct.fromInt(pair.foreground).tone,
      Hct.fromInt(pair.background).tone,
    ),
  }));
}

const toneSteps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const;

export function getTonalPalettes(scheme: DynamicScheme) {
  return [
    { name: "Primary", palette: scheme.primaryPalette },
    { name: "Secondary", palette: scheme.secondaryPalette },
    { name: "Tertiary", palette: scheme.tertiaryPalette },
    { name: "Neutral", palette: scheme.neutralPalette },
    { name: "Neutral variant", palette: scheme.neutralVariantPalette },
    { name: "Error", palette: scheme.errorPalette },
  ].map(({ name, palette }) => ({
    name,
    tones: toneSteps.map((tone) => ({ tone, color: colorHex(palette.tone(tone)) })),
  }));
}
