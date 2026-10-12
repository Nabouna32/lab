import type { Locale } from "@/lib/i18n/config";
import type { ToolId } from "./types";

function getToolSlugs(): Record<ToolId, Record<Locale, string>> {
  return {
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
    "color-palette-generator": { en: "color-palette-generator", fr: "generateur-de-palette-couleur" },
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
}

export function getToolSlug(locale: Locale, toolId: ToolId): string {
  return getToolSlugs()[toolId][locale];
}

export function getAllToolSlugs(): Record<ToolId, Record<Locale, string>> {
  return getToolSlugs();
}