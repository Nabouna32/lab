import type { Tool, ToolCapability } from "@/lib/tools/types";
import { validateToolCatalog } from "@/lib/tools/metadata";
import { toolSeo } from "@/lib/tools/seo";

const localProcessingDescriptions: Record<string, { fr: string; en: string }> = {
  pourcentage: {
    fr: "Les calculs de pourcentage sont effectués directement dans votre navigateur.",
    en: "Percentage calculations are performed directly in your browser.",
  },
  reduction: {
    fr: "Les calculs de réduction sont effectués directement dans votre navigateur.",
    en: "Discount calculations are performed directly in your browser.",
  },
  tva: {
    fr: "Les calculs de TVA sont effectués directement dans votre navigateur.",
    en: "VAT calculations are performed directly in your browser.",
  },
  "regle-de-trois": {
    fr: "Les calculs de proportionnalité sont effectués directement dans votre navigateur.",
    en: "Proportionality calculations are performed directly in your browser.",
  },
  age: {
    fr: "Le calcul de votre âge est effectué directement dans votre navigateur.",
    en: "Your age calculation is performed directly in your browser.",
  },
  duree: {
    fr: "Le calcul de durée est effectué directement dans votre navigateur.",
    en: "Duration calculations are performed directly in your browser.",
  },
  "vitesse-telechargement": {
    fr: "La conversion de débit est effectuée directement dans votre navigateur.",
    en: "Speed conversion is performed directly in your browser.",
  },
  "temps-telechargement": {
    fr: "L'estimation du temps de téléchargement est effectuée directement dans votre navigateur.",
    en: "Download time estimation is performed directly in your browser.",
  },
  "taille-fichier": {
    fr: "Le calcul de taille de fichier est effectué directement dans votre navigateur.",
    en: "File size calculations are performed directly in your browser.",
  },
  "convertisseur-taille": {
    fr: "La conversion de taille est effectuée directement dans votre navigateur.",
    en: "File size conversion is performed directly in your browser.",
  },
  "mots-caracteres": {
    fr: "Le texte saisi est analysé directement dans votre navigateur.",
    en: "The text you enter is analyzed directly in your browser.",
  },
  "bitrate-video": {
    fr: "Les calculs de bitrate vidéo sont effectués directement dans votre navigateur.",
    en: "Video bitrate calculations are performed directly in your browser.",
  },
};

type ToolDefinition = Pick<
  Tool,
  "id" | "slug" | "icon" | "version" | "complexity" | "categories" | "tags" | "aliases" | "lifecycle" | "content"
> & { capabilities?: ToolCapability[] };

const toolDefinitions: ToolDefinition[] = [
  {
    id: "pourcentage", slug: "pourcentage", icon: "📊",
    version: 1,
    complexity: "small",
    categories: ["calculs"],
    tags: ["%", "évolution", "différence", "variation", "taux"],
    aliases: [],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Calculateur de pourcentage", description: "Calculez facilement un pourcentage, une évolution ou une différence." },
      en: { name: "Percentage Calculator", description: "Easily calculate a percentage, change, or difference." },
    },
  },
  {
    id: "reduction", slug: "reduction", icon: "🏷️",
    version: 1,
    complexity: "small",
    categories: ["calculs"],
    tags: ["remise", "promotion", "solde", "prix", "économie"],
    aliases: [],
    lifecycle: "published",    content: {
      fr: { name: "Calculateur de réduction", description: "Calculez le prix après une réduction et le montant économisé." },
      en: { name: "Discount Calculator", description: "Calculate the price after a discount and the amount saved." },
    },
  },
  {
    id: "tva", slug: "tva", icon: "💶",
    version: 1,
    complexity: "small",
    categories: ["calculs"],
    tags: ["taxe", "hors taxe", "toutes taxes", "prix", "tva", "ht", "ttc"],
    aliases: [],
    lifecycle: "published",    content: {
      fr: { name: "Calculateur TVA HT / TTC", description: "Convertissez facilement un prix HT en TTC et inversement." },
      en: { name: "VAT Calculator", description: "Convert prices between net and gross amounts with VAT." },
    },
  },
  {
    id: "regle-de-trois", slug: "regle-de-trois", icon: "⚖️",
    version: 1,
    complexity: "small",
    categories: ["calculs"],
    tags: ["proportion", "proportionnalité", "ratio", "quantité", "prix"],
    aliases: [],
    lifecycle: "published",
    content: {
      fr: { name: "Règle de trois", description: "Résolvez rapidement vos calculs de proportionnalité." },
      en: { name: "Rule of Three Calculator", description: "Quickly solve proportionality calculations." },
    },
  },
  {
    id: "age", slug: "age", icon: "🎂",
    version: 1,
    complexity: "small",
    categories: ["dates"],
    tags: ["anniversaire", "naissance", "date"],
    aliases: [],
    lifecycle: "published",
    content: {
      fr: { name: "Calculateur d'âge", description: "Calculez précisément votre âge à partir d'une date de naissance." },
      en: { name: "Age Calculator", description: "Calculate your exact age from a birth date." },
    },
  },
  {
    id: "duree", slug: "duree", icon: "⏱️",
    version: 1,
    complexity: "small",
    categories: ["dates"],
    tags: ["temps", "date", "heures", "jours", "intervalle"],
    aliases: [],
    lifecycle: "published",
    content: {
      fr: { name: "Calculateur de durée", description: "Calculez la durée entre deux dates ou deux horaires." },
      en: { name: "Duration Calculator", description: "Calculate the duration between two dates or times." },
    },
  },
  {
    id: "vitesse-telechargement", slug: "vitesse-telechargement", icon: "🚀",
    version: 1,
    complexity: "small",
    categories: ["informatique"],
    tags: ["internet", "débit", "connexion", "megabit", "mégaoctet"],
    aliases: [],
    lifecycle: "published",
    content: {
      fr: { name: "Mbps ↔ Mo/s", description: "Convertissez une vitesse Internet entre Mbps et Mo/s." },
      en: { name: "Download Speed Converter", description: "Convert internet speed between Mbps and MB/s." },
    },
  },
  {
    id: "temps-telechargement", slug: "temps-telechargement", icon: "⏳",
    version: 1,
    complexity: "small",
    categories: ["informatique"],
    tags: ["download", "internet", "débit", "fichier", "durée"],
    aliases: [],
    lifecycle: "published",
    content: {
      fr: { name: "Temps de téléchargement", description: "Estimez le temps nécessaire pour télécharger un fichier." },
      en: { name: "Download Time Calculator", description: "Estimate how long it takes to download a file." },
    },
  },
  {
    id: "taille-fichier", slug: "taille-fichier", icon: "💾",
    version: 1,
    complexity: "advanced",
    categories: ["informatique"],
    tags: ["poids", "taille", "stockage", "vidéo", "audio", "bitrate"],
    aliases: [],
    lifecycle: "published",
    content: {
      fr: { name: "Calculateur de taille de fichier", description: "Estimez la taille d'un fichier selon sa durée et son débit." },
      en: { name: "File Size Calculator", description: "Estimate a file size from its duration and bitrate." },
    },
  },
  {
    id: "convertisseur-taille", slug: "convertisseur-taille", icon: "🔄",
    version: 1,
    complexity: "small",
    categories: ["informatique"],
    tags: ["ko", "mo", "go", "to", "octets", "stockage"],
    aliases: [],
    lifecycle: "published",
    content: {
      fr: { name: "Convertisseur de taille", description: "Convertissez facilement Ko, Mo, Go, To et autres unités." },
      en: { name: "File Size Converter", description: "Convert file sizes between bytes, KB, MB, GB, TB, and more." },
    },
  },
  {
    id: "mots-caracteres", slug: "mots-caracteres", icon: "🔤",
    version: 1,
    complexity: "small",
    categories: ["fichiers"],
    tags: ["texte", "lettres", "compter", "ligne", "paragraphes"],
    aliases: [],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Compteur de mots et caractères", description: "Comptez les mots, caractères, espaces et lignes d'un texte." },
      en: { name: "Word and Character Counter", description: "Count words, characters, spaces, and lines in a text." },
    },
  },
  {
    id: "bitrate-video", slug: "bitrate-video", icon: "🎬",
    version: 1,
    complexity: "advanced",
    categories: ["video"],
    tags: ["vidéo", "qualité", "débit", "encodage", "compression"],
    aliases: [],
    lifecycle: "draft",
    content: {
      fr: { name: "Calculateur bitrate vidéo", description: "Calculez le bitrate ou la taille approximative d'une vidéo." },
      en: { name: "Video Bitrate Calculator", description: "Calculate video bitrate or approximate file size." },
    },
  },
];

export const tools: Tool[] = toolDefinitions.map((tool): Tool => ({
  ...tool,
  seo: toolSeo[tool.id],
  examples: [],
  processing: {
    mode: "local",
    description: localProcessingDescriptions[tool.id],
    dataCategories: [],
    externalProviders: [],
    storage: "none",
    retention: "Aucune donnée n'est transmise ou stockée par Utiluna.",
    fallback: "Le traitement ne dépend pas d'un service distant.",
  },
  capabilities: ["local-processing", ...(tool.capabilities ?? [])] as ToolCapability[],
  browserRequirements: { apis: [] },
  offline: true,
  sharing: { supported: false, mode: "none" },
  relatedToolIds: [],
  quality: { accessibility: "required", performance: "standard", tests: tool.lifecycle === "published" ? "required" : "not-yet" },
  access: "anonymous",
  contributor: { type: "internal" },
}));

validateToolCatalog(tools);
