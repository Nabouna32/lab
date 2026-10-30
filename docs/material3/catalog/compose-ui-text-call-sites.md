# Audit des usages React/Web — Compose UI Text

## Périmètre et méthode

Audit ciblé des consommateurs directs des trois composants de saisie partagés recensés dans la revue [Compose UI Text 1.12.1](compose-ui-text-1.12.1.md). L'objectif est de distinguer les usages produit des démonstrations et les composants HTML natifs des adaptations Loculary.

- Référence AndroidX : Compose UI Text 1.12.1, commit `5e0747401bf56b243e3b5141ae080dc9bc61d29c`.
- Dépôt examiné : branche `main` après fusion de la PR #1076.
- Méthode : analyse AST TypeScript des 423 fichiers `.ts`/`.tsx` suivis par Git. Le parcours associe les imports nommés (y compris les alias) aux balises JSX : 16 fichiers/21 instances `TextField`, 20 fichiers/23 instances `TextArea`, un fichier/3 instances `MaterialTextField`. La recherche des balises natives confirme un seul `textarea` indépendant dans `HashGenerator`. Les trois implémentations et leurs consommateurs pertinents ont ensuite été relus.
- Limite d'inventaire : cette analyse couvre les imports directs et leurs usages JSX dans les fichiers suivis ; elle ne prétend pas détecter les compositions indirectes ou créations dynamiques hors de ce contrat.
- Tests comportementaux : huit tests DOM montent les trois composants avec React 19 et happy-dom 21.0.4. Ils vérifient les associations label/ID, les descriptions ARIA, les erreurs/aides, les changements contrôlés, le compteur, les états désactivés et le bouton de révélation. Une valida���q�^