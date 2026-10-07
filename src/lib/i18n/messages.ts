import type { Locale } from "./config.ts";
import { formatPlural } from "./plural.ts";

export type Messages = {
  nav: { home: string; tools: string; explore: string; language: string; account: string; space: string; menu: string; closeSearch: string };
  breadcrumbs: { label: string };
  footer: { tagline: string; explore: string; account: string };
  actions: { copy: string; copied: string; clear: string };
  home: { metaTitle: string; badge: string; title: string; description: string; quickLinksLabel: string; quickLinks: Array<{ label: string; toolId: string }>; explore: string; discoveryTitle: string; discoveryDescription: string; discoveryOpen: string; categoriesTitle: string; categoriesDescription: string; categoriesCount: (count: number) => string; ecosystemEyebrow: string; ecosystemTitle: string; ecosystemDescription: string; ecosystemToolsLabel: string; ecosystemVariantLabel: string; ecosystemVariantHint: string; ecosystemVariants: Record<"constellation" | "radial" | "network" | "surfaces", string>; };
  tools: {
    metaTitle: string;
    eyebrow: string; title: string; description: string; explore: string; one: string; many: string;
    categoryDescription: (category: string) => string; searchLabel: string; searchPlaceholder: string; searchButton: string; suggestions: string;
    intentsTitle: string; intentsDescription: string; intents: Array<{ id: string; label: string; icon: string }>;
    allToolsTitle: string;
    resultCountOne: string; resultCountMany: string; searching: string; noResults: string; noResultsHelp: string; tryThese: string; noResultsSuggestions: string[]; clearSearch: string;
    categoriesTitle: string; categoriesDescription: string;
  };
  nextActions: { title: string };
  theme: { choose: string; system: string; light: string; dark: string; title: string };
  admin: { label: string; title: string; description: string; dashboard: string; access: string; account: string; roles: string; permissions: string; auditLog: string; noAuditEntries: string; noAccess: string; notConfigured: string; modules: string; users: string; usersDescription: string; usersTitle: string; usersBack: string; usersSearch: string; usersSearchPlaceholder: string; usersSearchSubmit: string; usersNoResults: string; usersLoadError: string; userEmail: string; userDisplayName: string; userCreated: string; userLastSignIn: string; userEmailConfirmed: string; userPending: string; userNeverSignedIn: string; userRoles: string; userAssignRole: string; userRemoveRole: string; userNoRoles: string; userUpdated: string; userActionError: string; tools: string; toolsDescription: string; moderation: string; moderationDescription: string; analytics: string; analyticsDescription: string; settings: string; settingsDescription: string; audit: string; auditDescription: string; auditLoadError: string; auditTitle: string; auditBack: string; auditEmpty: string; auditActor: string; auditAction: string; auditTarget: string; auditDate: string; auditDetails: string; userAccess: string; userActive: string; userSuspendedUntil: string; userSuspend: string; userUnsuspend: string; userSuspended: string; userUnsuspended: string; userRevokeSessions: string; userSessionsRevoked: string; roleSuperAdmin: string; roleAdmin: string; available: string; comingSoon: string; },
  account: { label: string; title: string; anonymousDescription: string; signIn: string; signUp: string; signOut: string; submitSignIn: string; submitSignUp: string; email: string; password: string; displayName: string; notSet: string; confirmation: string; confirmationSent: string; resendConfirmation: string; alreadySignedIn: string; noAccount: string; hasAccount: string; signInError: string; signUpError: string; authRateLimited: string; invalidEmail: string; forgotPassword: string; forgotPasswordTitle: string; forgotPasswordDescription: string; forgotPasswordSent: string; forgotPasswordError: string; resetPassword: string; resetPasswordTitle: string; resetPasswordDescription: string; passwordConfirmation: string; passwordResetError: string; weakPassword: string; changePassword: string; changePasswordTitle: string; currentPassword: string; passwordChanged: string; currentPasswordError: string; profile: string; saveProfile: string; profileUpdated: string; profileError: string; passwordError: string; security: string; dangerZone: string; preferredLanguage: string; french: string; english: string; emailAddress: string; changeEmail: string; changeEmailTitle: string; changeEmailDescription: string; emailChangeConfirmation: string; emailChangeUpdated: string; emailChangeError: string; emailSame: string; deleteAccount: string; deleteAccountTitle: string; deleteAccountDescription: string; deleteAccountConsequences: string; deleteAccountConfirmationLabel: string; deleteAccountConfirmationPlaceholder: string; deleteAccountButton: string; deleteAccountError: string; deleteAccountSessionError: string; lastSuperAdmin: string; accountDeleted: string; };
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
      ecosystemEyebrow: "L’écosystème Loculary", ecosystemTitle: "Les outils, par domaine", ecosystemDescription: "Une vue plus visuelle des domaines disponibles pour découvrir Loculary.", ecosystemToolsLabel: "outils", ecosystemVariantLabel: "Vue", ecosystemVariantHint: "Chaque vue raconte le même catalogue autrement.", ecosystemVariants: { constellation: "Constellation", radial: "Répartition", network: "Réseau", surfaces: "Surfaces" },
    },
    tools: {
      metaTitle: "Tous les outils — Loculary", eyebrow: "Loculary", title: "Tous les outils",
      description: "Tous les outils disponibles pour calculer, convertir, analyser et gagner du temps.",
      explore: "Explorer les outils", one: "outil", many: "outils",
      categoryDescription: (category) => `Retrouvez les outils disponibles dans la catégorie ${category}.`,
      searchLabel: "Rechercher dans les outils", searchPlaceholder: "Que voulez-vous faire ? Ex. calculer une remise", searchButton: "Rechercher",
      suggestions: "Suggestions", resultCountOne: "résultat", resultCountMany: "résultats", searching: "Recherche en cours…",
      noResults: "Aucun outil ne correspond à", noResultsHelp: "Essayez un terme plus simple ou choisissez une suggestion.", tryThese: "Vous cherchez peut-être", noResultsSuggestions: ["TVA", "taille de fichier", "vidéo", "âge"],
      clearSearch: "Effacer la recherche",
      categoriesTitle: "Parcourir par catégorie", categoriesDescription: "Si vous préférez explorer, choisissez une catégorie pour voir ses outils.",
      intentsTitle: "Commencer par votre tâche", intentsDescription: "Si vous connaissez le résultat recherché sans connaître le nom de l’outil, partez de l’action.",
      intents: [{ id: "calculate", label: "Calculer", icon: "∑" }, { id: "convert", label: "Convertir", icon: "↔" }, { id: "generate", label: "Générer", icon: "✦" }, { id: "analyze", label: "Analyser", icon: "⌁" }, { id: "measure", label: "Mesurer", icon: "◫" }],
      allToolsTitle: "Explorer tous les outils",
    },
    nextActions: { title: "Pour continuer" },
    theme: { choose: "Choisir le thème", system: "Système", light: "Clair", dark: "Sombre", title: "Thème" },
    admin: {
      label: "Administration", title: "Administration Loculary", description: "Gérez le site depuis un espace séparé du reste de Loculary.", dashboard: "Tableau de bord", access: "Accès", account: "Compte", roles: "Rôles", permissions: "Permissions", auditLog: "Journal des actions", noAuditEntries: "Aucune action administrative enregistrée.", noAccess: "Vous n’avez pas accès à cette administration.", notConfigured: "Aucun compte administrateur n’est encore configuré. Après la création de votre compte, le premier accès doit être attribué explicitement.", modules: "Modules", users: "Utilisateurs", usersDescription: "Comptes, accès et rôles.", usersTitle: "Gestion des utilisateurs", usersBack: "← Tableau de bord", usersSearch: "Rechercher un utilisateur", usersSearchPlaceholder: "E-mail ou nom d’affichage", usersSearchSubmit: "Rechercher", usersNoResults: "Aucun utilisateur trouvé.", usersLoadError: "Impossible de charger les utilisateurs pour le moment.", userEmail: "E-mail", userDisplayName: "Nom d’affichage", userCreated: "Créé le", userLastSignIn: "Dernière connexion", userEmailConfirmed: "E-mail confirmé", userPending: "E-mail non confirmé", userNeverSignedIn: "Jamais connecté", userRoles: "Rôles", userAssignRole: "Attribuer un rôle", userRemoveRole: "Retirer", userNoRoles: "Aucun rôle administrateur", userUpdated: "Modification enregistrée.", userActionError: "La modification n’a pas pu être enregistrée.", tools: "Outils et contenu", toolsDescription: "Outils, catégories et publication.", moderation: "Modération", moderationDescription: "Commentaires, signalements et propositions.", analytics: "Statistiques", analyticsDescription: "Comprendre l’utilisation du service.", settings: "Réglages", settingsDescription: "Configuration générale de Loculary.", audit: "Journal des actions", auditDescription: "Voir les actions administratives importantes.", auditLoadError: "Impossible de charger le journal des actions pour le moment.", auditTitle: "Journal des actions", auditBack: "← Tableau de bord", auditEmpty: "Aucune action administrative enregistrée.", auditActor: "Administrateur", auditAction: "Action", auditTarget: "Cible", auditDate: "Date", auditDetails: "Détails", userAccess: "Accès au compte", userActive: "Compte actif.", userSuspendedUntil: "Suspendu jusqu’au", userSuspend: "Suspendre le compte", userUnsuspend: "Réactiver le compte", userSuspended: "Compte suspendu.", userUnsuspended: "Compte réactivé.", userRevokeSessions: "Révoquer les sessions", userSessionsRevoked: "Sessions révoquées.", roleSuperAdmin: "Super administrateur", roleAdmin: "Administrateur", available: "Disponible", comingSoon: "Bientôt",
    },
    account: {
      label: "Compte",
      title: "Compte",
      anonymousDescription: "Créez un compte pour enregistrer vos préférences et gérer votre profil. Loculary reste utilisable sans compte.",
      signIn: "Se connecter", signUp: "Créer un compte", signOut: "Se déconnecter",
      submitSignIn: "Se connecter", submitSignUp: "Créer mon compte",
      email: "Adresse e-mail", password: "Mot de passe", displayName: "Nom d’affichage", notSet: "Non renseigné",
      confirmation: "Votre compte a été créé. Consultez votre boîte mail pour confirmer votre adresse avant de vous connecter.",
      confirmationSent: "Si une confirmation est disponible pour cette adresse, un nouvel e-mail vient d’être envoyé.",
      resendConfirmation: "Renvoyer l’e-mail de confirmation",
      alreadySignedIn: "Vous êtes déjà connecté.", noAccount: "Pas encore de compte ?", hasAccount: "Vous avez déjà un compte ?",
      signInError: "Impossible de vous connecter avec ces informations.", signUpError: "Impossible de créer le compte pour le moment.",
      authRateLimited: "Trop de tentatives. Attendez un moment avant de réessayer.", invalidEmail: "Saisissez une adresse e-mail valide.",
      forgotPassword: "Mot de passe oublié ?", forgotPasswordTitle: "Réinitialiser votre mot de passe",
      forgotPasswordDescription: "Saisissez votre adresse e-mail. Si un compte correspondant existe, nous vous enverrons un lien de réinitialisation.",
      forgotPasswordSent: "Si un compte correspondant existe, un e-mail de réinitialisation vous a été envoyé. Pensez aussi à vérifier vos indésirables.",
      forgotPasswordError: "Impossible d’envoyer l’e-mail pour le moment. Réessayez plus tard.",
      resetPassword: "Définir un nouveau mot de passe", resetPasswordTitle: "Définir un nouveau mot de passe",
      resetPasswordDescription: "Choisissez un nouveau mot de passe pour votre compte.",
      passwordConfirmation: "Confirmer le mot de passe",
      passwordResetError: "Impossible de réinitialiser le mot de passe. Le lien est peut-être expiré ou invalide.",
      weakPassword: "Choisissez un mot de passe plus robuste ou vérifiez les exigences de sécurité du compte.",
      changePassword: "Modifier le mot de passe", changePasswordTitle: "Modifier le mot de passe", currentPassword: "Mot de passe actuel",
      passwordChanged: "Mot de passe modifié.", currentPasswordError: "Le mot de passe actuel est incorrect.",
      profile: "Profil", saveProfile: "Enregistrer", profileUpdated: "Profil enregistré.", profileError: "Impossible d’enregistrer les modifications.", passwordError: "Impossible de modifier le mot de passe.", security: "Sécurité", dangerZone: "Zone de danger",
      preferredLanguage: "Langue", french: "Français", english: "English",
      emailAddress: "Adresse e-mail actuelle", changeEmail: "Modifier l’adresse e-mail", changeEmailTitle: "Modifier l’adresse e-mail",
      changeEmailDescription: "Une confirmation peut être demandée sur l’adresse actuelle et la nouvelle adresse.",
      emailChangeConfirmation: "Votre demande a été enregistrée. Confirmez le changement depuis les e-mails reçus.",
      emailChangeUpdated: "Votre adresse e-mail a été confirmée et mise à jour.", emailChangeError: "Impossible de modifier l’adresse e-mail.",
      emailSame: "Cette adresse est déjà celle de votre compte.",
      deleteAccount: "Supprimer le compte", deleteAccountTitle: "Supprimer votre compte",
      deleteAccountDescription: "Cette action est irréversible. Votre compte et les données personnelles associées seront supprimés.",
      deleteAccountConsequences: "Votre profil et vos données personnelles seront supprimés. Certains journaux administratifs peuvent être conservés sous une forme anonymisée lorsqu’ils sont nécessaires à la sécurité.",
      deleteAccountConfirmationLabel: "Pour confirmer, saisissez DELETE", deleteAccountConfirmationPlaceholder: "DELETE", deleteAccountButton: "Supprimer définitivement le compte",
      deleteAccountError: "La suppression du compte n’a pas pu être finalisée. Réessayez plus tard.", deleteAccountSessionError: "Votre session n’est plus valide. Reconnectez-vous puis réessayez.",
      lastSuperAdmin: "Ce compte est le dernier super administrateur. Attribuez d’abord ce rôle à un autre administrateur avant de supprimer le compte.",
      accountDeleted: "Votre compte a été supprimé. Vous êtes maintenant déconnecté.",
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
        { label: "Calculate a discount", toolId: "discount" },
        { label: "Convert a speed", toolId: "download-speed" },
        { label: "Calculate my age", toolId: "age" },
        { label: "Convert a file size", toolId: "file-size-converter" },
      ],
      explore: "View all tools",
      discoveryTitle: "A few tools worth trying", discoveryDescription: "Simple tools for tasks that come up again and again.", discoveryOpen: "Use tool",
      categoriesTitle: "Explore by domain",
      categoriesDescription: "Browse by domain when you know what kind of task you have, even if you do not know the tool name.",
      categoriesCount: (count) => formatPlural("en", count, { one: "category", other: "categories" }),
      ecosystemEyebrow: "The Loculary ecosystem", ecosystemTitle: "Tools by domain", ecosystemDescription: "A more visual view of the available domains for discovering Loculary.", ecosystemToolsLabel: "tools", ecosystemVariantLabel: "View", ecosystemVariantHint: "Each view presents the same catalog differently.", ecosystemVariants: { constellation: "Constellation", radial: "Distribution", network: "Network", surfaces: "Surfaces" },
    },
    tools: {
      metaTitle: "All tools — Loculary", eyebrow: "Loculary", title: "All tools",
      description: "Tools to calculate, convert, analyze, and save time on everyday tasks.",
      explore: "Explore tools", one: "tool", many: "tools",
      categoryDescription: (category) => `Browse the tools available in the ${category}.`,
      searchLabel: "Search the tools", searchPlaceholder: "What do you want to do? e.g. calculate a discount", searchButton: "Search",
      suggestions: "Suggestions", resultCountOne: "result", resultCountMany: "results", searching: "Searching…",
      noResults: "No tool matches", noResultsHelp: "Try a simpler term or choose a suggestion.", tryThese: "You might be looking for", noResultsSuggestions: ["VAT", "file size", "video", "age"],
      clearSearch: "Clear search",
      categoriesTitle: "Browse by category", categoriesDescription: "Prefer to explore? Choose a category to see its tools.",
      intentsTitle: "Start with your task", intentsDescription: "If you know the outcome you need but not the tool name, start with the action.",
      intents: [{ id: "calculate", label: "Calculate", icon: "∑" }, { id: "convert", label: "Convert", icon: "↔" }, { id: "generate", label: "Generate", icon: "✦" }, { id: "analyze", label: "Analyze", icon: "⌁" }, { id: "measure", label: "Measure", icon: "◫" }],
      allToolsTitle: "Explore all tools",
    },
    nextActions: { title: "Keep going" },
    theme: { choose: "Choose theme", system: "System", light: "Light", dark: "Dark", title: "Theme" },
    admin: {
      label: "Administration", title: "Loculary administration", description: "Manage the site from a workspace separate from the public Loculary experience.", dashboard: "Dashboard", access: "Access", account: "Account", roles: "Roles", permissions: "Permissions", auditLog: "Audit log", noAuditEntries: "No administrative actions recorded.", noAccess: "You do not have access to this administration.", notConfigured: "No administrator account has been configured yet. After creating your account, the first access must be assigned explicitly.", modules: "Modules", users: "Users", usersDescription: "Accounts, access and roles.", usersTitle: "User management", usersBack: "← Dashboard", usersSearch: "Search for a user", usersSearchPlaceholder: "Email or display name", usersSearchSubmit: "Search", usersNoResults: "No user found.", usersLoadError: "Users could not be loaded right now.", userEmail: "Email", userDisplayName: "Display name", userCreated: "Created", userLastSignIn: "Last sign-in", userEmailConfirmed: "Email confirmed", userPending: "Email not confirmed", userNeverSignedIn: "Never signed in", userRoles: "Roles", userAssignRole: "Assign role", userRemoveRole: "Remove", userNoRoles: "No administrator role", userUpdated: "Change saved.", userActionError: "The change could not be saved.", tools: "Tools and content", toolsDescription: "Tools, categories and publishing.", moderation: "Moderation", moderationDescription: "Comments, reports and proposals.", analytics: "Analytics", analyticsDescription: "Understand how the service is used.", settings: "Settings", settingsDescription: "General Loculary configuration.", audit: "Audit log", auditDescription: "Review important administrative actions.", auditLoadError: "The audit log could not be loaded right now.", auditTitle: "Audit log", auditBack: "← Dashboard", auditEmpty: "No administrative actions recorded.", auditActor: "Administrator", auditAction: "Action", auditTarget: "Target", auditDate: "Date", auditDetails: "Details", userAccess: "Account access", userActive: "Account is active.", userSuspendedUntil: "Suspended until", userSuspend: "Suspend account", userUnsuspend: "Reactivate account", userSuspended: "Account suspended.", userUnsuspended: "Account reactivated.", userRevokeSessions: "Revoke sessions", userSessionsRevoked: "Sessions revoked.", roleSuperAdmin: "Super administrator", roleAdmin: "Administrator", available: "Available", comingSoon: "Coming soon",
    },
    account: {
      label: "Account",
      title: "Account",
      anonymousDescription: "Create an account to save your preferences and manage your profile. Loculary remains usable without an account.",
      signIn: "Sign in", signUp: "Create an account", signOut: "Sign out",
      submitSignIn: "Sign in", submitSignUp: "Create my account",
      email: "Email address", password: "Password", displayName: "Display name", notSet: "Not set",
      confirmation: "Your account was created. Check your inbox to confirm your email address before signing in.",
      confirmationSent: "If a confirmation is available for this address, a new email has been sent.",
      resendConfirmation: "Resend confirmation email",
      alreadySignedIn: "You are already signed in.", noAccount: "Don’t have an account?", hasAccount: "Already have an account?",
      signInError: "We couldn’t sign you in with those details.", signUpError: "We couldn’t create the account right now.",
      authRateLimited: "Too many attempts. Wait a moment before trying again.", invalidEmail: "Enter a valid email address.",
      forgotPassword: "Forgot password?", forgotPasswordTitle: "Reset your password",
      forgotPasswordDescription: "Enter your email address. If an account exists for it, we’ll send a reset link.",
      forgotPasswordSent: "If an account exists for that address, a reset email has been sent. Check your spam folder too.",
      forgotPasswordError: "We couldn’t send the email right now. Please try again later.",
      resetPassword: "Set a new password", resetPasswordTitle: "Set a new password",
      resetPasswordDescription: "Choose a new password for your account.",
      passwordConfirmation: "Confirm password",
      passwordResetError: "We couldn’t reset your password. The link may be expired or invalid.",
      weakPassword: "Choose a stronger password or check your account security requirements.",
      changePassword: "Change password", changePasswordTitle: "Change password", currentPassword: "Current password",
      passwordChanged: "Password changed.", currentPasswordError: "The current password is incorrect.",
      profile: "Profile", saveProfile: "Save", profileUpdated: "Profile saved.", profileError: "We couldn’t save the changes.", passwordError: "We couldn’t change the password.", security: "Security", dangerZone: "Danger zone",
      preferredLanguage: "Language", french: "Français", english: "English",
      emailAddress: "Current email address", changeEmail: "Change email address", changeEmailTitle: "Change email address",
      changeEmailDescription: "Confirmation may be required for your current and new address.",
      emailChangeConfirmation: "Your request was saved. Confirm the change from the emails you received.",
      emailChangeUpdated: "Your email address has been confirmed and updated.", emailChangeError: "We couldn’t change your email address.",
      emailSame: "This is already the email address on your account.",
      deleteAccount: "Delete account", deleteAccountTitle: "Delete your account",
      deleteAccountDescription: "This action cannot be undone. Your account and associated personal data will be deleted.",
      deleteAccountConsequences: "Your profile and personal data will be deleted. Some administrative records may be retained in anonymized form when needed for security.",
      deleteAccountConfirmationLabel: "To confirm, type DELETE", deleteAccountConfirmationPlaceholder: "DELETE", deleteAccountButton: "Permanently delete account",
      deleteAccountError: "We couldn’t complete account deletion. Please try again later.", deleteAccountSessionError: "Your session is no longer valid. Sign in again and retry.",
      lastSuperAdmin: "This account is the last super administrator. Assign that role to another administrator before deleting this account.",
      accountDeleted: "Your account has been deleted. You are now signed out.",
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


