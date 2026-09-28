import type { Tool, ToolCapability, ToolId } from "./types.ts";
import { validateToolCatalog } from "./metadata.ts";
import { toolSeo } from "./seo.ts";

const localProcessingDescriptions = {
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
} satisfies Record<ToolId, { fr: string; en: string }>;

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
    aliases: ["%", "évolution", "différence", "variation", "taux"],
    lifecycle: "published",    capabilities: ["clipboard"],
    content: {
      fr: { name: "Pourcentage", description: "Calculez un pourcentage, une évolution ou l’écart entre deux valeurs." },
      en: { name: "Percentage calculator", description: "Calculate a percentage, a change, or the gap between two values." },
    },
  },
  {
    id: "reduction", slug: "reduction", icon: "🏷️",
    version: 1,
    complexity: "small",
    categories: ["calculs"],
    tags: ["remise", "promotion", "solde", "prix", "économie"],
    aliases: ["remise", "promotion", "solde", "prix", "économie"],
    lifecycle: "published",    content: {
      fr: { name: "Réduction", description: "Calculez le prix après remise et voyez immédiatement ce que vous économisez." },
      en: { name: "Discount calculator", description: "Calculate the price after a discount and see how much you save." },
    },
  },
  {
    id: "tva", slug: "tva", icon: "💶",
    version: 1,
    complexity: "small",
    categories: ["calculs"],
    tags: ["taxe", "hors taxe", "toutes taxes", "prix", "tva", "ht", "ttc"],
    aliases: ["taxe", "hors taxe", "toutes taxes", "prix", "tva", "ht", "ttc"],
    lifecycle: "published",    content: {
      fr: { name: "TVA", description: "Passez d’un prix HT à TTC, ou de TTC à HT, en quelques secondes." },
      en: { name: "VAT calculator", description: "Convert between net and gross prices with VAT." },
    },
  },
  {
    id: "regle-de-trois", slug: "regle-de-trois", icon: "⚖️",
    version: 1,
    complexity: "small",
    categories: ["calculs"],
    tags: ["proportion", "proportionnalité", "ratio", "quantité", "prix"],
    aliases: ["proportion", "proportionnalité", "ratio", "quantité", "prix"],
    lifecycle: "published",
    content: {
      fr: { name: "Règle de trois", description: "Trouvez une valeur inconnue à partir d’une proportion." },
      en: { name: "Rule of three", description: "Find an unknown value from a known proportion." },
    },
  },
  {
    id: "age", slug: "age", icon: "🎂",
    version: 1,
    complexity: "small",
    categories: ["dates"],
    tags: ["anniversaire", "naissance", "date"],
    aliases: ["anniversaire", "naissance", "date"],
    lifecycle: "published",
    content: {
      fr: { name: "Âge", description: "Calculez votre âge exact à partir de votre date de naissance." },
      en: { name: "Age calculator", description: "Calculate your exact age from your date of birth." },
    },
  },
  {
    id: "duree", slug: "duree", icon: "⏱️",
    version: 1,
    complexity: "small",
    categories: ["dates"],
    tags: ["temps", "date", "heures", "jours", "intervalle"],
    aliases: ["temps", "date", "heures", "jours", "intervalle"],
    lifecycle: "published",
    content: {
      fr: { name: "Durée", description: "Mesurez l’intervalle entre deux dates ou deux horaires." },
      en: { name: "Duration calculator", description: "Measure the time between two dates or two times." },
    },
  },
  {
    id: "vitesse-telechargement", slug: "vitesse-telechargement", icon: "🚀",
    version: 1,
    complexity: "small",
    categories: ["informatique"],
    tags: ["internet", "débit", "connexion", "megabit", "mégaoctet"],
    aliases: ["internet", "débit", "connexion", "megabit", "mégaoctet"],
    lifecycle: "published",
    content: {
      fr: { name: "Mbps ↔ Mo/s", description: "Convertissez rapidement un débit Internet entre Mbps et Mo/s." },
      en: { name: "Download speed converter", description: "Convert internet speed between Mbps and MB/s." },
    },
  },
  {
    id: "temps-telechargement", slug: "temps-telechargement", icon: "⏳",
    version: 1,
    complexity: "small",
    categories: ["informatique"],
    tags: ["download", "internet", "débit", "fichier", "durée"],
    aliases: ["download", "internet", "débit", "fichier", "durée"],
    lifecycle: "published",
    content: {
      fr: { name: "Temps de téléchargement", description: "Estimez le temps nécessaire pour récupérer un fichier selon sa taille et votre débit." },
      en: { name: "Download time calculator", description: "Estimate how long a file will take to download." },
    },
  },
  {
    id: "taille-fichier", slug: "taille-fichier", icon: "💾",
    version: 1,
    complexity: "advanced",
    categories: ["informatique"],
    tags: ["poids", "taille", "stockage", "vidéo", "audio", "bitrate"],
    aliases: ["poids", "taille", "stockage", "vidéo", "audio", "bitrate"],
    lifecycle: "published",
    content: {
      fr: { name: "Taille de fichier", description: "Estimez la taille d’un fichier à partir de sa durée et de son débit." },
      en: { name: "File size calculator", description: "Estimate a file size from its duration and bitrate." },
    },
  },
  {
    id: "convertisseur-taille", slug: "convertisseur-taille", icon: "🔄",
    version: 1,
    complexity: "small",
    categories: ["informatique"],
    tags: ["ko", "mo", "go", "to", "octets", "stockage"],
    aliases: ["ko", "mo", "go", "to", "octets", "stockage"],
    lifecycle: "published",
    content: {
      fr: { name: "Taille de fichier", description: "Convertissez des tailles entre octets, Ko, Mo, Go, To et leurs équivalents binaires." },
      en: { name: "File size converter", description: "Convert file sizes between bytes, kB, MB, GB, TB and binary units." },
    },
  },
  {
    id: "mots-caracteres", slug: "mots-caracteres", icon: "🔤",
    version: 1,
    complexity: "small",
    categories: ["fichiers"],
    tags: ["texte", "lettres", "compter", "ligne", "paragraphes"],
    aliases: ["texte", "lettres", "compter", "ligne", "paragraphes"],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Mots & caractères", description: "Comptez les mots, caractères, espaces et lignes d’un texte." },
      en: { name: "Words & characters", description: "Count words, characters, spaces, and lines in a text." },
    },
  },
  {
    id: "bitrate-video", slug: "bitrate-video", icon: "🎬",
    version: 1,
    complexity: "advanced",
    categories: ["video"],
    tags: ["vidéo", "qualité", "débit", "encodage", "compression"],
    aliases: ["vidéo", "qualité", "débit", "encodage", "compression"],
    lifecycle: "draft",
    content: {
      fr: { name: "Bitrate vidéo", description: "Calculez le débit vidéo ou estimez la taille d’une vidéo." },
      en: { name: "Video bitrate calculator", description: "Calculate video bitrate or estimate a video file size." },
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
    retention: "Aucune donnée n'est transmise ou stockée par Loculary.",
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
