import type { Locale } from "../i18n/config.ts";
import type { ToolId, ToolSeoMetadata } from "./types";

export const toolSeo = {
  percentage: {
    fr: { title: "Calcul de pourcentage | Loculary", description: "Calculez un pourcentage, une évolution ou une différence entre deux valeurs." },
    en: { title: "Percentage calculator | Loculary", description: "Calculate a percentage, a change, or the difference between two values." },
  },
  discount: {
    fr: { title: "Calcul de réduction | Loculary", description: "Calculez le prix après remise et le montant économisé." },
    en: { title: "Discount calculator | Loculary", description: "Calculate the price after a discount and see how much you save." },
  },
  vat: {
    fr: { title: "Calcul de TVA HT / TTC | Loculary", description: "Calculez rapidement un prix HT, TTC et le montant de TVA avec le taux de votre choix." },
    en: { title: "VAT Calculator | Loculary", description: "Calculate net and gross prices and the VAT amount using your chosen rate." },
  },
  "rule-of-three": {
    fr: { title: "Règle de trois | Loculary", description: "Résolvez rapidement un calcul de proportionnalité avec notre calculateur de règle de trois gratuit." },
    en: { title: "Rule of Three Calculator | Loculary", description: "Quickly solve proportionality calculations with our free rule of three calculator." },
  },
  age: {
    fr: { title: "Calcul d’âge | Loculary", description: "Calculez précisément votre âge en années, mois et jours." },
    en: { title: "Age Calculator | Loculary", description: "Calculate your exact age in years, months, and days." },
  },
  duration: {
    fr: { title: "Calcul de durée | Loculary", description: "Calculez facilement une durée entre deux dates ou deux horaires." },
    en: { title: "Duration Calculator | Loculary", description: "Easily calculate a duration between two dates or two times." },
  },
  "file-size-converter": {
    fr: { title: "Conversion de taille de fichier | Loculary", description: "Convertissez facilement une taille de fichier entre octets, ko, Mo, Go, To, Kio, Mio, Gio et Tio." },
    en: { title: "File Size Converter | Loculary", description: "Easily convert file sizes between bytes, kB, MB, GB, TB, KiB, MiB, GiB, and TiB." },
  },
  "download-time": {
    fr: { title: "Temps de téléchargement | Loculary", description: "Estimez le temps nécessaire pour télécharger un fichier selon sa taille et votre débit." },
    en: { title: "Download Time Calculator | Loculary", description: "Estimate how long it takes to download a file based on its size and connection speed." },
  },
  "download-speed": {
    fr: { title: "Conversion Mbps ↔ Mo/s | Loculary", description: "Convertissez une vitesse Internet entre Mbps, Gbps, ko/s, Mo/s et Go/s." },
    en: { title: "Download Speed Converter | Loculary", description: "Convert internet speeds between Mbps, Gbps, kB/s, MB/s, and GB/s." },
  },
  "file-size": {
    fr: { title: "Taille de fichier | Loculary", description: "Estimez la taille d'un fichier selon sa durée et son débit." },
    en: { title: "File Size Calculator | Loculary", description: "Estimate a file size from its duration and bitrate." },
  },
  "word-character-counter": {
    fr: { title: "Compteur de mots & caractères | Loculary", description: "Comptez les mots, caractères, espaces et lignes d'un texte." },
    en: { title: "Word and Character Counter | Loculary", description: "Count words, characters, spaces, and lines in a text." },
  },
  "text-case-converter": {
    fr: { title: "Convertisseur de casse | Loculary", description: "Transformez rapidement un texte en majuscules, minuscules, Title Case, camelCase, PascalCase, snake_case ou kebab-case." },
    en: { title: "Text Case Converter | Loculary", description: "Transform text into uppercase, lowercase, Title Case, camelCase, PascalCase, snake_case, or kebab-case." },
  },
  "unit-converter": {
    fr: { title: "Convertisseur d’unités | Loculary", description: "Convertissez des longueurs, masses, températures, volumes et surfaces directement dans votre navigateur." },
    en: { title: "Unit Converter | Loculary", description: "Convert length, mass, temperature, volume, and area units directly in your browser." },
  },
  "base64-encoder-decoder": {
    fr: { title: "Encodeur et décodeur Base64 | Loculary", description: "Encodez et décodez du texte UTF-8 en Base64 directement dans votre navigateur." },
    en: { title: "Base64 Encoder & Decoder | Loculary", description: "Encode and decode UTF-8 text as Base64 directly in your browser." },
  },
  "csv-json-converter": {
    fr: { title: "Convertisseur CSV et JSON | Loculary", description: "Convertissez des données CSV en JSON et des tableaux JSON en CSV directement dans votre navigateur." },
    en: { title: "CSV & JSON Converter | Loculary", description: "Convert CSV data to JSON and JSON object arrays to CSV directly in your browser." },
  },
  "html-entity-encoder-decoder": {
    fr: { title: "Encodeur et décodeur d’entités HTML | Loculary", description: "Encodez les caractères spéciaux HTML et décodez les entités nommées ou numériques directement dans votre navigateur." },
    en: { title: "HTML Entity Encoder & Decoder | Loculary", description: "Encode HTML-special characters and decode named or numeric entities directly in your browser." },
  },
  "uuid-generator": {
    fr: { title: "Générateur UUID | Loculary", description: "Générez des UUID v4 aléatoires directement dans votre navigateur." },
    en: { title: "UUID Generator | Loculary", description: "Generate random UUID v4 values directly in your browser." },
  },
  "url-encoder-decoder": {
    fr: { title: "Encodeur et décodeur d’URL | Loculary", description: "Encodez et décodez du texte ou des URL directement dans votre navigateur." },
    en: { title: "URL Encoder & Decoder | Loculary", description: "Encode and decode text or URLs directly in your browser." },
  },
  "json-formatter": {
    fr: { title: "Formateur JSON et validateur en ligne | Loculary", description: "Validez, formatez et minifiez votre JSON gratuitement, directement dans votre navigateur." },
    en: { title: "JSON Formatter & Validator | Loculary", description: "Validate, format, and minify JSON for free directly in your browser." },
  },
  "unix-timestamp": {
    fr: { title: "Convertisseur de timestamp Unix | Loculary", description: "Convertissez un timestamp Unix en date ou une date en timestamp, en secondes ou millisecondes." },
    en: { title: "Unix Timestamp Converter | Loculary", description: "Convert Unix timestamps to dates or dates to timestamps in seconds or milliseconds." },
  },
  "password-generator": {
    fr: { title: "Générateur de mots de passe | Loculary", description: "Générez des mots de passe aléatoires directement dans votre navigateur avec des options de longueur et de caractères." },
    en: { title: "Password Generator | Loculary", description: "Generate random passwords directly in your browser with configurable length and character sets." },
  },
  "regex-tester": {
    fr: { title: "Testeur de regex | Loculary", description: "Testez des expressions régulières JavaScript et visualisez les correspondances directement dans votre navigateur." },
    en: { title: "Regex Tester | Loculary", description: "Test JavaScript regular expressions and inspect matches directly in your browser." },
  },
  "hash-generator": {
    fr: { title: "Générateur de hash | Loculary", description: "Générez des empreintes SHA-1, SHA-256, SHA-384 ou SHA-512 directement dans votre navigateur." },
    en: { title: "Hash Generator | Loculary", description: "Generate SHA-1, SHA-256, SHA-384, or SHA-512 digests directly in your browser." },
  },
  "jwt-decoder": {
    fr: { title: "Décodeur JWT | Loculary", description: "Décodez des JSON Web Tokens et lisez leur en-tête et leur contenu directement dans votre navigateur." },
    en: { title: "JWT Decoder | Loculary", description: "Decode JSON Web Tokens and inspect their header and payload directly in your browser." },
  },
  "video-bitrate": {
    fr: { title: "Bitrate vidéo | Loculary", description: "Calculez le bitrate ou la taille approximative d'une vidéo." },
    en: { title: "Video Bitrate Calculator | Loculary", description: "Calculate video bitrate or approximate file size." },
  },
  "color-converter": {
    fr: { title: "Convertisseur de couleurs | Loculary", description: "Convertissez des couleurs entre HEX, RGB et HSL directement dans votre navigateur." },
    en: { title: "Color Converter | Loculary", description: "Convert colors between HEX, RGB, and HSL directly in your browser." },
  },
  "color-palette-generator": {
    fr: { title: "Générateur de palette de couleurs | Loculary", description: "Générez des palettes de couleurs harmonieuses à partir d’une couleur, directement dans votre navigateur." },
    en: { title: "Color Palette Generator | Loculary", description: "Generate harmonious color palettes from a starting color directly in your browser." },
  },
  "contrast-checker": {
    fr: { title: "Vérificateur de contraste des couleurs | Loculary", description: "Vérifiez le contraste entre deux couleurs et les seuils WCAG AA et AAA directement dans votre navigateur." },
    en: { title: "Color Contrast Checker | Loculary", description: "Check color contrast and WCAG AA and AAA thresholds directly in your browser." },
  },
} satisfies Record<ToolId, Record<Locale, ToolSeoMetadata>>;
