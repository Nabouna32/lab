# Loculary audit procedures

All audit procedures inherit the mandatory rules in agents/AGENT-CONTRACT.md. The common contract defines bootstrap, challenge, source precedence, verification and continuity; agents/PRODUCT-ISSUE-CONTRACT.md defines mission checkpointing; agents/AUDIT-CONTRACT.md defines audit-specific evidence and reporting rules.

Each Markdown file in this directory is a reusable audit procedure for the same assistant. Read agents/AUDIT-CONTRACT.md before executing a mission. A mission may add domain-specific checks but cannot weaken the common contract.

## Procedure catalogue

The numbered files below define audit scopes; they are procedures, not claims that every audit has been run recently or that its findings remain current.

- [01 — Global QA](./01-qa-global.md)
- [02 — Tool QA](./02-qa-outils.md)
- [03 — Security and privacy](./03-security-privacy.md)
- [04 — Internationalization](./04-i18n.md)
- [05 — Next.js architecture](./05-nextjs-architecture.md)
- [06 — Architecture and maintainability](./06-architecture-maintainability.md)
- [07 — UX](./07-ux.md)
- [08 — UI](./08-ui.md)
- [09 — Design system](./09-design-system.md)
- [10 — Accessibility](./10-accessibility.md)
- [11 — Performance](./11-performance.md)
- [12 — SEO](./12-seo.md)
- [13 — Responsive design](./13-responsive.md)
- [14 — Navigation and routing](./14-navigation-routing.md)
- [15 — Catalog strategy](./15-catalog-strategy.md)
- [16 — Tool quality](./16-tool-quality.md)
- [17 — UX writing and content](./17-content-ux-writing.md)
- [18 — Platform infrastructure](./18-platform-infrastructure.md)
- [19 — CI/CD and release](./19-ci-cd-release.md)
- [20 — Dependencies and supply chain](./20-dependencies-supply-chain.md)
- [21 — Observability and errors](./21-observability-errors.md)
- [22 — Analytics and measurement](./22-analytics-measurement.md)
- [23 — Monetization](./23-monetization.md)
- [24 — PWA and installability](./24-pwa-installable.md)
- [25 — Browser compatibility](./25-browser-compatibility.md)
- [26 — GDPR compliance](./26-rgpd-compliance.md)
- [27 — Reliability and resilience](./27-reliability-resilience.md)
- [28 — Automated testing](./28-automated-testing.md)
- [29 — Product vision coherence](./29-product-vision-coherence.md)
- [30 — Documentation governance](./30-documentation-governance.md)
- [31 — Updates and modernization](./31-update-modernization.md)
- [32 — Final red-team review](./32-final-red-team.md)

When adding, renaming or removing a numbered procedure, update this catalogue in the same change. The workflow contract validator checks audit IDs and catalogue links.

## Requirements for every audit

- Inspect the real current repository and relevant project documentation.
- Challenge the current implementation rather than treating it as correct by default.
- Identify both defects and suboptimal-but-working choices.
- Ask what we would change if Loculary were built today.
- Distinguish observed facts, measurements, deductions, proposals and decisions.
- Test or measure claims whenever practical.
- Keep the audit itself read-only except for its new historical report and the replaceable LATEST.md pointer.
- Maintain the active Issue checkpoint while the audit is in progress.
- Include elements to preserve, recommendations, decisions requiring validation and a concrete next-step plan.
- Do not convert a finding into a requirement without validation.

## Stable audit IDs

Numeric prefixes identify audit domains and should not be reused for unrelated work. The list is an execution sequence, not a commitment that every audit must remain forever.

The final/red-team audit stays last so that modernization and other corrections can be verified before the final transversal review. Change the sequence only through the normal validated workflow.

## Report lifecycle

Each completed run creates a new timestamped report under docs/audits/<id>-<slug>/ and updates that directory's LATEST.md pointer. The timestamp identifies the run, not the current validity of each finding.

Never overwrite or delete historical audit reports merely because a new audit exists. Revalidate old findings against current code before acting on them.
