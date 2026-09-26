import type { Locale } from "./config.ts";

export type Messages = {
  nav: { home: string; tools: string; language: string };
  actions: { copy: string; copied: string; clear: string };
  home: { badge: string; title: string; description: string; examples: string; explore: string; categoriesTitle: string; categoriesDescription: string };
  tools: {
    eyebrow: string; title: string; description: string; explore: string; one: string; many: string; back: string;
    categoryDescription: string; searchLabel: string; searchPlaceholder: string; searchButton: string; suggestions: string;
    resultCountOne: string; resultCountMany: string; noResults: string; noResultsHelp: string; clearSearch: string;
  };
  relatedTools: { title: string };
  processing: {
    ariaLabel: string; more: string; storage: string; retention: string; externalProviders: string; dataCategories: string;
    localLabel: string; localSummary: string; externalLabel: string; externalSummary: string;
    serverLabel: string; serverSummary: string; hybridLabel: string; hybridSummary: string;
  };
};

export const messages: Record<Locale, Messages> = {
  fr: {
    nav: { home: "Accueil", tools: "Outils", language: "Langue" },
    actions: { copy: "Copier", copied: "Copié", clear: "Effacer" },
    home: {
      badge: "Des outils simples pour le quotidien",
      title: "Trouvez l’outil qu’il vous faut.",
      description: "Calculs, conversions, dates, fichiers et bien plus.",
      examples: "Essayez : TVA, remise, internet, vidéo, âge...",
      explore: "Explorer",
      categoriesTitle: "Trouvez l’outil dont vous avez besoin",
      categoriesDescription: "Parcourez nos différentes catégories pour trouver rapidement le bon outil.",
    },
    tools: {
      eyebrow: "Utiluna", title: "Tous les outils",
      description: "Retrouvez tous nos outils gratuits pour calculer, convertir et simplifier vos tâches du quotidien.",
      explore: "Explorer les outils", one: "outil", many: "outils", back: "← Tous les outils",
      categoryDescription: "Retrouvez les outils disponibles dans la catégorie",
      searchLabel: "Rechercher un outil", searchPlaceholder: "Que recherchez-vous ?", searchButton: "Rechercher",
      suggestions: "Suggestions", resultCountOne: "résultat", resultCountMany: "résultats",
      noResults: "Aucun outil trouvé pour", noResultsHelp: "Essayez « TVA », « internet », « vidéo » ou « âge ».",
      clearSearch: "Effacer la recherche",
    },
    relatedTools: { title: "Vous pourriez aussi avoir besoin de" },
    processing: {
      ariaLabel: "Informations sur le traitement des données", more: "Informations sur le traitement",
      storage: "Stockage", retention: "Conservation", externalProviders: "Service(s) externe(s)", dataCategories: "Données concernées",
      localLabel: "Traitement local", localSummary: "Vos données restent sur votre appareil.",
      externalLabel: "Service externe", externalSummary: "Certaines données sont transmises à un service externe.",
      serverLabel: "Serveur Utiluna", serverSummary: "Ce traitement nécessite l’infrastructure Utiluna.",
      hybridLabel: "Traitement hybride", hybridSummary: "Le traitement local est complété par un service externe.",
    },
  },
  en: {
    nav: { home: "Home", tools: "Tools", language: "Language" },
    actions: { copy: "Copy", copied: "Copied", clear: "Clear" },
    home: {
      badge: "Simple tools for everyday tasks",
      title: "Find the tool you need.",
      description: "Calculations, conversions, dates, files, and much more.",
      examples: "Try: VAT, discount, internet, video, age...",
      explore: "Explore",
      categoriesTitle: "Find the tool you need",
      categoriesDescription: "Browse our categories to quickly find the right tool.",
    },
    tools: {
      eyebrow: "Utiluna", title: "All tools",
      description: "Free tools to calculate, convert, and simplify everyday tasks.",
      explore: "Explore tools", one: "tool", many: "tools", back: "← All tools",
      categoryDescription: "Browse the tools available in the",
      searchLabel: "Search for a tool", searchPlaceholder: "What are you looking for?", searchButton: "Search",
      suggestions: "Suggestions", resultCountOne: "result", resultCountMany: "results",
      noResults: "No tool found for", noResultsHelp: "Try “VAT”, “internet”, “video”, or “age”.",
      clearSearch: "Clear search",
    },
    relatedTools: { title: "You may also need" },
    processing: {
      ariaLabel: "Data processing information", more: "Processing information",
      storage: "Storage", retention: "Retention", externalProviders: "External service(s)", dataCategories: "Data involved",
      localLabel: "Local processing", localSummary: "Your data stays on your device.",
      externalLabel: "External service", externalSummary: "Some data is sent to an external service.",
      serverLabel: "Utiluna server", serverSummary: "This processing requires Utiluna infrastructure.",
      hybridLabel: "Hybrid processing", hybridSummary: "Local processing is complemented by an external service.",
    },
  },
};

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
