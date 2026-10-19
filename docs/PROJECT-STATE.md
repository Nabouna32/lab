# Loculary — état opérationnel du projet

Dernière vérification : 2026-10-19  
Source de vérité : dépôt GitHub, CI, issues et déploiements liés ci-dessous. Ce document est un tableau de bord concis, pas un remplacement des spécifications produit.

## Objectif

Préparer le lancement public autour du **26 octobre 2026**, sans sacrifier les fonctionnalités utiles. Le lancement est un jalon de qualité, pas la fin du développement.

## État vérifié

- Branche de production : `main`.
- Dernier commit de production : [`af1ad99`](https://github.com/Nabouna32/lab/commit/af1ad9901f8c5ebd93e3a593b149d502c262fdad), fusion de la [PR #753](https://github.com/Nabouna32/lab/pull/753). Le correctif déclare la capacité `clipboard` dans les huit outils précédemment incomplets et rend le test de régression exhaustif pour les modules enregistrés qui importent `CopyButton`. Le tableau de bord et le registre des problèmes ont été ajoutés par la PR [#748](https://github.com/Nabouna32/lab/pull/748), puis actualisés par les PR [#749](https://github.com/Nabouna32/lab/pull/749), [#751](https://github.com/Nabouna32/lab/pull/751) et [#752](https://github.com/Nabouna32/lab/pull/752).
- Socle dépendances déclaré : Next.js `16.4.2`, React et React DOM `19.3.1`, TypeScript `~6.0.3`, Tailwind CSS `4`, Node.js `24.x`. Source : [package.json](../package.json).
- La CI de sécurité de la PR #747 a réussi sur son SHA exact : [run #39187544650](https://github.com/Nabouna32/lab/actions/runs/39187544650). La CI complète de la PR #753 a aussi réussi sur sa tête finale `db1afb4306a7e250e4e69c329ea1ba4ec2054e40` (installation, lint, TypeScript, tests et build) : [run #39210884262](https://github.com/Nabouna32/lab/actions/runs/39210884262).
- Le déploiement Vercel de production pour le commit de merge `af1ad9901f8c5ebd93e3a593b149d502c262fdad` est `READY` : [déploiement](https://vercel.com/nabouna32/loculary/6QpSWDkMKrQDRb3sUXRJJa2Hx9ZX). Le domaine public configuré est [loculary.vercel.app](https://loculary.vercel.app/).
- **Limite de vérification :** le rendu et les parcours du site n'ont pas pu être testés dans un navigateur depuis la session distante. `READY` prouve l'état du déploiement, pas une validation fonctionnelle complète.
- Les récentes PR d'harmonisation du menu d'en-tête (#742–#746) et le correctif de sécurité #747 sont fusionnés.

## Priorités immédiates

1. **Corriger l'anatomie de l'IconButton partagé.** Le contrôle source contre AndroidX a confirmé un écart entre la surface visible de 48 × 48 CSS px et le conteneur M3 small de 40dp, distinct de la cible interactive minimale de 48dp. Le lot `fix/icon-button-visual-touch-target` conserve la cible et l'anneau de focus de 48px, déplace les styles de variante sur une surface interne de 40px, et ajoute une régression source. La CI et la vérification navigateur de ce lot restent à confirmer ; le rendu réel n'est pas revendiqué.
2. Évaluer une remédiation sûre de l'avis `braces` suivi dans [issue #461](https://github.com/Nabouna32/lab/issues/461). L'audit complet actuel échoue sur cinq entrées de paquets liées à un seul avis explicite dans l'arbre de développement ; `npm audit --omit=dev` signale zéro vulnérabilité de production. Ne pas affaiblir le contrôle ni répéter les tentatives amont sans nouvelle preuve.
3. Suivre la décision de risque / coût de l'inscription publique dans [issue #467](https://github.com/Nabouna32/lab/issues/467). L'examen du code confirme les validations de base et le traitement de `weak_password` / `429`, mais ne permet pas de vérifier si l'inscription est activée en production. La protection contre les mots de passe compromis reste indisponible sur l'offre Free ; aucun upgrade ni changement Auth n'a été effectué. Ce point nécessite une décision du propriétaire si l'inscription publique doit être promue au lancement.
4. Conserver les politiques RLS de partage actuelles : les plans d'exécution des expressions équivalentes montrent `InitPlan` pour `auth.uid()` et `current_setting()` ainsi que les index attendus ; les avertissements Advisor sont probablement un faux positif pour ces expressions. Réévaluer si le code ou le plan change.
5. Garder les dix index signalés comme inutilisés tant qu'une période de charge représentative ne démontre pas qu'ils sont superflus ; ils sont petits aujourd'hui mais peuvent accélérer des requêtes d'administration futures.
6. Vérifier les parcours réels, le responsive, l'accessibilité clavier/lecteur d'écran et les états d'erreur avec les moyens disponibles. Ne pas prétendre qu'un test navigateur a été effectué s'il ne l'a pas été.
7. Continuer l'harmonisation UX/UI en fonction de défauts confirmés, en conservant l'ambition fonctionnelle et les principes local-first / comptes facultatifs.

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
