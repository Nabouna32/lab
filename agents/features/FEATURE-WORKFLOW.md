# Feature implementation guide

Read `AGENTS.md`, `agents/AGENT-CONTRACT.md`, `agents/PRODUCT-ISSUE-CONTRACT.md` and `agents/features/FEATURE-FACTORY-CONTRACT.md`, then the relevant canonical product, UX, architecture, privacy, localization and decision documents.

Analyze the full user problem and journey. Challenge whether the feature should exist, whether an existing capability should be extended or consolidated, and what coherent solution best serves users. Consider UX, accessibility, i18n, privacy, security, performance, maintenance and cost.

Use the mission Issue for the internal implementation plan and checkpoints. After the user approves the explained change proposal, implement the full agreed result, test meaningful boundaries, update active documentation, inspect the complete diff and deliver through the normal branch/PR/CI workflow. Do not ask the user to approve the plan. Routine technical steps do not need repeated approval; pause and discuss if new evidence materially changes the approved outcome or significant risk.

Automated browser E2E and screenshots remain manual-only during the active redesign and are not PR gates.
