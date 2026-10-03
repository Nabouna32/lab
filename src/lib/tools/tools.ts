import type { Tool, ToolCapability, ToolId } from "./types.ts";
import { validateToolCatalog } from "./metadata.ts";
import { toolSeo } from "./seo.ts";

const localProcessingDescriptions = {
  percentage: {
    fr: "Les calculs de pourcentage sont effectués directement dans votre navigateur.",
    en: "Percentage calculations are performed directly in your browser.",
  },
  discount: {
    fr: "Les calculs de réduction sont effectués directement dans votre navigateur.",
    en: "Discount calculations are performed directly in your browser.",
  },
  vat: {
    fr: "Les calculs de TVA sont effectués directement dans votre navigateur.",
    en: "VAT calculations are performed directly in your browser.",
  },
  "rule-of-three": {
    fr: "Les calculs de proportionnalité sont effectués directement dans votre navigateur.",
    en: "Proportionality calculations are performed directly in your browser.",
  },
  age: {
    fr: "Le calcul de votre âge est effectué directement dans votre navigateur.",
    en: "Your age calculation is performed directly in your browser.",
  },
  duration: {
    fr: "Le calcul de durée est effectué directement dans votre navigateur.",
    en: "Duration calculations are performed directly in your browser.",
  },
  "download-speed": {
    fr: "La conversion de débit est effectuée directement dans votre navigateur.",
    en: "Speed conversion is performed directly in your browser.",
  },
  "download-time": {
    fr: "L'estimation du temps de téléchargement est effectuée directement dans votre navigateur.",
    en: "Download time estimation is performed directly in your browser.",
  },
  "file-size": {
    fr: "Le calcul de taille de fichier est effectué directement dans votre navigateur.",
    en: "File size calculations are performed directly in your browser.",
  },
  "file-size-converter": {
    fr: "La conversion de taille est effectuée directement dans votre navigateur.",
    en: "File size conversion is performed directly in your browser.",
  },
  "word-character-counter": {
    fr: "Le texte saisi est analysé directement dans votre navigateur.",
    en: "The text you enter is analyzed directly in your browser.",
  },
  "contrast-checker": {
    fr: "Les couleurs saisies et le calcul de contraste sont traités directement dans votre navigateur.",
    en: "The colors you enter and the contrast calculation are processed directly in your browser.",
  },
  "video-bitrate": {
    fr: "Les calculs de bitrate vidéo sont effectués directement dans votre navigateur.",
    en: "Video bitrate calculations are performed directly in your browser.",
  },
  "json-formatter": {
    fr: "Le JSON saisi est validé et formaté directement dans votre navigateur.",
    en: "The JSON you enter is validated and formatted directly in your browser.",
  },
  "url-encoder-decoder": {
    fr: "Le texte saisi est encodé ou décodé directement dans votre navigateur.",
    en: "The text you enter is encoded or decoded directly in your browser.",
  },
  "base64-encoder-decoder": {
    fr: "Le texte saisi est encodé ou décodé en Base64 directement dans votre navigateur.",
    en: "The text you enter is encoded or decoded as Base64 directly in your browser.",
  },
  "uuid-generator": {
    fr: "Les UUID sont générés aléatoirement directement dans votre navigateur.",
    en: "UUIDs are generated randomly directly in your browser.",
  },
  "unix-timestamp": {
    fr: "Les conversions de timestamp Unix sont effectuées directement dans votre navigateur.",
    en: "Unix timestamp conversions are performed directly in your browser.",
  },
  "hash-generator": {
    fr: "Les empreintes cryptographiques sont calculées directement dans votre navigateur.",
    en: "Cryptographic digests are calculated directly in your browser.",
  },
  "jwt-decoder": {
    fr: "Les JWT sont décodés directement dans votre navigateur.",
    en: "JWTs are decoded directly in your browser.",
  },
  "password-generator": {
    fr: "Les mots de passe sont générés localement avec l’API Web Crypto de votre navigateur.",
    en: "Passwords are generated locally using your browser’s Web Crypto API.",
  },
  "color-converter": {
    fr: "Les couleurs sont converties directement dans votre navigateur.",
    en: "Colors are converted directly in your browser.",
  },
  "color-palette-generator": {
    fr: "Les palettes de couleurs sont générées directement dans votre navigateur.",
    en: "Color palettes are generated directly in your browser.",
  },
  "regex-tester": {
    fr: "Les expressions régulières sont évaluées directement dans votre navigateur.",
    en: "Regular expressions are evaluated directly in your browser.",
  },
} satisfies Record<ToolId, { fr: string; en: string }>;

type ToolDefinition = Pick<
  Tool,
  "id" | "icon" | "version" | "complexity" | "categories" | "tags" | "aliases" | "lifecycle" | "content"
> & { capabilities?: ToolCapability[] };

const toolDefinitions: ToolDefinition[] = [
  {
    id: "percentage", icon: "📊",
    version: 1,
    complexity: "small",
    categories: ["calculations"],
    tags: ["%", "évolution", "différence", "variation", "taux"],
    aliases: ["%", "évolution", "différence", "variation", "taux"],
    lifecycle: "published",    capabilities: ["clipboard"],
    content: {
      fr: { name: "Calculateur de pourcentage", description: "Calculez un pourcentage, une évolution ou l’écart entre deux valeurs." },
      en: { name: "Percentage calculator", description: "Calculate a percentage, a change, or the gap between two values." },
    },
  },
  {
    id: "discount", icon: "🏷️",
    version: 1,
    complexity: "small",
    categories: ["calculations"],
    tags: ["remise", "promotion", "solde", "prix", "économie"],
    aliases: ["remise", "promotion", "solde", "prix", "économie"],
    lifecycle: "published",    content: {
      fr: { name: "Calculateur de réduction", description: "Calculez le prix après remise et voyez immédiatement ce que vous économisez." },
      en: { name: "Discount calculator", description: "Calculate the price after a discount and see how much you save." },
    },
  },
  {
    id: "vat", icon: "💶",
    version: 1,
    complexity: "small",
    categories: ["calculations"],
    tags: ["taxe", "hors taxe", "toutes taxes", "prix", "tva", "ht", "ttc"],
    aliases: ["taxe", "hors taxe", "toutes taxes", "prix", "tva", "ht", "ttc"],
    lifecycle: "published",    content: {
      fr: { name: "Calculateur de TVA", description: "Passez d’un prix HT à TTC, ou de TTC à HT, en quelques secondes." },
      en: { name: "VAT calculator", description: "Convert between net and gross prices with VAT." },
    },
  },
  {
    id: "rule-of-three", icon: "⚖️",
    version: 1,
    complexity: "small",
    categories: ["calculations"],
    tags: ["proportion", "proportionnalité", "ratio", "quantité", "prix"],
    aliases: ["proportion", "proportionnalité", "ratio", "quantité", "prix"],
    lifecycle: "published",
    content: {
      fr: { name: "Règle de trois", description: "Trouvez une valeur inconnue à partir d’une proportion." },
      en: { name: "Rule of three calculator", description: "Find an unknown value from a known proportion." },
    },
  },
  {
    id: "age", icon: "🎂",
    version: 1,
    complexity: "small",
    categories: ["dates"],
    tags: ["anniversaire", "naissance", "date"],
    aliases: ["anniversaire", "naissance", "date"],
    lifecycle: "published",
    content: {
      fr: { name: "Calculateur d’âge", description: "Calculez votre âge exact à partir de votre date de naissance." },
      en: { name: "Age calculator", description: "Calculate your exact age from your date of birth." },
    },
  },
  {
    id: "duration", icon: "⏱️",
    version: 1,
    complexity: "small",
    categories: ["dates"],
    tags: ["temps", "date", "heures", "jours", "intervalle"],
    aliases: ["temps", "date", "heures", "jours", "intervalle"],
    lifecycle: "published",
    content: {
      fr: { name: "Calculateur de durée", description: "Calculez le temps entre deux dates ou deux heures, en jours, heures, minutes et secondes." },
      en: { name: "Duration calculator", description: "Measure the time between two dates or two times." },
    },
  },
  {
    id: "download-speed", icon: "🚀",
    version: 1,
    complexity: "small",
    categories: ["computing"],
    tags: ["internet", "débit", "connexion", "megabit", "mégaoctet"],
    aliases: ["internet", "débit", "connexion", "megabit", "mégaoctet"],
    lifecycle: "published",
    content: {
      fr: { name: "Convertisseur de débit Internet", description: "Convertissez un débit Internet entre Mbps et Mo/s." },
      en: { name: "Download speed converter", description: "Convert internet speed between Mbps and MB/s." },
    },
  },
  {
    id: "download-time", icon: "⏳",
    version: 1,
    complexity: "small",
    categories: ["computing"],
    tags: ["download", "internet", "débit", "fichier", "durée"],
    aliases: ["download", "internet", "débit", "fichier", "durée"],
    lifecycle: "published",
    content: {
      fr: { name: "Calculateur de temps de téléchargement", description: "Estimez le temps nécessaire pour télécharger un fichier selon sa taille et votre débit." },
      en: { name: "Download time calculator", description: "Estimate how long a file will take to download." },
    },
  },
  {
    id: "file-size", icon: "💾",
    version: 1,
    complexity: "advanced",
    categories: ["computing"],
    tags: ["poids", "taille", "stockage", "vidéo", "audio", "bitrate"],
    aliases: ["poids", "taille", "stockage", "vidéo", "audio", "bitrate"],
    lifecycle: "published",
    content: {
      fr: { name: "Calculateur de taille de fichier", description: "Estimez la taille d’un fichier à partir de sa durée et de son débit." },
      en: { name: "File size calculator", description: "Estimate a file size from its duration and bitrate." },
    },
  },
  {
    id: "file-size-converter", icon: "🔄",
    version: 1,
    complexity: "small",
    categories: ["computing"],
    tags: ["ko", "mo", "go", "to", "octets", "stockage"],
    aliases: ["ko", "mo", "go", "to", "octets", "stockage"],
    lifecycle: "published",
    content: {
      fr: { name: "Convertisseur de taille de fichier", description: "Convertissez des tailles entre octets, Ko, Mo, Go, To et leurs équivalents binaires." },
      en: { name: "File size converter", description: "Convert file sizes between bytes, kB, MB, GB, TB and binary units." },
    },
  },
  {
    id: "word-character-counter", icon: "🔤",
    version: 1,
    complexity: "small",
    categories: ["files"],
    tags: ["texte", "lettres", "compter", "ligne", "paragraphes"],
    aliases: ["texte", "lettres", "compter", "ligne", "paragraphes"],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Compteur de mots et caractères", description: "Comptez les mots, caractères, espaces et lignes d’un texte." },
      en: { name: "Words & characters", description: "Count words, characters, spaces, and lines in a text." },
    },
  },
  {
    id: "json-formatter", icon: "{ }",
    version: 1,
    complexity: "advanced",
    categories: ["development"],
    tags: ["json", "formatter", "format", "validate", "validator", "pretty-print", "minify", "developer"],
    aliases: ["json formatter", "json validator", "json format", "json formatteur", "json", "pretty print", "json minifier"],
    lifecycle: "published", capabilities: ["clipboard"],
    content: {
      fr: { name: "Formateur et validateur JSON", description: "Validez, formatez et minifiez du JSON directement dans votre navigateur." },
      en: { name: "JSON Formatter & Validator", description: "Validate, format, and minify JSON directly in your browser." },
    },
  },
  {
    id: "uuid-generator", icon: "🆔",
    version: 1,
    complexity: "small",
    categories: ["development"],
    tags: ["uuid", "guid", "identifier", "random", "v4", "developer"],
    aliases: ["uuid generator", "uuid v4 generator", "guid generator", "générateur uuid", "générateur guid"],
    lifecycle: "published", capabilities: ["clipboard"],
    content: {
      fr: { name: "Générateur UUID", description: "Générez un ou plusieurs UUID v4 aléatoires directement dans votre navigateur." },
      en: { name: "UUID generator", description: "Generate one or more random UUID v4 values directly in your browser." },
    },
  },
  {
    id: "base64-encoder-decoder", icon: "🔐",
    version: 1,
    complexity: "small",
    categories: ["development"],
    tags: ["base64", "encode", "decode", "encodage", "décodage", "utf-8", "text", "developer"],
    aliases: ["base64 encoder", "base64 decoder", "encodeur base64", "décodeur base64", "encodage base64", "décodage base64"],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Encodeur et décodeur Base64", description: "Encodez ou décodez du texte UTF-8 en Base64 directement dans votre navigateur." },
      en: { name: "Base64 Encoder & Decoder", description: "Encode or decode UTF-8 text as Base64 directly in your browser." },
    },
  },
  {
    id: "url-encoder-decoder", icon: "🔗",
    version: 1,
    complexity: "small",
    categories: ["development"],
    tags: ["url", "uri", "encode", "decode", "encodage", "décodage", "percent-encoding", "requête", "web", "developer"],
    aliases: ["url encoder", "url decoder", "encodeur url", "décodeur url", "uri encoder", "uri decoder", "encodage url", "décodage url", "percent encoding", "encode url", "decode url"],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Encodeur et décodeur d’URL", description: "Encodez ou décodez du texte et des URL directement dans votre navigateur." },
      en: { name: "URL Encoder & Decoder", description: "Encode or decode text and URLs directly in your browser." },
    },
  },
  {
    id: "unix-timestamp", icon: "🕐",
    version: 1,
    complexity: "small",
    categories: ["development"],
    tags: ["unix", "timestamp", "epoch", "date", "time", "seconds", "milliseconds", "developer"],
    aliases: ["unix timestamp", "unix time", "epoch", "epoch converter", "timestamp converter", "convertisseur timestamp", "timestamp unix"],
    lifecycle: "published",
    content: {
      fr: { name: "Convertisseur de timestamp Unix", description: "Convertissez un timestamp Unix en date ou une date en timestamp, en secondes ou millisecondes." },
      en: { name: "Unix Timestamp Converter", description: "Convert Unix timestamps to dates or dates to timestamps in seconds or milliseconds." },
    },
  },
  {
    id: "hash-generator", icon: "#️⃣",
    version: 1,
    complexity: "small",
    categories: ["development"],
    tags: ["hash", "sha", "sha-1", "sha-256", "sha-384", "sha-512", "digest", "crypto", "developer"],
    aliases: ["hash generator", "hash calculator", "sha generator", "sha256", "sha-256", "empreinte", "générateur hash", "générateur sha"],
    lifecycle: "published",
    content: {
      fr: { name: "Générateur de hash", description: "Calculez une empreinte SHA-1, SHA-256, SHA-384 ou SHA-512 à partir d’un texte." },
      en: { name: "Hash Generator", description: "Generate a SHA-1, SHA-256, SHA-384, or SHA-512 digest from text." },
    },
  },
  {
    id: "password-generator", icon: "🔐",
    version: 1,
    complexity: "small",
    categories: ["computing"],
    tags: ["password", "mot de passe", "random", "security", "crypto", "generator"],
    aliases: ["password generator", "secure password generator", "mot de passe aléatoire", "générateur de mot de passe", "générateur password"],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Générateur de mots de passe", description: "Générez des mots de passe aléatoires avec une longueur et des caractères personnalisables." },
      en: { name: "Password generator", description: "Generate random passwords with configurable length and character sets." },
    },
  },
  {
    id: "color-converter", icon: "🎨",
    version: 1,
    complexity: "small",
    categories: ["images"],
    tags: ["couleur", "color", "hex", "rgb", "hsl", "design", "css", "web"],
    aliases: ["color converter", "colour converter", "convertisseur couleur", "convertisseur de couleurs", "hex rgb hsl", "hex to rgb", "rgb to hex"],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Convertisseur de couleurs", description: "Convertissez une couleur entre HEX, RGB et HSL directement dans votre navigateur." },
      en: { name: "Color converter", description: "Convert a color between HEX, RGB, and HSL directly in your browser." },
    },
  },
  {
    id: "color-palette-generator", icon: "🌈",
    version: 1,
    complexity: "small",
    categories: ["images"],
    tags: ["palette", "couleur", "color", "harmonie", "design", "css", "web"],
    aliases: ["color palette generator", "colour palette generator", "palette generator", "générateur palette couleurs", "palette de couleurs", "harmonie couleurs"],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Générateur de palette de couleurs", description: "Générez plusieurs harmonies de couleurs à partir d’une couleur de départ, directement dans votre navigateur." },
      en: { name: "Color palette generator", description: "Generate several color harmonies from a starting color directly in your browser." },
    },
  },
  {
    id: "regex-tester", icon: ".*",
    version: 1,
    complexity: "small",
    categories: ["development"],
    tags: ["regex", "regexp", "regular expression", "pattern", "match", "developer"],
    aliases: ["regex tester", "regexp tester", "regular expression tester", "regex checker", "testeur regex", "expression régulière", "regexp"],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Testeur de regex", description: "Testez des expressions régulières JavaScript et visualisez leurs correspondances." },
      en: { name: "Regex Tester", description: "Test JavaScript regular expressions and inspect their matches." },
    },
  },
  {
    id: "jwt-decoder", icon: "🔑",
    version: 1,
    complexity: "small",
    categories: ["development"],
    tags: ["jwt", "json web token", "token", "decode", "decoder", "json", "authentication", "developer"],
    aliases: ["jwt decoder", "jwt decode", "json web token decoder", "décodeur jwt", "decodeur jwt", "jwt"],
    lifecycle: "published",
    capabilities: ["clipboard"],
    content: {
      fr: { name: "Décodeur JWT", description: "Décodez l’en-tête et le contenu d’un JSON Web Token directement dans votre navigateur." },
      en: { name: "JWT Decoder", description: "Decode the header and payload of a JSON Web Token directly in your browser." },
    },
  },
  {
    id: "video-bitrate", icon: "🎬",
    version: 1,
    complexity: "advanced",
    categories: ["video"],
    tags: ["vidéo", "qualité", "débit", "encodage", "compression"],
    aliases: ["vidéo", "qualité", "débit", "encodage", "compression"],
    lifecycle: "published",
    content: {
      fr: { name: "Bitrate vidéo", description: "Calculez un bitrate moyen à partir d’une taille cible ou estimez la taille d’une vidéo à partir de son bitrate." },
      en: { name: "Video bitrate calculator", description: "Calculate average bitrate from a target size or estimate video file size from bitrate." },
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
