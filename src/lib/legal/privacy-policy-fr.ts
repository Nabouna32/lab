import type { PrivacyPolicyContent } from "./privacy-policy-content";

const fr: PrivacyPolicyContent = {
  metaTitle: "Politique de confidentialité | Loculary",
  metaDescription: "Données personnelles, comptes, stockage local, prestataires et droits des utilisateurs de Loculary.",
  title: "Politique de confidentialité",
  updatedLabel: "Dernière mise à jour",
  updatedAt: "22 octobre 2026",
  temporaryNoticeTitle: "Points de conformité encore à vérifier",
  temporaryNotice: "Les coordonnées de contact sont renseignées. Les durées de conservation de certains journaux, les paramètres de conservation des prestataires et les garanties contractuelles applicables aux transferts doivent encore être vérifiés et formalisés.",
  intro: "Loculary cherche à limiter la collecte de données et à privilégier le traitement dans votre navigateur. Cette politique décrit les traitements actuellement identifiés dans le code et la configuration examinés. Les pratiques peuvent évoluer ; consultez les informations propres à chaque outil avant de lui transmettre des données.",
  sections: [
    { title: "1. Responsable du traitement", paragraphs: [
      "Le responsable du traitement est l’éditeur de Loculary, qui exploite le service à titre non professionnel. Pour préserver son anonymat public, son identité civile n’est pas affichée ici, sous réserve des conditions du régime applicable aux éditeurs non professionnels.",
      "Cette présentation ne dispense pas le responsable du traitement de ses obligations au titre du RGPD. La manière de fournir les informations d’identification requises doit encore être confirmée dans le cadre d’une revue juridique."
    ]},
    { title: "2. Données et finalités", paragraphs: ["Les données dépendent des fonctionnalités utilisées."], bullets: [
      "Compte et authentification : adresse e-mail, identifiants techniques et données d’authentification gérés par Supabase Auth pour créer, sécuriser et administrer le compte.",
      "Profil : nom d’affichage et langue préférée, si renseignés, pour personnaliser l’interface.",
      "Favoris et collections synchronisés : identifiants des outils enregistrés, noms de collections et outils qu’elles contiennent.",
      "Collections partagées : si le propriétaire active volontairement le partage, le lien donne accès au nom de la collection et à la liste des outils. Les collections sont privées par défaut et le lien peut être désactivé.",
      "Données techniques et de sécurité : informations de requête, journaux techniques et événements d’administration pour le diagnostic, la disponibilité et la sécurité.",
      "Stockage du navigateur : certaines préférences, outils récemment utilisés, favoris ou collections anonymes peuvent rester enregistrés sur votre appareil."
    ]},
    { title: "3. Entrées et fichiers des outils", paragraphs: [
      "Le catalogue actuel classe les outils publiés comme traitant les données localement dans le navigateur. Les entrées, fichiers et résultats ne sont pas envoyés à Loculary ni enregistrés dans votre compte par défaut. Le contenu que vous copiez, téléchargez ou partagez ensuite relève de l’action que vous choisissez.",
      "Cela ne signifie pas que le site ne traite aucune autre donnée : une session de compte, les favoris et les données techniques sont distincts des entrées des outils. Si un outil ou une fonctionnalité évolue vers un traitement externe ou serveur, ses informations et cette politique devront être mises à jour."
    ]},
    { title: "4. Bases juridiques", paragraphs: ["Selon la fonctionnalité, les bases identifiées sont :"], bullets: [
      "Exécution du service demandé : création et gestion du compte, authentification et synchronisation des favoris et collections.",
      "Intérêt légitime : sécurité, prévention des abus, diagnostic des incidents et conservation de traces d’administration nécessaires à la sécurité.",
      "Obligation légale : conservation ou communication lorsque la loi applicable l’impose.",
      "Stockage local : mémorisation des préférences et sélections nécessaires à la fonctionnalité demandée. Tout traceur futur soumis au consentement devra respecter les règles applicables."
    ]},
    { title: "5. Prestataires et transferts", paragraphs: [
      "Vercel assure l’hébergement et le déploiement ; Supabase fournit l’authentification et la base de données. Ces prestataires et leurs sous-traitants peuvent traiter les données nécessaires à leurs services. Une communication peut aussi intervenir si la loi l’exige.",
      "Le projet Supabase est configuré à Londres, au Royaume-Uni, pour la base de données principale et l’authentification. Cette région ne garantit pas que tous les traitements des prestataires restent dans cette zone. Vercel peut traiter des données aux États-Unis et ailleurs selon ses opérations."
    ], links: [
      { label: "Politique de confidentialité de Vercel", href: "https://vercel.com/legal/privacy-notice" },
      { label: "Documentation Supabase sur la localisation et les transferts", href: "https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq" },
      { label: "Politique de confidentialité de Supabase", href: "https://supabase.com/privacy" }
    ]},
    { title: "6. Garanties des transferts internationaux", paragraphs: [
      "Certains traitements peuvent avoir lieu hors de l’Espace économique européen, notamment aux États-Unis ou au Royaume-Uni. Les mécanismes et garanties dépendent du service, de sa configuration et des accords en vigueur avec chaque prestataire.",
      "Les accords contractuels exacts et les garanties applicables au compte Loculary doivent encore être vérifiés. La localisation de la base de données ne suffit pas à conclure que tous les flux sont couverts."
    ]},
    { title: "7. Conservation et suppression", paragraphs: [
      "Les données sont conservées aussi longtemps que nécessaire à la fonctionnalité concernée, sous réserve des obligations légales et des besoins de sécurité. La durée exacte de certains journaux n’est pas encore documentée ; aucune durée chiffrée n’est inventée ici."
    ], bullets: [
      "Compte et profil : jusqu’à la suppression du compte, sous réserve des données à conserver ou neutraliser pour des raisons légales ou de sécurité.",
      "Favoris et collections liés au compte : jusqu’à leur suppression ou à celle du compte. Le partage prend fin lorsque le lien est désactivé ou la collection supprimée.",
      "Données du navigateur : jusqu’à leur suppression par l’utilisateur ou à l’effacement du stockage du navigateur.",
      "Journal d’audit administratif : certains événements peuvent rester après la suppression d’un compte ; les références directes au compte sont neutralisées. La durée maximale reste à formaliser.",
      "Journaux d’infrastructure : leur durée dépend des réglages et politiques des prestataires, à confirmer pour la configuration déployée."
    ]},
    { title: "8. Cookies et stockage", paragraphs: [
      "L’authentification peut utiliser des cookies ou mécanismes de session nécessaires au compte. Le navigateur peut également conserver des préférences, favoris, collections anonymes ou outils récemment utilisés.",
      "L’audit du code source réalisé pour cette version n’a identifié ni intégration publicitaire ni outil d’analyse d’audience. Un contrôle distinct en production reste nécessaire pour établir l’inventaire complet des cookies, traceurs et scripts tiers, leurs durées et leurs déclencheurs."
    ]},
    { title: "9. Vos droits", paragraphs: [
      "Selon les conditions du RGPD, vous pouvez demander l’accès à vos données, leur rectification ou effacement, la limitation de certains traitements, vous opposer aux traitements fondés sur l’intérêt légitime et demander la portabilité des données éligibles. Vous pouvez retirer un consentement lorsqu’il constitue la base du traitement ; cela n’affecte pas le traitement antérieur.",
      "Des informations raisonnables peuvent être demandées pour vérifier votre identité. Vous pouvez également déposer une réclamation auprès de la CNIL."
    ], links: [
      { label: "CNIL — droits des personnes", href: "https://www.cnil.fr/fr/les-droits-pour-maitriser-vos-donnees-personnelles" },
      { label: "CNIL — déposer une plainte", href: "https://www.cnil.fr/fr/plaintes" }
    ]},
    { title: "10. Sécurité et mises à jour", paragraphs: [
      "Loculary applique des mesures techniques et organisationnelles adaptées au service, notamment des contrôles d’accès aux données de compte et des règles de sécurité de la base de données. Aucun système connecté ne peut garantir une sécurité absolue.",
      "Cette politique sera mise à jour si les fonctionnalités, prestataires, configurations, durées de conservation ou coordonnées changent."
    ]}
  ],
  contactTitle: "Contact pour les données personnelles",
  contactIntro: "Le canal prévu pour les questions et demandes relatives aux données personnelles est :",
  contactAddress: "nabouna47@gmx.fr",
  contactWarning: "Vous pouvez utiliser cette adresse pour toute question ou demande relative à vos données personnelles."
};

export default fr;
