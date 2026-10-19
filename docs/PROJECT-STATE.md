# Loculary — état opérationnel du projet

Dernière vérification : 2026-10-19  
Source de vérité : dépôt GitHub, CI, issues et déploiements liés ci-dessous. Ce document est un tableau de bord concis, pas un remplacement des spécifications produit.

## Objectif

Préparer le lancement public autour du **26 octobre 2026**, sans sacrifier les fonctionnalités utiles. Le lancement est un jalon de qualité, pas la fin du développement.

## État vérifié

- Branche de production : `main`.
- Dernier commit vérifié : [`316091a`](https://github.com/Nabouna32/lab/commit/316091aacf8498dc6a154ab01a110db04fce1bf2), fusion de la PR [#747](https://github.com/Nabouna32/lab/pull/747).
- Socle dépendances déclaré : Next.js `16.4.2`, React et React DOM `19.3.1`, TypeScript `~6.0.3`, Tailwind CSS `4`, Node.js `24.x`. Source : [package.json](../package.json).
- La CI de la PR #747 a réussi sur son SHA exact, incluant installation/lockfile, revue des dépendances, lint, vérification TypeScript, tests et build : [run #39187544650](https://github.com/Nabouna32/lab/actions/runs/39187544650).
- Le déploiement Vercel de production lié au commit fusionné a été signalé `READY` : [déploiement](https://vercel.com/nabouna32/loculary/6AwLouz9mycFmcPUH5HSBvdsr9gX). Le domaine public configuré est [loculary.vercel.app](https://loculary.vercel.app/).
- **Limite de vérification :** le rendu et les parcours du site n'ont pas pu être testés dans un navigateur depuis la session distante. `READY` prouve l'état du déploiement, pas une validation fonctionnelle complète.
- Les récentes PR d'harmonisation du menu d'en-tête (#742–#746) et le correctif de sécurité #747 sont fusionnés.

## Priorités immédiates

1. Obtenir un état d'audit npm actuel et complet sur le lockfile de `main`, y compris les dépendances de production séparément des outils de développement. Ne pas réutiliser le nombre historique de vulnérabilités comme résultat actuel.
2. Traiter la situation de sécurité suivie dans [issue #461](https://github.com/Nabouna32/lab/issues/461) sans désactiver ni affaiblir le contrôle de sécurité.
3. Auditer les parcours de lancement essentiels et les règles RLS Supabase avec des preuves concrètes ; ne pas déduire la justesse des politiques de la seule activation de RLS.
4. Vérifier les parcours réels, le responsive, l'accessibilité clavier/lecteur d'écran et les états d'erreur avec les moyens disponibles. Ne pas prétendre qu'un test navigateur a été effectué s'il ne l'a pas été.
5. Continuer l'harmonisation UX/UI en fonction de défauts confirmés, en conservant l'ambition fonctionnelle et les principes local-first / comptes facultatifs.

## Risques et limites actifs

- Alerte HIGH liée à `braces@3.0.3`, dans la chaîne des outils de développement, suivie par [issue #461](https://github.com/Nabouna32/lab/issues/461). Le registre amont consulté ne fournit pas de version corrigée ; l'exception au contrôle n'est pas justifiée. L'état actuel de l'audit complet reste à confirmer après les mises à jour de dépendances.
- La protection Supabase contre les mots de passe compromis est signalée désactivée par l'avis de sécurité et n'est pas disponible sur l'offre Free actuelle. Ne pas répéter une tentative d'activation tant que l'offre ou la disponibilité n'a pas changé ; évaluer les protections applicables à l'offre existante.
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
