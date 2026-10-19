# Loculary — état opérationnel du projet

Dernière vérification : 2026-10-19  
Source de vérité : dépôt GitHub, CI, issues et déploiements liés ci-dessous. Ce document est un tableau de bord concis, pas un remplacement des spécifications produit.

## Objectif

Préparer le lancement public autour du **26 octobre 2026**, sans sacrifier les fonctionnalités utiles. Le lancement est un jalon de qualité, pas la fin du développement.

## État vérifié

- Branche de production : `main`.
- Dernier commit de production : [`3bf5a27`](https://github.com/Nabouna32/lab/commit/3bf5a2730304c6f7d826b564bd6f113dea373dba), fusion de la [PR #755](https://github.com/Nabouna32/lab/pull/755). IconButton conserve une cible native de 48 × 48 CSS px avec une surface visuelle de 40 × 40 CSS px. La PR #753 a corrigé les capacités presse-papiers de huit outils. Le tableau de bord et le registre des problèmes ont été ajoutés par la PR [#748](https://github.com/Nabouna32/lab/pull/748), puis actualisés par les PR [#749](https://github.com/Nabouna32/lab/pull/749), [#751](https://github.com/Nabouna32/lab/pull/751), [#752](https://github.com/Nabouna32/lab/pull/752) et [#754](https://github.com/Nabouna32/lab/pull/754).
- Socle dépendances déclaré : Next.js `16.4.2`, React et React DOM `19.3.1`, TypeScript `~6.0.3`, Tailwind CSS `4`, Node.js `24.x`. Source : [package.json](../package.json).
- La CI de sécurité de la PR #747 a réussi sur son SHA exact : [run #39187544650](https://github.com/Nabouna32/lab/actions/runs/39187544650). La CI complète de la PR #753 a réussi sur sa tête finale : [run #39210884262](https://github.com/Nabouna32/lab/actions/runs/39210884262). La CI complète de la PR #755 a réussi sur le SHA `77737d3de3874c9b7512e33aa83cb21cf25db612` (installation, lint, TypeScript, tests et build) à la tentative 2 : [run #39211948341](https://github.com/Nabouna32/lab/actions/runs/39211948341).
- Le déploiement Vercel de production pour le commit de merge `3bf5a2730304c6f7d826b564bd6f113dea373dba` est `READY` : [déploiement](https://vercel.com/nabouna32/loculary/7uCPESpNGf21miYQnkAuZjNtL4z5). Le domaine public configuré est [loculary.vercel.app](https://loculary.vercel.app/).
- **Limite de vérification :** le rendu et les parcours du site n'ont pas pu être testés dans un navigateur depuis la session distante. `READY` prouve l'état du déploiement, pas une validation fonctionnelle complète.
- Les PR d'harmonisation du menu d'en-tête (#742–#746), les correctifs de sécurité #747, de capacités presse-papiers #753 et de géométrie IconButton #755 sont fusionnés.

## Priorités immédiates

1. **Corriger le label d'erreur de TextField.** Le composant partagé applique déjà l'état d'erreur à la bordure, mais la variante Fidelity conserve la couleur normale du label. Le lot `fix/text-field-invalid-label-state` synchronise le label avec `aria-invalid` dans les deux variantes et préserve la couleur désactivée ; test de régression ajouté. La CI est en attente et le rendu navigateur reste à vérifier.
2. Poursuivre l'audit plus large de l'anatomie TextField dans [issue #731](https://github.com/Nabouna32/lab/issues/731) : vérifier les call sites avant de modifier l'API, comparer le label séparé actuel au modèle OutlinedTextField et décider sur preuves si une variante Fidelity distincte est nécessaire. Ne pas confondre le correctif de couleur d'erreur avec une conformité complète.
3. Évaluer une remédiation sûre de l'avis `braces` suivi dans [issue #461](https://github.com/Nabouna32/lab/issues/461). L'audit complet actuel échoue sur cinq entrées de paquets liées à un seul avis explicite dans l'arbre de développement ; `npm audit --omit=dev` signale zéro vulnérabilité de production. Ne pas affaiblir le contrôle ni répéter les tentatives amont sans nouvelle preuve.
4. Suivre la décision de risque / coût de l'inscription publique dans [issue #467](https://github.com/Nabouna32/lab/issues/467). Le code valide les champs et gère `weak_password` / `429`, mais la configuration Auth de production n'est pas vérifiable avec les outils actuels. La protection contre les mots de passe compromis reste indisponible sur l'offre Free ; aucun upgrade ni changement Auth n'a été effectué. Ce point requiert une décision du propriétaire si l'inscription publique doit être promue au lancement.
5. Conserver les politiques RLS de partage actuelles : les plans examinés montrent `InitPlan` pour `auth.uid()` et `current_setting()` ainsi que les index attendus ; les avertissements Advisor semblent faux positifs pour ces expressions. Réévaluer si le code ou le plan change.
6. Garder les dix index signalés comme inutilisés tant qu'une période de charge représentative ne démontre pas qu'ils sont superflus ; ils sont petits aujourd'hui mais peuvent accélérer des requêtes d'administration futures.
7. Vérifier les parcours réels, le responsive, l'accessibilité clavier/lecteur d'écran, les états d'erreur et les deux thèmes avec les moyens disponibles. La session distante n'a pas d'accès navigateur, donc ne pas prétendre que ces vérifications ont été faites.
8. Continuer l'harmonisation UX/UI sur des défauts confirmés, en préservant les outils utiles, l'approche local-first et les comptes facultatifs.

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
