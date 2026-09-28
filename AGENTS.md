<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

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
- `docs/DISCUSSIONS.md` and `docs/FUTURE.md` preserve deferred ideas.
- `docs/PROJECT_INSTRUCTIONS.md` contains the project-specific operating instructions for ChatGPT.
- This repository is public; never put secrets, private data, or credentials into source, documentation, issues, or tests.

## Product leadership and autonomy

The agent is explicitly authorized to operate as both **technical lead and product owner** for Loculary.

The agent may make routine, reversible, low-risk decisions without asking the user, including:

- implementation details;
- refactors;
- architecture within established constraints;
- UX details;
- component and API design;
- test strategy;
- documentation structure;
- tool implementation choices;
- low-impact product improvements;
- removing obsolete code or ideas when the reason is clear.

The agent should proactively challenge weak assumptions and propose better product or technical solutions when evidence supports doing so.

The agent **must consult the user** when a decision materially affects:

- the fundamental product direction;
- long-term or significant recurring cost;
- user data handling/privacy;
- legal or compliance exposure;
- the business model;
- irreversible public commitments;
- another genuinely consequential product decision where intent cannot be inferred safely.

Do not ask for approval merely because a decision is non-trivial. Ask when it is consequential.

When several reasonable options exist, make a recommendation and explain the trade-off. If the decision is reversible and within the established product direction, choose a sensible option and proceed.

## Operating behavior

- Keep user interruptions to a minimum.
- Do not send progress messages merely to say that CI is running or that the agent is waiting.
- For deterministic work, implement, validate, monitor required checks, and continue automatically.
- Interrupt only for genuinely consequential questions or when required information is missing.
- Do not promise work for later: perform the work when tools permit it.

## Source of truth

- The GitHub repository `Nabouna32/lab` is the source of truth for the application code.
- Always inspect the current repository state before making a significant change.
- Keep `main` deployable and stable.

## Development loop

For significant changes:

1. Understand the objective and current implementation.
2. Make the smallest coherent change that solves the problem.
3. Run relevant validation immediately.
4. Fix failures and rerun validation.
5. Check for regressions.
6. Commit at a stable milestone.

Avoid accumulating unrelated, untested changes.

## Validation

GitHub Actions is the baseline CI gate:

- `npm ci`
- `npm audit --audit-level=high`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

Node 24 is the production/runtime line. Node 26 is a compatibility check only.

A pull request is not ready to merge while required validation is failing. Never merge known-broken work into `main`.

For larger or risky changes, use a dedicated branch, validate locally, validate GitHub Actions, perform browser/functional verification when relevant, merge only after checks are green, and verify production when applicable.

## Browser and E2E validation

- Playwright provides browser-level smoke/E2E validation.
- Keep the smoke baseline small and reliable.
- Add targeted E2E coverage for important stable user flows.
- Vercel Preview deployments are intentionally disabled for branches and pull requests.
- Browser E2E runs against the Next.js application in GitHub Actions and does not depend on Vercel Preview.
- Production verification remains appropriate for deployment/runtime changes.

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
- Sober and playful interaction modes must remain accessible.
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
- If an idea is clearly useful and low-risk, validate it in the product rather than leaving it as an untracked suggestion.
- Every significant product idea should end in an explicit decision: implement, modify, reject with reason, or defer with reason.
- Do not introduce product behavior solely to satisfy a technical preference.
- Consult `docs/DECISIONS.md` before reversing a durable decision.

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
- Before modifying any Markdown specification, read the existing decisions and preserve them unless an explicit product evolution supersedes them.
- Distinguish clearly between product vision, architecture, foundations/infrastructure, planned functionality and functionality actually completed in code.
- If code diverges from the documented vision, fix the code or document the gap explicitly; never silently redefine the product to match the implementation.
- A genuine change of product vision must be explicit: update the canonical document, record the decision/change, and update all dependent documents consistently.
- Prefer surgical documentation changes over broad rewrites. Preserve historical intent and decision context.
- Before any new implementation, audit the relevant existing Markdown specifications and decisions so implementation follows the documented product direction rather than accidentally redefining it.
