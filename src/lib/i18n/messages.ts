import type { Locale } from "./config.ts";
import { formatPlural } from "./plural.ts";

export type Messages = {
  nav: { home: string; tools: string; explore: string; language: string; account: string; space: string; menu: string; closeSearch: string };
  breadcrumbs: { label: string };
  footer: { tagline: string; explore: string; account: string };
  actions: { copy: string; copied: string; clear: string };
  home: { metaTitle: string; badge: string; title: string; description: string; quickLinksLabel: string; quickLinks: Array<{ label: string; toolId: string }>; explore: string; discoveryTitle: string; discoveryDescription: string; discoveryOpen: string; categoriesTitle: string; categoriesDescription: string; categoriesCount: (count: number) => string };
  tools: {
    metaTitle: string;
    eyebrow: string; title: string; description: string; explore: string; one: string; many: string;
    categoryDescription: (category: string) => string; searchLabel: string; searchPlaceholder: string; searchButton: string; suggestions: string;
    resultCountOne: string; resultCountMany: string; noResults: string; noResultsHelp: string; tryThese: string; noResultsSuggestions: string[]; clearSearch: string;
    categoriesTitle: string; categoriesDescription: string;
  };
  relatedTools: { title: string };
  theme: { choose: string; system: string; light: string; dark: string; title: string };
  admin: { label: string; title: string; description: string; dashboard: string; access: string; account: string; roles: string; permissions: string; auditLog: string; noAuditEntries: string; noAccess: string; notConfigured: string; modules: string; users: string; usersDescription: string; usersTitle: string; usersBack: string; usersSearch: string; usersSearchPlaceholder: string; usersSearchSubmit: string; usersNoResults: string; usersLoadError: string; userEmail: string; userDisplayName: string; userCreated: string; userLastSignIn: string; userEmailConfirmed: string; userPending: string; userNeverSignedIn: string; userRoles: string; userAssignRole: string; userRemoveRole: string; userNoRoles: string; userUpdated: string; userActionError: string; tools: string; toolsDescription: string; moderation: string; moderationDescription: string; analytics: string; analyticsDescription: string; settings: string; settingsDescription: string; audit: string; auditDescription: string; auditLoadError: string; auditTitle: string; auditBack: string; auditEmpty: string; auditActor: string; auditAction: string; auditTarget: string; auditDate: string; auditDetails: string; userAccess: string; userActive: string; userSuspendedUntil: string; userSuspend: string; userUnsuspend: string; userSuspended: string; userUnsuspended: string; userRevokeSessions: string; userSessionsRevoked: string; roleSuperAdmin: string; roleAdmin: string; available: string; comingSoon: string; },
  account: { label: string; title: string; anonymousDescription: string; signIn: string; signUp: string; signOut: string; submitSignIn: string; submitSignUp: string; email: string; password: string; displayName: string; notSet: string; confirmation: string; alreadySignedIn: string; noAccount: string; hasAccount: string; signInError: string; signUpError: string; authRateLimited: string };
  processing: {
    localDetail: string; ariaLabel: string; more: string; storage: string; retention: string; externalProviders: string; dataCategories: string;
    localLabel: string; localSummary: string; externalLabel: string; externalSummary: string; fallbackNotice: string;
    serverLabel: string; serverSummary: string; hybridLabel: string; hybridSummary: string;
  };
};

export const messages: Record<Locale, Messages> = {
  fr: {
    nav: { home: "Accueil", tools: "Outils", explore: "Voir tous les outils", language: "Langue", account: "Compte", space: "Mon espace", menu: "Menu", closeSearch: "Fermer la recherche" },
    breadcrumbs: { label: "Fil d’Ariane" },
    footer: { tagline: "Des outils utiles, directement dans votre navigateur.", explore: "Voir tous les outils", account: "Votre espace" },
    actions: { copy: "Copier", copied: "Copié", clear: "Effacer" },
    home: {
      metaTitle: "Loculary — Outils gratuits en ligne",
      badge: "Des outils pour passer à l’action",
      title: "Que voulez-vous faire ?",
      description: "Décrivez votre besoin, trouvez l’outil et faites-le maintenant.",
      quickLinksLabel: "Essayez directement",
      quickLinks: [
        { label: "Calculer une remise", toolId: "discount" },
        { label: "Convertir une vitesse", toolId: "download-speed" },
        { label: "Calculer mon âge", toolId: "age" },
        { label: "Convertir une taille de fichier", toolId: "file-size-converter" },
      ],
      explore: "Voir tous les outils",
      discoveryTitle: "Quelques outils à essayer", discoveryDescription: "Des outils simples pour les besoins qui reviennent souvent.", discoveryOpen: "Utiliser l’outil",
      categoriesTitle: "Explorer par domaine",
      categoriesDescription: "Parcourez les domaines quand vous savez ce que vous cherchez, sans avoir besoin de connaître le nom de l’outil.",
      categoriesCount: (count) => formatPlural("fr", count, { one: "catégorie", other: "catégories" }),
    },
    tools: {
      metaTitle: "Tous les outils — Loculary", eyebrow: "Loculary", title: "Tous les outils",
      description: "Tous les outils disponibles pour calculer, convertir, analyser et gagner du temps.",
      explore: "Explorer les outils", one: "outil", many: "outils",
      categoryDescription: (category) => `Retrouvez les outils disponibles dans la catégorie ${category}.`,
      searchLabel: "Rechercher dans les outils", searchPlaceholder: "Que voulez-vous faire ? Ex. calculer une remise", searchButton: "Rechercher",
      suggestions: "Suggestions", resultCountOne: "résultat", resultCountMany: "résultats",
      noResults: "Aucun outil ne correspond à", noResultsHelp: "Essayez un terme plus simple ou choisissez une suggestion.", tryThese: "Vous cherchez peut-être", noResultsSuggestions: ["TVA", "taille de fichier", "vidéo", "âge"],
      clearSearch: "Effacer la recherche",
      categoriesTitle: "Parcourir par catégorie", categoriesDescription: "Si vous préférez explorer, choisissez une catégorie pour voir ses outils.",
    },
    relatedTools: { title: "Pour continuer" },
    theme: { choose: "Choisir le thème", system: "Système", light: "Clair", dark: "Sombre", title: "Thème" },
    admin: {
      label: "Administration", title: "Administration Loculary", description: "Gérez le site depuis un espace séparé du reste de Loculary.", dashboard: "Tableau de bord", access: "Accès", account: "Compte", roles: "Rôles", permissions: "Permissions", auditLog: "Journal des actions", noAuditEntries: "Aucune action administrative enregistrée.", noAccess: "Vous n’avez pas accès à cette administration.", notConfigured: "Aucun compte administrateur n’est encore configuré. Après la création de votre compte, le premier accès doit être attribué explicitement.", modules: "Modules", users: "Utilisateurs", usersDescription: "Comptes, accès et rôles.", usersTitle: "Gestion des utilisateurs", usersBack: "← Tableau de bord", usersSearch: "Rechercher un utilisateur", usersSearchPlaceholder: "E-mail ou nom d’affichage", usersSearchSubmit: "Rechercher", usersNoResults: "Aucun utilisateur trouvé.", usersLoadError: "Impossible de charger les utilisateurs pour le moment.", userEmail: "E-mail", userDisplayName: "Nom d’affichage", userCreated: "Créé le", userLastSignIn: "Dernière connexion", userEmailConfirmed: "E-mail confirmé", userPending: "E-mail non confirmé", userNeverSignedIn: "Jamais connecté", userRoles: "Rôles", userAssignRole: "Attribuer un rôle", userRemoveRole: "Retirer", userNoRoles: "Aucun rôle administrateur", userUpdated: "Modification enregistrée.", userActionError: "La modification n’a pas pu être enregistrée.", tools: "Outils et contenu", toolsDescription: "Outils, catégories et publication.", moderation: "Modération", moderationDescription: "Commentaires, signalements et propositions.", analytics: "Statistiques", analyticsDescription: "Comprendre l’utilisation du service.", settings: "Réglages", settingsDescription: "Configuration générale de Loculary.", audit: "Journal des actions", auditDescription: "Voir les actions administratives importantes.", auditLoadError: "Impossible de charger le journal des actions pour le moment.", auditTitle: "Journal des actions", auditBack: "← Tableau de bord", auditEmpty: "Aucune action administrative enregistrée.", auditActor: "Administrateur", auditAction: "Action", auditTarget: "Cible", auditDate: "Date", auditDetails: "Détails", userAccess: "Accès au compte", userActive: "Compte actif.", userSuspendedUntil: "Suspendu jusqu’au", userSuspend: "Suspendre le compte", userUnsuspend: "Réactiver le compte", userSuspended: "Compte suspendu.", userUnsuspended: "Compte réactivé.", userRevokeSessions: "Révoquer les sessions", userSessionsRevoked: "Sessions révoquées.", roleSuperAdmin: "Super administrateur", roleAdmin: "Administrateur", available: "Disponible", comingSoon: "Bientôt",
    },
    account: {
      label: "Espace personnel", title: "Votre compte",
      anonymousDescription: "Créez un compte pour retrouver vos préférences et vos futurs outils personnels, sans bloquer l’utilisation anonyme de Loculary.",
      signIn: "Se connecter", signUp: "Créer un compte", signOut: "Se déconnecter",
      submitSignIn: "Se connecter", submitSignUp: "Créer mon compte",
      email: "Adresse e-mail", password: "Mot de passe", displayName: "Nom d’affichage",
      notSet: "Non renseigné",
      confirmation: "Votre compte est créé. Vérifiez votre e-mail pour confirmer votre adresse avant de vous connecter.",
      alreadySignedIn: "Vous êtes déjà connecté.", noAccount: "Pas encore de compte ?", hasAccount: "Vous avez déjà un compte ?", signInError: "Impossible de vous connecter. Vérifiez votre adresse e-mail et votre mot de passe.", signUpError: "Impossible de créer le compte. Vérifiez les informations saisies et réessayez.", authRateLimited: "Trop de tentatives. Réessayez dans quelques instants.",
    },
    processing: {
      localDetail: "Aucune donnée n'est envoyée à un serveur ni stockée par Loculary.", ariaLabel: "Informations sur le traitement des données", more: "Informations sur le traitement",
      storage: "Stockage", retention: "Conservation", externalProviders: "Service(s) externe(s)", dataCategories: "Données concernées",
      localLabel: "Traitement local", localSummary: "Vos données restent sur votre appareil.", fallbackNotice: "Cette partie est actuellement disponible en anglais.",
      externalLabel: "Service externe", externalSummary: "Certaines données sont transmises à un service externe.",
      serverLabel: "Serveur", serverSummary: "Ce traitement nécessite un service serveur.",
      hybridLabel: "Traitement hybride", hybridSummary: "Le traitement local est complété par un service externe.",
    },
  },
  en: {
    nav: { home: "Home", tools: "Tools", explore: "View all tools", language: "Language", account: "Account", space: "My space", menu: "Menu", closeSearch: "Close search" },
    breadcrumbs: { label: "Breadcrumb" },
    footer: { tagline: "Useful tools, ready to use in your browser.", explore: "View all tools", account: "Your space" },
    actions: { copy: "Copy", copied: "Copied", clear: "Clear" },
    home: {
      metaTitle: "Loculary — Outils en ligne gratuits",
      badge: "Tools that get things done",
      title: "What do you want to do?",
      description: "Describe what you need, find the right tool, and get it done.",
      quickLinksLabel: "Try one of these",
      quickLinks: [
        { label: "Calculate a discount", toolId: "reduction" },
        { label: "Convert a speed", toolId: "vitesse-telechargement" },
        { label: "Calculate my age", toolId: "age" },
        { label: "Convert a file size", toolId: "convertisseur-taille" },
      ],
      explore: "View all tools",
      discoveryTitle: "A few tools worth trying", discoveryDescription: "Simple tools for tasks that come up again and again.", discoveryOpen: "Use tool",
      categoriesTitle: "Explore by domain",
      categoriesDescription: "Browse by domain when you know what kind of task you have, even if you do not know the tool name.",
      categoriesCount: (count) => formatPlural("en", count, { one: "category", other: "categories" }),
    },
    tools: {
      metaTitle: "All tools — Loculary", eyebrow: "Loculary", title: "All tools",
      description: "Tools to calculate, convert, analyze, and save time on everyday tasks.",
      explore: "Explore tools", one: "tool", many: "tools",
      categoryDescription: (category) => `Browse the tools available in the ${category}.`,
      searchLabel: "Search the tools", searchPlaceholder: "What do you want to do? e.g. calculate a discount", searchButton: "Search",
      suggestions: "Suggestions", resultCountOne: "result", resultCountMany: "results",
      noResults: "No tool matches", noResultsHelp: "Try a simpler term or choose a suggestion.", tryThese: "You might be looking for", noResultsSuggestions: ["VAT", "file size", "video", "age"],
      clearSearch: "Clear search",
      categoriesTitle: "Browse by category", categoriesDescription: "Prefer to explore? Choose a category to see its tools.",
    },
    relatedTools: { title: "Keep going" },
    theme: { choose: "Choose theme", system: "System", light: "Light", dark: "Dark", title: "Theme" },
    admin: {
      label: "Administration", title: "Loculary administration", description: "Manage the site from a workspace separate from the public Loculary experience.", dashboard: "Dashboard", access: "Access", account: "Account", roles: "Roles", permissions: "Permissions", auditLog: "Audit log", noAuditEntries: "No administrative actions recorded.", noAccess: "You do not have access to this administration.", notConfigured: "No administrator account has been configured yet. After creating your account, the first access must be assigned explicitly.", modules: "Modules", users: "Users", usersDescription: "Accounts, access and roles.", usersTitle: "User management", usersBack: "← Dashboard", usersSearch: "Search for a user", usersSearchPlaceholder: "Email or display name", usersSearchSubmit: "Search", usersNoResults: "No user found.", usersLoadError: "Users could not be loaded right now.", userEmail: "Email", userDisplayName: "Display name", userCreated: "Created", userLastSignIn: "Last sign-in", userEmailConfirmed: "Email confirmed", userPending: "Email not confirmed", userNeverSignedIn: "Never signed in", userRoles: "Roles", userAssignRole: "Assign role", userRemoveRole: "Remove", userNoRoles: "No administrator role", userUpdated: "Change saved.", userActionError: "The change could not be saved.", tools: "Tools and content", toolsDescription: "Tools, categories and publishing.", moderation: "Moderation", moderationDescription: "Comments, reports and proposals.", analytics: "Analytics", analyticsDescription: "Understand how the service is used.", settings: "Settings", settingsDescription: "General Loculary configuration.", audit: "Audit log", auditDescription: "Review important administrative actions.", auditLoadError: "The audit log could not be loaded right now.", auditTitle: "Audit log", auditBack: "← Dashboard", auditEmpty: "No administrative actions recorded.", auditActor: "Administrator", auditAction: "Action", auditTarget: "Target", auditDate: "Date", auditDetails: "Details", userAccess: "Account access", userActive: "Account is active.", userSuspendedUntil: "Suspended until", userSuspend: "Suspend account", userUnsuspend: "Reactivate account", userSuspended: "Account suspended.", userUnsuspended: "Account reactivated.", userRevokeSessions: "Revoke sessions", userSessionsRevoked: "Sessions revoked.", roleSuperAdmin: "Super administrator", roleAdmin: "Administrator", available: "Available", comingSoon: "Coming soon",
    },
    account: {
      label: "Personal space", title: "Your account",
      anonymousDescription: "Create an account to keep your preferences and future personal features, without blocking anonymous use of Loculary.",
      signIn: "Sign in", signUp: "Create an account", signOut: "Sign out",
      submitSignIn: "Sign in", submitSignUp: "Create my account",
      email: "Email address", password: "Password", displayName: "Display name",
      notSet: "Not set",
      confirmation: "Your account has been created. Check your email to confirm your address before signing in.",
      alreadySignedIn: "You are already signed in.", noAccount: "Don't have an account yet?", hasAccount: "Already have an account?", signInError: "We couldn't sign you in. Check your email address and password and try again.", signUpError: "We couldn't create the account. Check the information and try again.", authRateLimited: "Too many attempts. Please try again in a few moments.",
    },
    processing: {
      localDetail: "No data is sent to a server or stored by Loculary.", ariaLabel: "Data processing information", more: "Processing information",
      storage: "Storage", retention: "Retention", externalProviders: "External service(s)", dataCategories: "Data involved",
      localLabel: "Local processing", localSummary: "Your data stays on your device.", fallbackNotice: "This part is currently available in English.",
      externalLabel: "External service", externalSummary: "Some data is sent to an external service.",
      serverLabel: "Server", serverSummary: "This processing requires a server service.",
      hybridLabel: "Hybrid processing", hybridSummary: "Local processing is complemented by an external service.",
    },
  },
};

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}