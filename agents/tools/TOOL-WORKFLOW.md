# Tool creation launch checklist

Read AGENTS.md, agents/AGENT-CONTRACT.md, agents/PRODUCT-ISSUE-CONTRACT.md, agents/tools/TOOL-FACTORY-CONTRACT.md and the relevant canonical catalog, tool, UX, privacy, i18n and architecture documents.

Inspect current main, the catalog and registry, the active Issue, branches and PRs. Challenge the complete user problem and journey, not only the proposed tool: whether it deserves to exist, duplicates an existing capability, should extend or merge with something, and what simpler or more valuable alternative exists. Evaluate domain correctness, processing/privacy, capabilities, UX, accessibility, i18n, maintenance and cost. The validated scope limits execution authorization, not analysis.

After the scope is validated, implement the complete tool, test important boundaries and both locales, inspect the diff, update documentation and the mission Issue, and deliver through the normal Git/PR/CI workflow. Do not automatically choose a new tool after completion.