# Tool creation workflow

Use TOOL-FACTORY-CONTRACT.md as the canonical procedure for adding or extending a Loculary tool. TOOL-WORKFLOW.md is a short launch checklist for the same assistant, not a separate role or delegated worker.

Do not create a tool merely to increase catalog size. Challenge its user value, duplication, complexity, processing model, privacy/cost burden and maintenance cost. Consider extending or merging existing capabilities or rejecting the idea when that is better.

Work on one validated tool scope at a time. Inspect current main, the catalog, registry, canonical documents, branches and PRs. Implement the complete approved tool, including domain correctness, UX, accessibility, i18n and tests. Inspect the diff, run applicable checks and use the repository's Git/PR/CI workflow.

Do not automatically choose another tool after finishing one; wait for the user's next direction. Keep the mission Issue current and track actionable out-of-scope findings only after asking the user whether to create or attach an Issue.