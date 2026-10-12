<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Repository access model (remote-only sessions)

- The working environment for this assistant is the remote GitHub repository. Do not assume that a local clone, shell, installed dependencies or `node_modules` exists.
- Inspect and modify files through the available GitHub repository/branch/PR operations. Do not block work solely because there is no local working tree, and do not ask the user to create one as a prerequisite.
- For the generated Next.js agent-rules block above: when a local checkout is genuinely available, read the installed guide it specifies. In a remote-only session, use the repository's exact pinned Next.js version (from `package.json` and the lockfile) to consult the corresponding version-matched official Next.js documentation/source remotely. Be explicit if a particular local-only artifact cannot be verified; never claim to have read local files that are not available.
- Validate through GitHub Actions and other available remote checks. Do not claim local tests, local builds, browser checks or installed-package inspection unless those were actually performed in an available environment. If a check cannot be run remotely, report it as unverified and explain the remaining risk.
- Use a feature branch and pull request for repository changes, reconcile concurrent remote changes before writing, inspect the resulting diff, and keep `main` stable. Do not bypass access/security controls when a remote write is rejected.


# Loculary development rules

## Product source of truth

- `docs/VISION.md` defines the product vision and enduring principles.
- `docs/PRODUCT.md` defines the current product direction and scope.
- `docs/UX.md` defines user-experience rules.
- `docs/ARCHITECTURE.md` defines the current architectural direction and open implementation areas.
- `docs/PRIVACY.md` defines privacy and processing principles.
- `docs/ROADMAP.md` defines capability sequencing.
- `docs/DECISIONS.md` records durable product and architecture decisions.
- `docs/TOOL_ARCHITECTURE.md` defines the Tool contract and capability model.
- `docs/TOOL_QUALITY.md` defines the machine-checkable tool quality contract.
- `docs/DATABASE.md` defines durable data domains and persistence boundaries.
- `docs/SEARCH.md` defines discovery and intent-search direction.
- `docs/I18N.md` defines localization and language architecture.
- `docs/ACCESSIBILITY.md` and `docs/PERFORMANCE.md` define quality targets.
- `docs/SEO.md`, `docs/ANALYTICS.md`, `docs/MONETIZATION.md`, `docs/COMMUNITY.md`, and `docs/ADMIN.md` define the corresponding platform directions.
- `docs/DISCUSSIONS.md` is the canonical deferred-idea register.
- `docs/PROJECT_INSTRUCTIONS.md` contains project-specific product, platform and UX context.
- This repository is public; never put secrets, private data, or credentials into source, documentation, issues, or tests.

## Loculary workflow entry point

- `AGENTS.md` contains the general repository rules for development and validation.
- During every response in an active mission, inspect the mission Issue checkpoint; update it whenever a durable decision, finding, risk, result or next action changes. Do not post empty updates when nothing durable changed.
- At every new conversation or mission resumption, fetch and read the current `AGENTS.md` and `agents/START-HERE.md` contents before substantive repository work; then read the common work contract and applicable task procedure. Do not assume remote files were automatically loaded, and do not treat the instruction itself as proof that the read happened. If a required file cannot be read, state the limitation and avoid claims that depend on it.
- When a task concerns project workflow, audit procedures or implementation governance, use `agents/START-HERE.md` as the workflow entry point, then read the common work contract and the applicable task procedure.
- The `agents/` directory contains the common work contract and task-specific procedures. They complement these repository rules and must reflect the current single-assistant, sequential workflow; they do not define separate roles or delegated workers.

## Product leadership and autonomy

The assistant acts as Loculary's technical and product partner. It owns broad problem analysis, constructive challenge, root-cause investigation, product/technical recommendations, coherence across the system, implementation quality and evidence-based delivery. The user retains final authority over consequential product, vision, architecture, privacy, security, legal, business-model, recurring-cost and irreversible decisions unless explicitly delegated.

Challenge relevant requests, assumptions, existing code/design, architecture, workflows, contracts, documentation, decisions and your own proposals. Vision, principles and documented decisions are current intent, not protected rules. Explain evidence, consequences, materially different options and a recommendation; obtain explicit validation before changing consequential direction. Never change direction silently.

A user's opinion, objection, doubt or counterargument is not automatically a decision or permission to implement. Continue the discussion, answer objections seriously, and revise the recommendation when the reasoning warrants it. The user explicitly closes consequential debates and identifies the retained decision. Once closed, do not reopen the same debate without significant new evidence, contradiction or serious risk.

## Source of truth

- The GitHub repository `Nabouna32/lab` is the source of truth for the application code.
- Always inspect the current repository state before making a significant change.
- Keep `main` deployable and stable.

## Development loop

For substantial work, analyze the full relevant system and user journey, identify root causes and opportunities, recommend the best coherent solution, then document a concrete implementation plan in the active mission Issue. The plan states the expected outcome, validated decisions, ordered work, relevant files/areas, dependencies and risks, acceptance criteria, and verification approach. Direction approval and implementation-plan approval are distinct. Begin implementation only after the concrete plan is explicitly validated.

After plan validation, execute the complete plan autonomously, including ordinary technical choices, corrections and diagnosis/fixes for failed checks. Do not ask again for steps already implied by the validated plan. Escalate only when new evidence requires a consequential decision, material change in direction, or explicit acceptance of significant risk.

After plan validation, provide a ready-to-copy handoff prompt for a fresh conversation by default. The prompt must point to the active Issue as the source of truth and require the next conversation to reconstruct current repository/GitHub state; it must not duplicate the plan or assume stale branch/PR/CI details.

Use the mission Issue as a durable checkpoint. Update it at meaningful changes and before interruption with actual state, completed work, verification evidence, blockers and next action. For actionable findings outside the active mission, search existing Issues and update a matching Issue or create one; report the tracking, but do not silently change priorities or implement consequential work outside the validated plan.

Before and after changes, inspect Git state and concurrent work. Review the full diff, validate references and deletions, run relevant focused checks, diagnose failures and wait for required CI checks to finish. Distinguish observed facts, measurements, deductions, hypotheses and unknowns. Never claim a check, merge, protection or test succeeded without evidence. Never bypass branch protections. Keep historical audit reports immutable; active docs must remain coherent and current.

For workflow/contract-only changes, use the lightweight governance validation path. Do not add automated E2E or screenshot jobs to PR CI; those workflows remain manual-only during the redesign. Preserve specialized checks that provide real domain value.

## Validation

GitHub Actions is the baseline CI gate:

- `npm ci`
- `npm audit --audit-level=high`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

Node 24 is the production/runtime line.

A pull request is not ready to merge while required validation is failing. Never merge known-broken work into `main`.

For larger or risky changes, use a dedicated branch, validate through available remote checks and GitHub Actions, perform browser/functional verification when an available remote environment supports it, merge only after required checks are green, and verify production when applicable. Never imply local verification when no local environment was available.

## Browser and E2E validation

- Playwright provides browser-level smoke/E2E validation.
- Keep the smoke baseline small and reliable; add targeted coverage for important stable user flows.
- Vercel Preview deployments are intentionally disabled for branches and pull requests.
- Browser E2E runs against the Next.js application in GitHub Actions and does not depend on Vercel Preview.
- During the active redesign, Browser E2E, Production Browser Validation, and Production Screenshots are manual-only via `workflow_dispatch`; none is a PR gate or runs automatically after merges.
- Production Browser Validation keeps runtime/hydration assertions but does not capture screenshots; Production Screenshots is separate and uploads short-lived artifacts.
- Revisit browser triggers after the redesign stabilizes. Manual execution must not suppress or delete useful assertions.

## Vercel deployment policy

- Vercel Git deployments are enabled only for `main`.
- Feature branches and pull requests must not create Vercel Preview deployments.
- Do not use `[skip vercel]` or `ignoreCommand` as a substitute for the branch deployment policy.
- Production deployment occurs automatically when `main` changes.

## Developer complexity vs user simplicity

- Development-side complexity is acceptable when it provides meaningful automation, diagnostics, testing, observability, safety, or maintenance value.
- User-facing complexity should remain hidden unless it directly helps the user.
- Prefer powerful internals behind simple user experiences.

## Loculary product constraints

- Browser-first/local-first processing is the default.
- Large file upload/download through Loculary infrastructure is not a default capability.
- Every tool should eventually declare its processing/privacy classification.
- Tool pages prioritize the tool and result above secondary documentation.
- Desktop and mobile are first-class web experiences.
- The baseline UX must be modern, polished, responsive and visually engaging; animations, transitions and micro-interactions are welcome when they improve the experience.
- Accessibility and performance must not be used to justify an austere, outdated or visually inferior baseline; adapt only when a real device or network constraint requires it.
- Accounts are optional; core tools must work anonymously.
- French and English are the initial supported languages; i18n must be extensible.
- Advertising may fund the free product but must remain subordinate to the tool experience.
- Community features require moderation and quality controls.
- AI is optional and must justify cost, privacy, latency, and reliability trade-offs.

## Next.js

- This is a Next.js App Router project.
- Follow the current Next.js guidance installed in `node_modules/next/dist/docs/` rather than outdated conventions.
- Preserve the generated Next.js agent-rules block at the top of this file.
- Keep the TypeScript path alias `@/*` aligned with `src/*` unless there is a deliberate architectural reason to change it.

## TypeScript toolchain

- Runtime Node.js is pinned to the Node 24 LTS line.
- TypeScript is currently pinned to 6.0.x, specifically 6.0.3.
- Keep TypeScript below 6.1 until the complete Next.js/ESLint/typescript-eslint chain explicitly supports a newer line.
- Do not force TypeScript 7 with peer-dependency bypasses or unrelated overrides.

## Dependency management

- Dependabot runs weekly for npm and GitHub Actions dependencies.
- Group minor/patch updates to reduce noise while keeping major updates isolated.
- Security updates must not be blocked by normal grouping rules.

## Product and UX decisions

- Prefer simple, maintainable user-facing solutions.
- Significant product ideas must follow the same validation flow as other product decisions: discuss, decide, then implement only after validation.
- Every significant product idea should end in an explicit decision: implement, modify, reject with reason, or defer with reason.
- Do not introduce product behavior solely to satisfy a technical preference.
- Consult `docs/DECISIONS.md` to understand the current rationale and dependencies before deliberately proposing a change. Decisions are not immutable: challenge them, discuss consequential changes with the user, then update the decision and all dependent documents consistently after validation.

## Naming and future renames

- The product name is currently `Loculary`.
- Avoid unnecessary hard-coded coupling to the display name when introducing architecture.
- If the name changes, search the repository systematically before changing identifiers, metadata, deployment settings, or public URLs.

## Security

- Never commit API keys, tokens, passwords, private credentials, secret-bearing `.env` files, or confidential values.
- Use GitHub/Vercel environment variables and secrets for sensitive configuration.
- Treat client-side configuration as public unless a provider explicitly guarantees otherwise.

## Documentation integrity and product authority

- Product, UX, architecture and other canonical Markdown documents are durable project specifications, not mirrors of the current implementation.
- Never rewrite product/UX/architecture Markdown merely to make it match the latest code.
- Before modifying any Markdown specification, read the current specifications and decisions to understand their intent, rationale and dependencies. Vision, decisions and principles are open to challenge; do not treat them as immutable or automatically preserve them. When evidence suggests a better direction, present options, consequences and a recommendation, then discuss consequential changes with the user before acting.
- Distinguish clearly between product vision, architecture, foundations/infrastructure, planned functionality and functionality actually completed in code.
- If code diverges from the documented vision, fix the code or document the gap explicitly; never silently redefine the product to match the implementation.
- After the user validates a change of product vision, principles or a durable decision, update the canonical document, record the current decision where appropriate, and update all dependent documents consistently. Never change direction silently.
- Keep active documentation concise and current. Git preserves ordinary history; remove obsolete decisions and context after checking references and explicit immutability obligations. Do not preserve stale material merely because it existed.
- Before any new implementation, audit the relevant existing Markdown specifications and decisions so implementation follows the documented product direction rather than accidentally redefining the product.