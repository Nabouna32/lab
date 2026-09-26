import type { Locale } from "./config.ts";

export type Messages = {
  nav: { home: string; tools: string; language: string; account: string; menu: string };
  breadcrumbs: { label: string };
  footer: { tagline: string; explore: string; account: string };
  actions: { copy: string; copied: string; clear: string };
  home: { badge: string; title: string; description: string; examples: string; explore: string; categoriesTitle: string; categoriesDescription: string };
  tools: {
    eyebrow: string; title: string; description: string; explore: string; one: string; many: string; back: string;
    categoryDescription: string; searchLabel: string; searchPlaceholder: string; searchButton: string; suggestions: string;
    resultCountOne: string; resultCountMany: string; noResults: string; noResultsHelp: string; clearSearch: string;
  };
  relatedTools: { title: string };
  admin: { label: string; title: string; description: string; dashboard: string; access: string; account: string; roles: string; permissions: string; auditLog: string; noAuditEntries: string; noAccess: string; notConfigured: string; modules: string; users: string; usersDescription: string; tools: string; toolsDescription: string; moderation: string; moderationDescription: string; analytics: string; analyticsDescription: string; settings: string; settingsDescription: string; audit: string; auditDescription: string; available: string; comingSoon: string; },
  account: { label: string; title: string; anonymousDescription: string; signIn: string; signUp: string; signOut: string; submitSignIn: string; submitSignUp: string; email: string; password: string; displayName: string; notSet: string; confirmation: string; alreadySignedIn: string; noAccount: string; hasAccount: string };
  processing: {
    ariaLabel: string; more: string; storage: string; retention: string; externalProviders: string; dataCategories: string;
    localLabel: string; localSummary: string; externalLabel: string; externalSummary: string;
    serverLabel: string; serverSummary: string; hybridLabel: string; hybridSummary: string;
  };
};

export const messages: Record<Locale, Messages> = {
  fr: {
    nav: { home: "Accueil", tools: "Outils", language: "Langue", account: "Compte", menu: "Menu" },
    breadcrumbs: { label: "Fil d’Ariane" },
    footer: { tagline: "Une boîte à outils numérique, simple à utiliser et immense à explorer.", explore: "Explorer", account: "Votre espace" },
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
    admin: {
      label: "Administration", title: "Administration Utiluna", description: "Gérez le site depuis un espace séparé du reste d’Utiluna.", dashboard: "Tableau de bord", access: "Accès", account: "Compte", roles: "Rôles", permissions: "Permissions", auditLog: "Journal des actions", noAuditEntries: "Aucune action administrative enregistrée.", noAccess: "Vous n’avez pas accès à cette administration.", notConfigured: "Aucun compte administrateur n’est encore configuré. Après la création de votre compte, le premier accès doit être attribué explicitement.", modules: "Modules", users: "Utilisateurs", usersDescription: "Comptes, accès et rôles.", tools: "Outils et contenu", toolsDescription: "Outils, catégories et publication.", moderation: "Modération", moderationDescription: "Commentaires, signalements et propositions.", analytics: "Statistiques", analyticsDescription: "Comprendre l’utilisation du service.", settings: "Réglages", settingsDescription: "Configuration générale d’Utiluna.", audit: "Journal des actions", auditDescription: "Voir les actions administratives importantes.", available: "Disponible", comingSoon: "Bientôt",
    },
    account: {
      label: "Espace personnel", title: "Votre compte",
      anonymousDescription: "Créez un compte pour retrouver vos préférences et vos futurs outils personnels, sans bloquer l’utilisation anonyme d’Utiluna.",
      signIn: "Se connecter", signUp: "Créer un compte", signOut: "Se déconnecter",
      submitSignIn: "Se connecter", submitSignUp: "Créer mon compte",
      email: "Adresse e-mail", password: "Mot de passe", displayName: "Nom d’affichage",
      notSet: "Non renseigné",
      confirmation: "Votre compte est créé. Vérifiez votre e-mail pour confirmer votre adresse avant de vous connecter.",
      alreadySignedIn: "Vous êtes déjà connecté.", noAccount: "Pas encore de compte ?", hasAccount: "Vous avez déjà un compte ?",
    },
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
    nav: { home: "Home", tools: "Tools", language: "Language", account: "Account", menu: "Menu" },
    breadcrumbs: { label: "Breadcrumb" },
    footer: { tagline: "A digital toolbox that is simple to use and made to explore.", explore: "Explore", account: "Your space" },
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
    admin: {
      label: "Administration", title: "Utiluna administration", description: "Manage the site from a workspace separate from the public Utiluna experience.", dashboard: "Dashboard", access: "Access", account: "Account", roles: "Roles", permissions: "Permissions", auditLog: "Audit log", noAuditEntries: "No administrative actions recorded.", noAccess: "You do not have access to this administration.", notConfigured: "No administrator account has been configured yet. After creating your account, the first access must be assigned explicitly.", modules: "Modules", users: "Users", usersDescription: "Accounts, access and roles.", tools: "Tools and content", toolsDescription: "Tools, categories and publishing.", moderation: "Moderation", moderationDescription: "Comments, reports and proposals.", analytics: "Analytics", analyticsDescription: "Understand how the service is used.", settings: "Settings", settingsDescription: "General Utiluna configuration.", audit: "Audit log", auditDescription: "Review important administrative actions.", available: "Available", comingSoon: "Coming soon",
    },
    account: {
      label: "Personal space", title: "Your account",
      anonymousDescription: "Create an account to keep your preferences and future personal features, without blocking anonymous use of Utiluna.",
      signIn: "Sign in", signUp: "Create an account", signOut: "Sign out",
      submitSignIn: "Sign in", submitSignUp: "Create my account",
      email: "Email address", password: "Password", displayName: "Display name",
      notSet: "Not set",
      confirmation: "Your account has been created. Check your email to confirm your address before signing in.",
      alreadySignedIn: "You are already signed in.", noAccount: "Don't have an account yet?", hasAccount: "Already have an account?",
    },
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
