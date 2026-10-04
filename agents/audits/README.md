# Loculary audit missions

Each Markdown file in this directory is a reusable autonomous audit prompt.

**Mandatory contract:** read [`agents/AUDIT-CONTRACT.md`](../AUDIT-CONTRACT.md) before executing any mission. The mission itself must also state the essential report/path/history rules explicitly. If there is any conflict, the canonical contract wins unless a deliberate project decision changes it.

## Contract for every audit mission

Every mission should instruct the agent to:

- inspect the real current repository;
- read `AGENTS.md` and the relevant product/technical documentation;
- challenge the current implementation rather than treating it as correct by default;
- distinguish observed facts from deductions, proposals and decisions;
- do not modify product/project files during the audit; only create the new historical report and update that audit's `LATEST.md` pointer as defined by the canonical contract;
- test or measure claims whenever practical;
- identify both defects and suboptimal-but-working choices;
- include a from-scratch challenge: **if Loculary were built today, what would you change?**
- produce a complete audit report using the canonical naming, historical immutability and classification contract;
- finish with a copy-pastable autonomous implementation-agent prompt;
- state what should be preserved;
- identify decisions that require explicit validation;
- define implementation scope, tests, verification and documentation expectations.

## Stable audit IDs

The numeric prefix is stable and must not be reused for another domain. The filename may evolve if the domain name changes, but the ID remains the historical identity of the audit.

Current planned audit sequence:

1. QA global / qualité produit
2. QA spécialisé outils
3. Sécurité / Privacy
4. Internationalisation
5. Architecture Next.js
6. Architecture générale / maintenabilité
7. UX
8. UI
9. Design system
10. Accessibilité
11. Performance
12. SEO
13. Responsive / multi-device
14. Navigation / routing / liens
15. Catalogue / stratégie des outils
16. Qualité / pertinence des outils
17. Contenu / UX writing
18. Plateforme / infrastructure
19. CI/CD / Git / release
20. Dépendances / supply chain
21. Observabilité / monitoring / erreurs
22. Analytics / mesure produit
23. Publicité / monétisation
24. PWA / expérience installable
25. Compatibilité navigateurs
26. RGPD / conformité
27. Fiabilité / résilience
28. Tests automatisés / stratégie QA
29. Produit / vision / cohérence
30. Documentation / gouvernance / continuité
31. Audit final transversal / red team

This list is an execution plan, not a declaration that all 31 audits must remain forever. Changes to the durable process should be documented through normal project decisions.
