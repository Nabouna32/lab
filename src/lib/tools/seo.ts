import type { Locale } from "../i18n/config.ts";
import type { ToolId, ToolSeoMetadata } from "./types";

export const toolSeo = {
  pourcentage: {
    fr: { title: "Calcul de pourcentage | Loculary", description: "Calculez un pourcentage, une évolution ou une différence entre deux valeurs." },
    en: { title: "Percentage calculator | Loculary", description: "Calculate a percentage, a change, or the difference between two values." },
  },
  reduction: {
    fr: { title: "Calcul de réduction | Loculary", description: "Calculez le prix après remise et le montant économisé." },
    en: { title: "Discount calculator | Loculary", description: "Calculate the price after a discount and see how much you save." },
  },
  tva: {
    fr: { title: "Calcul de TVA HT / TTC | Loculary", description: "Calculez rapidement un prix HT, TTC et le montant de TVA avec le taux de votre choix." },
    en: { title: "VAT Calculator | Loculary", description: "Calculate net and gross prices and the VAT amount using your chosen rate." },
  },
  "regle-de-trois": {
    fr: { title: "Règle de trois | Loculary", description: "Résolvez rapidement un calcul de proportionnalité avec notre calculateur de règle de trois gratuit." },
    en: { title: "Rule of Three Calculator | Loculary", description: "Quickly solve proportionality calculations with our free rule of three calculator." },
  },
  age: {
    fr: { title: "Calcul d’âge | Loculary", description: "Calculez précisément votre âge en années, mois et jours." },
    en: { title: "Age Calculator | Loculary", description: "Calculate your exact age in years, months, and days." },
  },
  duree: {
    fr: { title: "Calcul de durée | Loculary", description: "Calculez facilement une durée entre deux dates ou deux horaires." },
    en: { title: "Duration Calculator | Loculary", description: "Easily calculate a duration between two dates or two times." },
  },
  "convertisseur-taille": {
    fr: { title: "Conversion de taille de fichier | Loculary", description: "Convertissez facilement une taille de fichier entre octets, ko, Mo, Go, To, Kio, Mio, Gio et Tio." },
    en: { title: "File Size Converter | Loculary", description: "Easily convert file sizes between bytes, kB, MB, GB, TB, KiB, MiB, GiB, and TiB." },
  },
  "temps-telechargement": {
    fr: { title: "Temps de téléchargement | Loculary", description: "Estimez le temps nécessaire pour télécharger un fichier selon sa taille et votre débit." },
    en: { title: "Download Time Calculator | Loculary", description: "Estimate how long it takes to download a file based on its size and connection speed." },
  },
  "vitesse-telechargement": {
    fr: { title: "Conversion Mbps ↔ Mo/s | Loculary", description: "Convertissez une vitesse Internet entre Mbps, Gbps, ko/s, Mo/s et Go/s." },
    en: { title: "Download Speed Converter | Loculary", description: "Convert internet speeds between Mbps, Gbps, kB/s, MB/s, and GB/s." },
  },
  "taille-fichier": {
    fr: { title: "Taille de fichier | Loculary", description: "Estimez la taille d'un fichier selon sa durée et son débit." },
    en: { title: "File Size Calculator | Loculary", description: "Estimate a file size from its duration and bitrate." },
  },
  "mots-caracteres": {
    fr: { title: "Compteur de mots & caractères | Loculary", description: "Comptez les mots, caractères, espaces et lignes d'un texte." },
    en: { title: "Word and Character Counter | Loculary", description: "Count words, characters, spaces, and lines in a text." },
  },
  "bitrate-video": {
    fr: { title: "Bitrate vidéo | Loculary", description: "Calculez le bitrate ou la taille approximative d'une vidéo." },
    en: { title: "Video Bitrate Calculator | Loculary", description: "Calculate video bitrate or approximate file size." },
  },
} satisfies Record<ToolId, Record<Locale, ToolSeoMetadata>>;
