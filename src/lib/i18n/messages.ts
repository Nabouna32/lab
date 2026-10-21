import type { Locale } from "./config.ts";
import type { IntentId } from "@/lib/tools/intents";
import type { ToolId } from "@/lib/tools/types";

export type Messages = {
  nav: { home: string; tools: string; explore: string; exploreDescription: string; favorites: string; favoritesDescription: string; collections: string; collectionsDescription: string; language: string; account: string; space: string; menu: string };
  breadcrumbs: { label: string };
  footer: { tagline: string; explore: string; account: string };
  actions: { copy: string; copied: string; clear: string; shareTool: string; shareLinkCopied: string; shareLinkError: string };
  home: { metaTitle: string; badge: string; title: string; description: string; searchPlaceholder: string; quickLinksLabel: string; quickLinks: Array<{ label: string; toolId: ToolId }>; recentToolsTitle: string; recentToolsDescription: string; clearRecentTools: string; explore: string; };
  guidedWorkflows: {
    homeTitle: string; homeDescription: string; homeAction: string;
    eyebrow: string; title: string; description: string; privacy: string;
    steps: string; outcome: string; automatic: string; manual: string; independent: string; openTools: string;
    recipes: Array<{
      id: string; icon: "swap_horiz" | "apps" | "image"; title: string; summary: string; outcome: string;
      transfer: "automatic" | "manual" | "independent";
      steps: Array<{ toolId: ToolId; description: string }>;
    }>;
  };
  tools: {
    metaTitle: string;
    eyebrow: string; title: string; description: string; explore: string; one: string; many: string;
    categoryDescription: (category: string) => string; searchLabel: string; searchPlaceholder: string; suggestions: string;
    intentsTitle: string; intentsDescription: string; intents: Array<{ id: IntentId; label: string; icon: string }>;
    intentResultsTitle: (intent: string) => string; intentResultsDescription: string; clearIntent: string;
    allToolsTitle: string; searchSubmit: string; searchResultsTitle: (query: string) => string; searchResultsMetaTitle: string;
    resultCountOne: string; resultCountMany: string; searching: string; searchError: string; retrySearch: string; searchLandingTitle: string; searchLandingDescription: string; filterByCategory: string; allCategories: string; noResults: string; noResultsHelp: string; tryThese: string; noResultsSuggestions: string[]; clearSearch: string;
    categoriesTitle: string; categoriesDescription: string;
  };
  nextActions: { title: string };
  theme: { choose: string; system: string; light: string; dark: string; title: string };
  admin: { label: string; title: string; description: string; dashboard: string; access: string; account: string; roles: string; permissions: string; auditLog: string; noAuditEntries: string; noAccess: string; notConfigured: string; modules: string; users: string; usersDescription: string; usersTitle: string; usersBack: string; usersSearch: string; usersSearchPlaceholder: string; usersSearchSubmit: string; usersNoResults: string; usersLoadError: string; userEmail: string; userDisplayName: string; userCreated: string; userLastSignIn: string; userEmailConfirmed: string; userPending: string; userNeverSignedIn: string; userRoles: string; userAssignRole: string; userRemoveRole: string; userNoRoles: string; userUpdated: string; userActionError: string; audit: string; auditDescription: string; auditLoadError: string; auditTitle: string; auditBack: string; auditEmpty: string; auditActor: string; auditAction: string; auditTarget: string; auditDate: string; auditDetails: string; userAccess: string; userActive: string; userSuspendedUntil: string; userSuspend: string; userUnsuspend: string; userSuspended: string; userUnsuspended: string; userRevokeSessions: string; userSessionsRevoked: string; roleSuperAdmin: string; roleAdmin: string; },
  account: { label: string; title: string; anonymousDescription: string; signIn: string; signUp: string; signOut: string; submitSignIn: string; submitSignUp: string; email: string; password: string; displayName: string; notSet: string; confirmation: string; confirmationSent: string; resendConfirmation: string; alreadySignedIn: string; noAccount: string; hasAccount: string; signInError: string; signUpError: string; authRateLimited: string; invalidEmail: string; forgotPassword: string; forgotPasswordTitle: string; forgotPasswordDescription: string; forgotPasswordSent: string; forgotPasswordError: string; resetPassword: string; resetPasswordTitle: string; resetPasswordDescription: string; passwordConfirmation: string; passwordResetError: string; weakPassword: string; changePassword: string; changePasswordTitle: string; currentPassword: string; passwordChanged: string; currentPasswordError: string; profile: string; saveProfile: string; profileUpdated: string; profileError: string; passwordError: string; security: string; dangerZone: string; preferredLanguage: string; french: string; english: string; emailAddress: string; changeEmail: string; changeEmailTitle: string; changeEmailDescription: string; emailChangeConfirmation: string; emailChangeUpdated: string; emailChangeError: string; emailSame: string; deleteAccount: string; deleteAccountTitle: string; deleteAccountDescription: string; deleteAccountConsequences: string; deleteAccountConfirmationLabel: string; deleteAccountConfirmationPlaceholder: string; deleteAccountButton: string; deleteAccountError: string; deleteAccountSessionError: string; lastSuperAdmin: string; accountDeleted: string; };
  processing: {
    localDetail: string; ariaLabel: string; more: string; storage: string; retention: string; externalProviders: string; dataCategories: string;
    localLabel: string; localSummary: string; externalLabel: string; externalSummary: string; fallbackNotice: string;
    serverLabel: string; serverSummary: string; hybridLabel: string; hybridSummary: string;
  };
};

export const messages: Record<Locale, Messages> = {
  fr: {
    nav: { home: "Accueil", tools: "Outils", explore: "Explorer", exploreDescription: "Parcours tous les outils disponibles", favorites: "Favoris", favoritesDescription: "Tes outils enregistrés", collections: "Collections", collectionsDescription: "Organise tes outils en groupes", language: "Langue", account: "Gère ton profil et tes préférences", space: "Compte", menu: "Menu" },
    breadcrumbs: { label: "Fil d’Ariane" },
    footer: { tagline: "Des outils utiles, directement dans ton navigateur.", explore: "Tous les outils", account: "Compte" },
    actions: { copy: "Copier", copied: "Copié", clear: "Effacer", shareTool: "Partager l’outil", shareLinkCopied: "Lien copié", shareLinkError: "Impossible de partager ou de copier le lien." },
    home: {
      metaTitle: "Loculary — Outils en ligne gratuits",
      badge: "De l’idée à l’action",
      title: "Que veux-tu faire ?",
      description: "Calcule, convertis, crée ou analyse — trouve le bon outil, sans compte.",
      searchPlaceholder: "Que veux-tu faire ?",
      quickLinksLabel: "Accès directs aux outils",
      quickLinks: [
        { label: "Calculer une remise", toolId: "discount" },
        { label: "Convertir une vitesse", toolId: "download-speed" },
        { label: "Calculer mon âge", toolId: "age" },
        { label: "Convertir une taille de fichier", toolId: "file-size-converter" },
      ],
      recentToolsTitle: "Reprendre un outil",
      recentToolsDescription: "Récemment ouverts sur cet appareil.",
      clearRecentTools: "Effacer l’historique",
      explore: "Explorer tous les outils",
    },
    guidedWorkflows: {
      homeTitle: "Parcours guidés",
      homeDescription: "Une tâche, plusieurs étapes : enchaîne les bons outils sans les chercher un par un.",
      homeAction: "Voir les parcours",
      eyebrow: "Partir du résultat, pas du nom de l’outil",
      title: "Des parcours pour aller jusqu’au bout",
      description: "Certaines tâches demandent plusieurs étapes. Choisissez votre objectif : chaque parcours vous guide vers les bons outils, dans le bon ordre, sans compte.",
      privacy: "Les outils de ces parcours traitent les données localement dans votre navigateur.",
      steps: "étapes", outcome: "À la fin",
      automatic: "Le résultat passe automatiquement à l’étape suivante.",
      manual: "Copiez le résultat dans l’étape suivante lorsque c’est nécessaire.",
      independent: "Préparez les fichiers nécessaires à chaque outil : ces étapes restent indépendantes.",
      openTools: "Voir tous les outils",
      recipes: [
        {
          id: "clean-and-compare", icon: "swap_horiz", title: "Nettoyer puis comparer une liste",
          summary: "Supprimez les doublons et remettez vos lignes en ordre avant de repérer ce qui a changé entre deux versions.",
          outcome: "Une comparaison lisible des lignes ajoutées, supprimées ou inchangées.", transfer: "automatic",
          steps: [
            { toolId: "text-line-processor", description: "Nettoyez, triez ou dédupliquez votre liste." },
            { toolId: "text-diff-checker", description: "Le résultat nettoyé est transmis automatiquement. Ajoutez l’autre version pour voir les différences." },
          ],
        },
        {
          id: "prepare-json", icon: "apps", title: "Préparer et comparer du JSON",
          summary: "Rendez des données JSON lisibles, puis comparez deux versions pour comprendre les changements.",
          outcome: "Des données formatées et une vue des différences entre les deux versions.", transfer: "automatic",
          steps: [
            { toolId: "json-formatter", description: "Formatez le document puis envoyez ce JSON au comparateur." },
            { toolId: "json-diff-checker", description: "Le JSON transmis est prérempli comme nouvelle version. Ajoutez la version de référence puis comparez." },
          ],
        },
        {
          id: "convert-tabular-data", icon: "apps", title: "Convertir un tableau en JSON",
          summary: "Transformez des données CSV en JSON, puis rendez le résultat plus facile à relire et à vérifier.",
          outcome: "Un JSON formaté, prêt à être copié vers votre prochain outil ou projet.", transfer: "automatic",
          steps: [
            { toolId: "csv-json-converter", description: "Importez ou collez le CSV et choisissez la conversion CSV → JSON." },
            { toolId: "json-formatter", description: "Recevez le JSON converti, puis formatez-le et vérifiez sa validité." },
          ],
        },
        {
          id: "prepare-photo-document", icon: "image", title: "Préparer des photos pour un PDF",
          summary: "Vérifiez les informations utiles de vos images, puis rassemblez-les dans un document multipage.",
          outcome: "Un PDF multipage généré localement à partir de vos photos.", transfer: "independent",
          steps: [
            { toolId: "image-metadata", description: "Vérifiez les dimensions et les métadonnées avant de préparer le document." },
            { toolId: "image-to-pdf", description: "Ajoutez les photos, réordonnez les pages et exportez le PDF." },
          ],
        },
      ],
    },
        tools: {
      metaTitle: "Tous les outils — Loculary", eyebrow: "Loculary", title: "Tous les outils",
      description: "Tous les outils disponibles pour calculer, convertir, analyser et gagner du temps.",
      explore: "Explorer les outils", one: "outil", many: "outils",
      categoryDescription: (category) => `Retrouvez les outils disponibles dans la catégorie ${category}.`,
      searchLabel: "Rechercher dans les outils", searchPlaceholder: "Rechercher…", searchSubmit: "Lancer la recherche", searchResultsTitle: (query) => `Résultats pour « ${query} »`, searchResultsMetaTitle: "Résultats de recherche — Loculary",
      suggestions: "Suggestions", resultCountOne: "résultat", resultCountMany: "résultats", searching: "Recherche en cours…", searchError: "La recherche n’a pas pu se charger. Réessaie.", retrySearch: "Réessayer", searchLandingTitle: "Pour commencer", searchLandingDescription: "Lance une tâche fréquente tout de suite, ou saisis quelques mots pour trouver l’outil adapté.",
      filterByCategory: "Filtrer par catégorie", allCategories: "Toutes",
      noResults: "Aucun outil ne correspond à", noResultsHelp: "Essaie un terme plus simple ou choisis une suggestion.", tryThese: "Tu cherches peut-être", noResultsSuggestions: ["TVA", "taille de fichier", "vidéo", "âge"],
      clearSearch: "Effacer la recherche",
      categoriesTitle: "Parcourir par catégorie", categoriesDescription: "Tu préfères explorer ? Choisis une catégorie pour voir ses outils.",
      intentsTitle: "Commence par ta tâche", intentsDescription: "Tu sais quel résultat tu veux, mais pas quel outil utiliser ? Pars de l’action.",
      intents: [{ id: "calculate", label: "Calculer", icon: "∑" }, { id: "convert", label: "Convertir", icon: "↔" }, { id: "generate", label: "Générer", icon: "✦" }, { id: "analyze", label: "Analyser", icon: "⌁" }, { id: "measure", label: "Mesurer", icon: "◫" }, { id: "prepare", label: "Préparer", icon: "✧" }, { id: "compare", label: "Comparer", icon: "⇄" }],
      intentResultsTitle: (intent) => `Outils pour : ${intent}`, intentResultsDescription: "Une sélection d’outils adaptés à cette tâche, dans plusieurs catégories si nécessaire.", clearIntent: "Voir tous les outils",
      allToolsTitle: "Explorer tous les outils",
    },
    nextActions: { title: "Pour continuer" },
    theme: { choose: "Choisir le thème", system: "Système", light: "Clair", dark: "Sombre", title: "Thème" },
    admin: {
      label: "Administration", title: "Administration Loculary", description: "Gérez le site depuis un espace séparé du reste de Loculary.", dashboard: "Tableau de bord", access: "Accès", account: "Compte", roles: "Rôles", permissions: "Permissions", auditLog: "Journal des actions", noAuditEntries: "Aucune action administrative enregistrée.", noAccess: "Vous n’avez pas accès à cette administration.", notConfigured: "Aucun compte administrateur n’est encore configuré. Après la création de votre compte, le premier accès doit être attribué explicitement.", modules: "Modules", users: "Utilisateurs", usersDescription: "Comptes, accès et rôles.", usersTitle: "Gestion des utilisateurs", usersBack: "← Tableau de bord", usersSearch: "Rechercher un utilisateur", usersSearchPlaceholder: "E-mail ou nom d’affichage", usersSearchSubmit: "Rechercher", usersNoResults: "Aucun utilisateur trouvé.", usersLoadError: "Impossible de charger les utilisateurs pour le moment.", userEmail: "E-mail", userDisplayName: "Nom d’affichage", userCreated: "Créé le", userLastSignIn: "Dernière connexion", userEmailConfirmed: "E-mail confirmé", userPending: "E-mail non confirmé", userNeverSignedIn: "Jamais connecté", userRoles: "Rôles", userAssignRole: "Attribuer un rôle", userRemoveRole: "Retirer", userNoRoles: "Aucun rôle administrateur", userUpdated: "Modification enregistrée.", userActionError: "La modification n’a pas pu être enregistrée.", audit: "Journal des actions", auditDescription: "Voir les actions administratives importantes.", auditLoadError: "Impossible de charger le journal des actions pour le moment.", auditTitle: "Journal des actions", auditBack: "← Tableau de bord", auditEmpty: "Aucune action administrative enregistrée.", auditActor: "Administrateur", auditAction: "Action", auditTarget: "Cible", auditDate: "Date", auditDetails: "Détails", userAccess: "Accès au compte", userActive: "Compte actif.", userSuspendedUntil: "Suspendu jusqu’au", userSuspend: "Suspendre le compte", userUnsuspend: "Réactiver le compte", userSuspended: "Compte suspendu.", userUnsuspended: "Compte réactivé.", userRevokeSessions: "Révoquer les sessions", userSessionsRevoked: "Sessions révoquées.", roleSuperAdmin: "Super administrateur", roleAdmin: "Administrateur",
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
      localDetail: "Les données saisies et les résultats sont traités dans votre navigateur. Cet outil ne les envoie pas à un serveur et ne les enregistre pas dans votre compte ou dans un historique.", ariaLabel: "Informations sur le traitement des données", more: "Informations sur le traitement",
      storage: "Stockage", retention: "Conservation", externalProviders: "Service(s) externe(s)", dataCategories: "Données concernées",
      localLabel: "Traitement local", localSummary: "Vos données restent sur votre appareil.", fallbackNotice: "Cette partie est actuellement disponible en anglais.",
      externalLabel: "Service externe", externalSummary: "Certaines données sont transmises à un service externe.",
      serverLabel: "Serveur", serverSummary: "Ce traitement nécessite un service serveur.",
      hybridLabel: "Traitement hybride", hybridSummary: "Le traitement local est complété par un service externe.",
    },
  },
  en: {
    nav: { home: "Home", tools: "Tools", explore: "Explore", exploreDescription: "Browse all available tools", favorites: "Favorites", favoritesDescription: "Your saved tools", collections: "Collections", collectionsDescription: "Organize your tools into groups", language: "Language", account: "Manage your profile and preferences", space: "Account", menu: "Menu" },
    breadcrumbs: { label: "Breadcrumb" },
    footer: { tagline: "Useful tools, ready to use in your browser.", explore: "All tools", account: "Account" },
    actions: { copy: "Copy", copied: "Copied", clear: "Clear", shareTool: "Share tool", shareLinkCopied: "Link copied", shareLinkError: "Could not share or copy the link." },
    home: {
      metaTitle: "Loculary — Free online tools",
      badge: "From idea to done",
      title: "What do you want to do?",
      description: "Calculate, convert, create or analyze — find the right tool, no account needed.",
      searchPlaceholder: "Need a tool?",
      quickLinksLabel: "Jump straight into a tool",
      quickLinks: [
        { label: "Calculate a discount", toolId: "discount" },
        { label: "Convert a speed", toolId: "download-speed" },
        { label: "Calculate my age", toolId: "age" },
        { label: "Convert a file size", toolId: "file-size-converter" },
      ],
      recentToolsTitle: "Pick up where you left off",
      recentToolsDescription: "Recently opened on this device.",
      clearRecentTools: "Clear history",
      explore: "Explore all tools",
    },
guidedWorkflows: {
      homeTitle: "Guided workflows",
      homeDescription: "One task, several steps: connect the right tools without searching for each one separately.",
      homeAction: "Explore paths",
      eyebrow: "Start with the outcome, not the tool name",
      title: "Guided paths from start to finish",
      description: "Some tasks take more than one step. Choose your goal: each path guides you to the right tools in the right order, without an account.",
      privacy: "Tools in these paths process data locally in your browser.",
      steps: "steps", outcome: "What you get",
      automatic: "The result is passed automatically to the next step.",
      manual: "Copy the result into the next step when needed.",
      independent: "Prepare the required files for each tool; these steps remain independent.",
      openTools: "Browse all tools",
      recipes: [
        {
          id: "clean-and-compare", icon: "swap_horiz", title: "Clean a list, then compare it",
          summary: "Remove duplicates and sort your lines before spotting what changed between two versions.",
          outcome: "A readable comparison of added, removed, and unchanged lines.", transfer: "automatic",
          steps: [
            { toolId: "text-line-processor", description: "Clean, sort, or deduplicate your list." },
            { toolId: "text-diff-checker", description: "The cleaned result is transferred automatically. Add the other version to see the differences." },
          ],
        },
        {
          id: "prepare-json", icon: "apps", title: "Prepare and compare JSON",
          summary: "Make JSON data readable, then compare two versions to understand the changes.",
          outcome: "Formatted data and a view of the differences between both versions.", transfer: "automatic",
          steps: [
            { toolId: "json-formatter", description: "Format the document, then send this JSON to the comparator." },
            { toolId: "json-diff-checker", description: "The transferred JSON is prefilled as the new version. Add the reference version, then compare." },
          ],
        },
        {
          id: "convert-tabular-data", icon: "apps", title: "Convert a table to JSON",
          summary: "Turn CSV data into JSON, then make the result easier to read and verify.",
          outcome: "Formatted JSON, ready to copy into your next tool or project.", transfer: "automatic",
          steps: [
            { toolId: "csv-json-converter", description: "Import or paste the CSV and choose CSV → JSON." },
            { toolId: "json-formatter", description: "Receive the converted JSON, then format it and check its validity." },
          ],
        },
        {
          id: "prepare-photo-document", icon: "image", title: "Prepare photos for a PDF",
          summary: "Check useful image details, then combine them into a multi-page document.",
          outcome: "A multi-page PDF generated locally from your photos.", transfer: "independent",
          steps: [
            { toolId: "image-metadata", description: "Check dimensions and metadata before preparing the document." },
            { toolId: "image-to-pdf", description: "Add photos, reorder pages, and export the PDF." },
          ],
        },
      ],
    },
    tools: {
      metaTitle: "All tools — Loculary", eyebrow: "Loculary", title: "All tools",
      description: "Tools to calculate, convert, analyze, and save time on everyday tasks.",
      explore: "Explore tools", one: "tool", many: "tools",
      categoryDescription: (category) => `Browse the tools available in the ${category}.`,
      searchLabel: "Search the tools", searchPlaceholder: "Search…", searchSubmit: "Search tools", searchResultsTitle: (query) => `Results for “${query}”`, searchResultsMetaTitle: "Search results — Loculary",
      suggestions: "Suggestions", resultCountOne: "result", resultCountMany: "results", searching: "Searching…", searchError: "Search could not be loaded. Please try again.", retrySearch: "Try again", searchLandingTitle: "Start with a popular task", searchLandingDescription: "Jump straight into a common task, or enter a few words to find the right tool.",
      filterByCategory: "Filter by category", allCategories: "All",
      noResults: "No tool matches", noResultsHelp: "Try a simpler term or choose a suggestion.", tryThese: "You might be looking for", noResultsSuggestions: ["VAT", "file size", "video", "age"],
      clearSearch: "Clear search",
      categoriesTitle: "Browse by category", categoriesDescription: "Prefer to explore? Choose a category to see its tools.",
      intentsTitle: "Start with your task", intentsDescription: "If you know the outcome you need but not the tool name, start with the action.",
      intents: [{ id: "calculate", label: "Calculate", icon: "∑" }, { id: "convert", label: "Convert", icon: "↔" }, { id: "generate", label: "Generate", icon: "✦" }, { id: "analyze", label: "Analyze", icon: "⌁" }, { id: "measure", label: "Measure", icon: "◫" }, { id: "prepare", label: "Prepare", icon: "✧" }, { id: "compare", label: "Compare", icon: "⇄" }],
      intentResultsTitle: (intent) => `Tools for: ${intent}`, intentResultsDescription: "A curated set of tools for this task, spanning categories when useful.", clearIntent: "Show all tools",
      allToolsTitle: "Explore all tools",
    },
    nextActions: { title: "Keep going" },
    theme: { choose: "Choose theme", system: "System", light: "Light", dark: "Dark", title: "Theme" },
    admin: {
      label: "Administration", title: "Loculary administration", description: "Manage the site from a workspace separate from the public Loculary experience.", dashboard: "Dashboard", access: "Access", account: "Account", roles: "Roles", permissions: "Permissions", auditLog: "Audit log", noAuditEntries: "No administrative actions recorded.", noAccess: "You do not have access to this administration.", notConfigured: "No administrator account has been configured yet. After creating your account, the first access must be assigned explicitly.", modules: "Modules", users: "Users", usersDescription: "Accounts, access and roles.", usersTitle: "User management", usersBack: "← Dashboard", usersSearch: "Search for a user", usersSearchPlaceholder: "Email or display name", usersSearchSubmit: "Search", usersNoResults: "No user found.", usersLoadError: "Users could not be loaded right now.", userEmail: "Email", userDisplayName: "Display name", userCreated: "Created", userLastSignIn: "Last sign-in", userEmailConfirmed: "Email confirmed", userPending: "Email not confirmed", userNeverSignedIn: "Never signed in", userRoles: "Roles", userAssignRole: "Assign role", userRemoveRole: "Remove", userNoRoles: "No administrator role", userUpdated: "Change saved.", userActionError: "The change could not be saved.", audit: "Audit log", auditDescription: "Review important administrative actions.", auditLoadError: "The audit log could not be loaded right now.", auditTitle: "Audit log", auditBack: "← Dashboard", auditEmpty: "No administrative actions recorded.", auditActor: "Administrator", auditAction: "Action", auditTarget: "Target", auditDate: "Date", auditDetails: "Details", userAccess: "Account access", userActive: "Account is active.", userSuspendedUntil: "Suspended until", userSuspend: "Suspend account", userUnsuspend: "Reactivate account", userSuspended: "Account suspended.", userUnsuspended: "Account reactivated.", userRevokeSessions: "Revoke sessions", userSessionsRevoked: "Sessions revoked.", roleSuperAdmin: "Super administrator", roleAdmin: "Administrator",
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
      localDetail: "The data you enter and the results are processed in your browser. This tool does not send them to a server or save them to your account or history.", ariaLabel: "Data processing information", more: "Processing information",
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


