# Loculary — Principes de confidentialité et de traitement

## Objectif

Le modèle de confidentialité de Loculary repose sur un principe simple :

> **La transparence fait partie de la confiance.**

Les utilisateurs ne doivent pas avoir à deviner ce que Loculary fait de leurs données. Le produit doit rendre les flux de données compréhensibles, vérifiables et contrôlables.

La position technique par défaut est la suivante :

> **Lorsqu'un outil peut traiter les données localement, elles doivent rester locales.**

Ce document définit une orientation produit et technique ; il ne constitue pas une notice juridique de confidentialité. Avant le lancement public, la documentation destinée aux utilisateurs doit être vérifiée au regard des flux réellement implémentés et du droit applicable.

## Classifications des traitements

Chaque outil doit déclarer sa classification de traitement.

### Local

Tous les traitements concernés sont effectués sur l'appareil de l'utilisateur.

Message destiné à l'utilisateur :

> 🔒 **Vos fichiers restent sur votre appareil.**

Lorsque cela est utile, l'interface doit préciser que le traitement est local et indiquer si l'outil utilise les API du navigateur, des Web Workers, WebAssembly ou une autre technologie côté client.

### Externe

Le navigateur transmet certaines données sélectionnées à un fournisseur externe.

L'outil doit expliquer :

- le fournisseur ;
- la destination ou le domaine ;
- les données transmises ;
- la finalité ;
- les informations de stockage et de conservation lorsqu'elles sont connues ;
- la dépendance à ce service ;
- la référence à sa politique de confidentialité ;
- le comportement en cas d'échec ou de solution de repli.

### Serveur Loculary

L'opération nécessite l'infrastructure de Loculary.

Les mêmes exigences de transparence s'appliquent, notamment :

- les données envoyées ;
- la raison de leur transmission ;
- leur lieu de stockage ;
- la durée de conservation ;
- les personnes ou systèmes qui peuvent y accéder ;
- les modalités de suppression ;
- les mesures de sécurité pertinentes.

### Hybride

Une partie de l'opération est réalisée localement et une autre par un service distant.

La frontière entre les deux traitements doit être explicite. L'interface ne doit pas présenter une opération hybride comme étant simplement « locale ».

## Déclaration obligatoire du traitement

La classification du traitement fait partie du contrat des outils ; ce n'est pas une simple métadonnée marketing facultative.

Une définition d'outil doit pouvoir déclarer au minimum :

- le lieu du traitement ;
- les catégories de données transmises ;
- les fournisseurs externes ;
- le comportement de stockage ;
- la conservation ;
- les permissions navigateur nécessaires ;
- les capacités utilisées ;
- le comportement de repli ;
- les opérations sensibles du point de vue de la confidentialité.

Ces métadonnées doivent pouvoir être utilisées par l'interface, la recherche et les filtres, la documentation, les audits et les contrôles automatisés.

## Détails sur la confidentialité

L'indicateur de statut succinct doit mener à une infobulle, une explication dépliable ou une vue dédiée au traitement et à la confidentialité.

Cette vue détaillée doit répondre en langage clair aux questions suivantes :

1. Où le traitement est-il effectué ?
2. Quelles données quittent l'appareil ?
3. Où sont-elles envoyées ?
4. Pourquoi leur transmission est-elle nécessaire ?
5. Sont-elles stockées ?
6. Pendant combien de temps, le cas échéant ?
7. Quels tiers interviennent ?
8. Quelles permissions du navigateur sont demandées ?
9. Que se passe-t-il si le service externe est indisponible ?
10. L'utilisateur peut-il utiliser l'outil sans fournir les données facultatives ?

Les détails techniques peuvent être accessibles aux personnes qui souhaitent approfondir.

## Minimisation des données

Un outil ne doit pas demander un champ de données dont il n'a pas besoin.

Les saisies doivent se limiter aux informations strictement nécessaires à l'opération.

Toute donnée fournie par le client doit être considérée comme non fiable. La validation et l'autorisation côté serveur restent obligatoires, même lorsque l'interface cliente valide déjà la même saisie.

## Permissions du navigateur

Les outils doivent déclarer explicitement les capacités du navigateur nécessaires, par exemple :

- accès aux fichiers ;
- presse-papiers ;
- caméra ;
- microphone ;
- géolocalisation ;
- notifications.

Les permissions doivent être demandées uniquement lorsqu'elles sont nécessaires et, autant que possible, au moment de l'action utilisateur qui les requiert.

Un outil ne doit pas demander des permissions étendues par simple commodité.

## Portée des déclarations de traitement local

Le message relatif au traitement local décrit les **saisies et les résultats de l'outil utilisé**, et non l'ensemble des états du produit que Loculary peut conserver. Certaines fonctionnalités distinctes peuvent stocker dans le navigateur des identifiants d'outils non sensibles ou des favoris ; les fonctionnalités de compte peuvent synchroniser des favoris ou des collections. La déclaration ne doit donc pas laisser entendre que Loculary ne stocke absolument aucune donnée. Elle doit préciser si cet outil envoie ses saisies ou ses résultats à un serveur, ou les enregistre dans un compte ou un historique. Les actions explicites de l'utilisateur, comme copier ou télécharger un résultat, restent sous son contrôle.

## Traitement local des fichiers

Pour les outils qui manipulent des fichiers localement, le produit doit communiquer clairement cette limite de traitement.

Message recommandé :

> 🔒 **Vos fichiers restent sur votre appareil.**

Cette affirmation doit être techniquement justifiée. Les outils exclusivement locaux doivent pouvoir être audités par revue de code et, lorsque cela est pertinent, par des contrôles statiques et automatisés.

Un outil ne peut pas être classé comme exclusivement local s'il est susceptible de transmettre à un service distant le contenu d'un fichier fourni par l'utilisateur, ses métadonnées ou des données sensibles dérivées.

## Domaines de données du compte

Les données utilisateur doivent être séparées logiquement en domaines :

- identité et authentification ;
- préférences, notamment le thème clair/sombre ;
- données produit telles que les favoris et les collections ;
- enregistrements de sécurité.

Cette séparation doit faciliter les contrôles d'accès au moindre privilège, les règles de conservation, la suppression, l'export et l'audit.

## Contrôles de confidentialité du compte

Les contrôles relatifs à la confidentialité, au consentement, à l'identité et aux préférences doivent rester compréhensibles et accessibles depuis les paramètres de compte existants. L'expérience du compte doit rester simple ; ne pas introduire un tableau de bord dédié aux données personnelles sans besoin futur concret qui le justifie.

## Suppression du compte

La suppression d'un compte doit viser l'effacement complet des données qui lui sont associées.

Le parcours de suppression doit indiquer ce qui sera supprimé, ce qui pourrait devoir être anonymisé pour des raisons techniques ou juridiques et quelles conséquences sont irréversibles.

Lorsqu'il est réellement impossible ou inapproprié de supprimer un enregistrement précis, le système doit l'anonymiser aussi fortement que possible et documenter la raison.

La suppression doit couvrir les domaines pertinents, notamment :

- les données d'identité et de compte ;
- les préférences ;
- les favoris ;
- les collections.

L'implémentation doit éviter les données personnelles orphelines.

### Comportement de suppression du compte implémenté

L'implémentation actuelle du compte supprime définitivement l'utilisateur Supabase Auth au lieu d'utiliser une suppression logique. La ligne `public.profiles` et les associations de rôles administratifs référencent `auth.users` avec une suppression en cascade. Les enregistrements du journal d'audit administratif sont des données de sécurité et ne sont pas supprimés avec le compte : un trigger `BEFORE DELETE ON auth.users` efface dans la même transaction les références polymorphes aux utilisateurs ciblés, tandis que la clé étrangère `actor_user_id` remplace les références à l'acteur par `NULL`. L'événement lui-même est conservé afin que l'historique d'audit reste exploitable. Si la suppression est refusée, le nettoyage du journal d'audit est annulé avec elle. Cette conservation est limitée à l'enregistrement d'audit et à ses métadonnées non identifiantes ; elle ne constitue pas une règle générale de conservation pour de futures données appartenant aux utilisateurs.

## Export des données

Les exports de données personnelles associées à un compte doivent utiliser un format structuré et documenté, inclure les domaines pertinents appartenant à l'utilisateur, expliquer les exclusions ou transformations et exiger une authentification et une autorisation adaptées.

La sauvegarde des collections locales est un téléchargement distinct, déclenché par l'utilisateur depuis le navigateur. Elle ne contient que les noms des collections locales à l'appareil, leurs dates de création et les identifiants des outils ; les collections synchronisées et les saisies ou résultats des outils en sont exclus. L'import est validé et additif, reste dans le navigateur et ne transmet pas le fichier à un service. L'utilisateur contrôle l'emplacement où la sauvegarde téléchargée est conservée.

## Chiffrement et secrets

La protection doit être proportionnée à la sensibilité des données.

L'architecture doit utiliser :

- le chiffrement des communications réseau en transit ;
- le chiffrement au repos fourni par la plateforme ou le prestataire lorsqu'il est disponible ;
- une gestion robuste des mots de passe par des fournisseurs et bibliothèques d'authentification établis, plutôt qu'une cryptographie développée sur mesure ;
- le chiffrement ou la tokenisation des données applicatives particulièrement sensibles lorsque cela est justifié ;
- une gestion stricte des secrets, identifiants et clés API.

La cryptographie doit reposer sur des primitives et bibliothèques établies et maintenues. Loculary ne doit pas inventer son propre mécanisme de chiffrement.

### Limite actuelle — protection contre les mots de passe divulgués (30 octobre 2026)

Le Security Advisor du projet Supabase Loculary signale actuellement le contrôle `auth_leaked_password_protection` au niveau `WARN` : la protection contre les mots de passe divulgués est désactivée.

Supabase réserve cette fonctionnalité (vérification via l'API Pwned Passwords de Have I Been Pwned) au plan Pro et aux offres supérieures. Cette alerte correspond donc à une limite de l'offre Free ; elle ne signale ni un stockage des mots de passe en clair ni une compromission. Supabase Auth stocke les mots de passe sous forme d'empreintes bcrypt. Voir la [documentation officielle sur la sécurité des mots de passe](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

Décision produit et suivi :

- conserver le plan Free ; ne pas déclencher de changement d'offre uniquement pour faire disparaître cet avertissement ;
- ne pas présenter le diagnostic comme corrigé ni la protection comme active ;
- conserver et vérifier séparément les autres protections Auth disponibles dans l'offre actuelle ;
- réévaluer cette limitation uniquement si l'offre change ou si Supabase propose une solution de remplacement compatible avec Free.

État indiqué lors de la vérification du 30 octobre 2026 : avertissement toujours renvoyé par Security Advisor ; aucun réglage Auth ni paramètre de facturation modifié pendant cette vérification.

## Cookies et consentement

Les contrôles de consentement doivent être compréhensibles et granulaires, sans devenir volontairement contraignants.

Les utilisateurs doivent disposer de choix simples, par exemple :

- **Tout accepter**
- **Refuser les cookies et traceurs non nécessaires**
- **Personnaliser**

Le refus doit être aussi simple que l'acceptation.

Le produit ne doit pas obliger les utilisateurs à parcourir des dizaines de réglages partenaire par partenaire pour refuser le suivi non essentiel.

Les catégories de consentement doivent refléter les technologies et flux de données réellement utilisés, ainsi que les juridictions applicables. Ne pas déclarer à l'avance des catégories propres à un fournisseur avant que la technologie correspondante ait été choisie.

### Outils récents

La liste des outils récents est conservée uniquement dans la mémoire React de l'onglet courant afin de survivre à la navigation côté client sans constituer un historique de navigation persistant. Les identifiants des outils ne sont écrits ni dans `localStorage` ni dans `sessionStorage`, et ne sont pas envoyés à un serveur. L'état est réinitialisé lors d'un rechargement complet de la page ou à la fermeture de l'onglet. L'ancienne clé persistante est supprimée une fois au chargement de la version mise à jour de l'application. Ne pas réintroduire le suivi automatique et persistant des outils récents sans une revue de confidentialité distincte et, si nécessaire, un consentement préalable.

## Catalogue des API externes

Chaque intégration externe doit disposer d'une entrée traçable contenant :

- le fournisseur ;
- le domaine ou endpoint ;
- la finalité ;
- les données transmises ;
- le modèle d'authentification ;
- la référence à la politique de confidentialité ;
- le comportement de conservation lorsqu'il est connu ;
- le coût et les quotas ;
- le comportement de repli ;
- le responsable ou mainteneur ;
- l'emplacement de l'implémentation.

Ce catalogue est un mécanisme opérationnel de confiance et de maîtrise des coûts.

## Secrets API

Les secrets API ne doivent jamais apparaître dans :

- les bundles frontend ;
- les variables d'environnement côté client destinées à être publiques ;
- l'historique Git ;
- la documentation ;
- les métadonnées des outils.

Lorsqu'un fournisseur exige un secret, le backend doit jouer le rôle de proxy contrôlé ou de couche d'orchestration lorsque cela est approprié.

Les API utilisables côté client doivent être considérées comme publiques, sauf si le fournisseur documente explicitement un modèle public sûr.

## Limitation de débit et protection contre les abus

Une limitation de débit doit être appliquée lorsqu'une opération peut entraîner un coût significatif, des abus, de l'énumération, du spam ou un risque de déni de service.

La limite doit être proportionnée à l'opération, plutôt que restrictive de manière globale.

Exemples :

- appels à des API externes ;
- endpoints d'authentification ;
- récupération de compte ;
- opérations coûteuses côté serveur.

## Isolation des capacités des outils

Les outils doivent déclarer explicitement les capacités dont ils ont besoin, par exemple :

- `local-processing` ;
- `file-input` ;
- `clipboard` ;
- `camera` ;
- `microphone` ;
- `geolocation` ;
- `network/external-api` ;
- `account-data` ;
- accès à la base de données.

Un outil ne doit recevoir que les capacités dont il a réellement besoin.

Le code d'un outil ne doit pas obtenir un accès arbitraire :

- aux données d'autres utilisateurs ;
- aux secrets de compte ;
- aux identifiants du serveur ;
- à l'état d'outils sans rapport ;
- aux API administratives internes.

## Philosophie de confiance

Loculary doit gagner la confiance grâce à trois éléments :

1. **Confidentialité** — collecter et transmettre aussi peu de données que raisonnablement possible.
2. **Transparence** — expliquer clairement ce qui se passe lorsque des données sont transférées.
3. **Utilité** — préserver les choix respectueux de la vie privée sans rendre le produit inutilement difficile à utiliser.

Le produit ne doit jamais demander aux utilisateurs de faire confiance aveuglément lorsque le système peut expliquer ou exposer les informations pertinentes.

## Conservation des journaux et limites des prestataires

L'inventaire des prestataires distingue les journaux applicatifs des journaux gérés par les hébergeurs :

- **Supabase Free** : les logs de plateforme, d'API et de base de données sont conservés 24 heures ; Auth Audit Logs est limité à une heure.
- **Vercel Hobby** : les logs runtime sont conservés une heure ; les logs de build restent associés aux déploiements sans purge automatique.
- Ces journaux fournisseurs ne sont pas purgés par Loculary. Aucun Log Drain, export tiers ou archivage externe de ces journaux n'est activé.

**Politique applicative indiquée comme active en production depuis le 30 octobre 2026 :** douze mois glissants pour le journal administratif Loculary et les exécutions terminées de `pg_cron`, avec purge automatique quotidienne à 03:00 UTC. Les exécutions cron incomplètes restent préservées. Aucun mécanisme d'exception de conservation ni archive des journaux applicatifs n'est conservé. Aucune sauvegarde Google Drive ou archive externe de ces journaux n'est créée.

La migration `20261030160000_extend_log_retention_to_12_months.sql` est indiquée comme enregistrée en production. Le job `loculary-log-retention-12m` est indiqué comme actif ; son premier passage après migration était attendu le 31 octobre à 03:00 UTC. Les 19 assertions pgTAP ont réussi dans une transaction annulée et n'ont laissé aucune donnée de test en base.

La durée de douze mois est un choix de conservation documenté selon les finalités de Loculary ; elle ne constitue pas une durée maximale universelle fixée par le RGPD. Les journaux gérés par les prestataires restent soumis à leurs conditions effectives.

## Travaux juridiques et conformité à venir

Avant un lancement public à grande échelle, la documentation juridique et de confidentialité doit être revue au regard de l'implémentation réelle, des flux de données, des mécanismes de consentement, des politiques de conservation et des juridictions desservies.

## Laboratoire de conception

La galerie de composants s'exécute localement dans l'application et n'enregistre aucun état de maintenance dans Supabase. Les décisions techniques, les spécifications et les vérifications sont conservées dans le dépôt Git. Le journal d'audit d'administration demeure distinct et continue d'utiliser la permission `audit.read`.
