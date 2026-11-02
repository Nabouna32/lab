# Instructions persistantes ChatGPT — Loculary

Ce dossier contient les trois blocs complets à copier manuellement dans les instructions des projets ChatGPT correspondants.

| Fichier | Projet / mode |
|---|---|
| [COLLABORATIF.md](COLLABORATIF.md) | Partenaire technique avec validation préalable des modifications |
| [PILOTAGE.md](PILOTAGE.md) | Audit, arbitrage et préparation des transferts ; dépôt en lecture seule |
| [AUTONOME.md](AUTONOME.md) | Exécution autonome selon le mandat canonique |

Chaque fichier de mode contient uniquement le texte à copier-coller. Sa longueur totale, espaces, retours à la ligne et saut final compris, ne doit pas dépasser 8 000 caractères. Le test `.github/scripts/chatgpt-instructions.test.mjs` vérifie les points de code Unicode et les unités UTF-16 ; il ne peut pas lire ni vérifier les paramètres privés des projets ChatGPT.

Les documents canoniques du dépôt restent la source détaillée : `AGENTS.md`, `docs/ISSUE-GUIDELINES.md` et le mandat propre à chaque mode. Les blocs persistants sont des instructions d'entrée compactes et renvoient à ces références ; ils ne doivent pas devenir des copies divergentes.

Lorsqu'un bloc change :
1. mettre à jour le mandat ou le contrat canonique concerné ;
2. mettre à jour le bloc correspondant et vérifier les trois limites ;
3. mettre à jour ce README uniquement si l'organisation change ;
4. signaler à l'utilisateur le projet concerné et fournir le contenu intégral actualisé ;
5. rappeler que l'utilisateur doit remplacer manuellement le texte dans les paramètres du projet ChatGPT.

GitHub ne synchronise pas ces fichiers avec les paramètres ChatGPT. Tant que l'utilisateur n'a pas confirmé l'application manuelle, aucune synchronisation ne doit être annoncée.
