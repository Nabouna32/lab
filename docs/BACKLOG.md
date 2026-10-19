## P2 — Refonte progressive des parcours
- **Lot UX livré :** la page de recherche sans requête propose maintenant quatre tâches de démarrage grâce à la [PR #796](https://github.com/Nabouna32/lab/pull/796). L’audit complet de la recherche/exploration (états clavier, suggestions et absence de résultats) reste à faire.


- **État :** lot 1 livré ; [REFONTE.md](REFONTE.md).
- **Ordre :** recherche/exploration, système partagé, shell des pages d'outils, puis audit qualité des outils.
- **Règle :** réordonner si un défaut concret de sécurité, de justesse ou d'accessibilité présente un impact supérieur. Ne pas valider le rendu uniquement par lecture du code.

## P2 — Alertes Supabase Performance et index inutilisés

- **État :** surveillance, pas de défaut confirmé ; [KNOWN-ISSUES.md](KNOWN-ISSUES.md).
- **Règle :** ne pas modifier les politiques RLS ni supprimer les index sur la seule base de l'Advisor et de compteurs issus d'une base peu sollicitée. Réévaluer avec une preuve de plan ou une charge représentative.
