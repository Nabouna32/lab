# Loculary — état opérationnel du projet

Dernière vérification : 2026-10-19  
Source de vérité : dépôt GitHub, CI, issues et déploiements liés ci-dessous. Ce document est un tableau de bord concis, pas un remplacement des spécifications produit.

## Objectif

Préparer le lancement public autour du **26 octobre 2026**, sans sacrifier les fonctionnalités utiles. Le lancement est un jalon de qualité, pas la fin du développement.

## État vérifié

- Branche de production : `main`.
- Dernier commit applicatif examiné : [`316091a`](https://github.com/Nabouna32/lab/commit/316091aacf8498dc6a154ab01a110db04fce1bf2), fusion de la PR [#747](https://github.com/Nabouna32/lab/pull/747). Le tableau de bord et le registre des problèmes ont été ajoutés par la PR [#748](https://github.com/Nabouna32/lab/pull/748), puis actualisés par les PR [#749](https://github.com/Nabouna32/lab/pull/749), [#751](https://github.com/Nabouna32/lab/pull/751) et [#752](https://github.com/Nabouna32/lab/pull/752).
- Socle dépendances déclaré : Next.js `16.4.2`, React et React DOM `19.3.1`, TypeScript `~6.0.3`, Tailwind CSS `4`, Node.js `24.x`. Source : [package.json](../package.json).
- La CI de la PR #747 a réussi sur son SHA exact, incluant installation/lockfile, revue des dépendances, lint, vérification TypeScript, tests et build : [run #39187544650](https://github.com/Nabouna32/lab/actions/runs/39187544650).
- Le déploiement Vercel de production lié au commit fusionné a été signalé `READY` : [déploiement](https://vercel.com/nabouna32/loculary/6AwLouz9mycFmcPUH5HSBvdsr9gX). Le domaine public configuré est [loculary.vercel.app](https://loculary.vercel.app/).
- **Limite de vérification :** le rendu et les parcours du site n'ont pas pu être testés dans un navigateur depuis la session distante. `READY` prouve l'état du déploiement, pas une validation fonctionnelle complète.
- Les récentes PR d'harmonisation du menu d'en-tête (#742–#746) et le correctif de sécurité #747 sont fusionnés.

## Priorités immédiates

1. **Corriger le contrat de capacité presse-papiers des outils.** Le contrôle croisé du registre des modules et des imports `CopyButton` a trouvé huit outils qui utilisent ce composant sans déclarer `clipboard` : intérêts composés, convertisseur d'unités, fuseaux horaires, formateur/validateur XML, timestamp Unix, générateur de hash, calculateur de sous-réseau IP et bitrate vidéo. Le runtime refuse l'accès au presse-papiers si la capacité n'est pas déclarée ; le test précédent ne couvrait que deux outils. Correctif ciblé en cours sur la branche `fix/tool-clipboard-capability-contract` : déclarer la capacité et rendre le test exhaustif sur les modules du registre qui importent `CopyButton`.
2. Évaluer une remédiation sûre de l'avis `braces` suivi dans [issue #461](https://github.com/Nabouna32/lab/issues/461). L'audit complet actuel échoue sur cinq entrées de paquets liées à un seul avis explicite dans l'arbre de développement ; `npm audit --omit=dev` signale zéro vulnérabilité de production. Ne pas affaiblir le contrôle.
3. Conserver les politiques RLS de partage actuelles : les plans d'exécution des expressions équivalentes montrent `InitPlan` pour `auth.uid()` et `current_setting()` ainsi que les index attendus ; les avertissements Advisor sont probablement un faux positif pour ces expressions. Réévaluer si le code ou le plan change.
4. Garder les dix index signalés comme inutilisés tant qu'une période de charge représentative ne démontre pas qu'ils sont superflus ; ils sont petits aujourd'hui mais peuvent accélérer des requêtes d'administration futures.
5. Vérifier les parcours réels, le responsive, l'accessibilité clavier/lecteur d'écran et les états d'erreur avec les moyens disponibles. Ne pas prétendre qu'un test navigateur a été effectué s'il ne l'a pas été.
6. Continuer l'harmonisation UX/UI en fonction de défauts confirmés, en conservant l'ambition fonctionnelle et les principes local-first / comptes facultatifs.

## Risques et limites actifs

- L'audit complet actuel échoue sur cinq entrées HIGH (`@next/eslint-plugin-next`, `braces`, `eslint-config-next`, `fast-glob`, `micromatch`) propagées par l'avis [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) dans les outils de développement. `npm audit --omit=dev` est passé avec zéro vulnérabilité signalée. Preuve : [run diagnostique #39204638077](https://github.com/Nabouna32/lab/actions/runs/39204638077). L'avis amont ne fournit toujours pas de version corrigée ; le suivi reste ouvert dans [issue #461](https://github.com/Nabouna32/lab/issues/461).
- La protection Supabase contre les mots de passe compromis reste indisponible sur l'offre Free actuelle et le Security Advisor la signale désactivée. Le risque de lancement pour l'inscription publique est suivi par l'issue [#467](https://github.com/Nabouna32/lab/issues/467), rouverte après confirmation que l'avertissement persiste. Les outils principaux restent anonymes ; aucune dépense ou modification Auth de production n'a été effectuée.
- L'advisor Performance signale deux politiques RLS sur `user_collections` et `user_collection_items` ainsi que dix index inutilisés. Les plans examinés montrent les sous-expressions comme `InitPlan` et les scans indexés attendus ; ne pas modifier les politiques sur la seule base de l'avertissement. Les index n'ont aucune utilisation observée et font 8–16 kB, mais leur suppression reste différée jusqu'à disposer d'une charge représentative.
- La validation fonctionnelle de production reste incomplète faute d'accès navigateur dans la session distante.

## Sources canoniques

- Vision : [VISION.md](VISION.md)
- Définition produit : [PRODUCT.md](PRODUCT.md)
- Architecture : [ARCHITECTURE.md](ARCHITECTURE.md)
- Confidentialité : [PRIVACY.md](PRIVACY.md)
- Internationalisation : [I18N.md](I18N.md)
- Design system : [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)
- Décisions durables : [DECISIONS.md](DECISIONS.md)
- Problèmes récurrents : [KNOWN-ISSUES.md](KNOWN-ISSUES.md)

## Mise à jour

Actualiser ce tableau après une modification significative, une preuve CI/déploiement, un changement de risque ou une évolution de priorité. Ne marquer un point comme terminé que si une preuve vérifiable existe.
