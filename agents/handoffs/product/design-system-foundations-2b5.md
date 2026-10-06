# Product / Direction checkpoint — design-system-foundations-2b5

- role and mission: Product / Direction; Issue #369 — define the concrete Loculary design-system specification.
- branch/ref and current base SHA: product/design-system-foundations-2b5; main currently at 3d2e0f60a7abde8a89191013225bc674102e46a7.
- current state: RUNNING
- validated scope: Step 2B.5 — document the motion-system foundation only; no application-code implementation.
- completed milestones: mandatory bootstrap and concurrency check completed; Steps 2A–2B.4 are already merged on main.
- current action: update docs/DESIGN-SYSTEM.md section 8 to make the motion vocabulary more concrete while keeping exact durations/easing recipes open.
- next action: inspect diff, verify documentation consistency, then create PR and run required checks.
- decisions already validated: DEC-046/047 Expressive Utility; rich-by-default; decorative/aesthetic motion is valid; optimize before suppressing; reduced motion is an accessibility adaptation; tool-specific motion is allowed; target architecture is foundations → behavior → composition → tool.
- decisions still blocked: exact motion durations, easing curves, intensity values and concrete signature recipes remain open.
- challenge performed: challenge the initial temptation to lock current 120/180/240ms values; outcome: preserve semantic motion grammar first and defer concrete values until representative implementation evidence. Also challenge animation bloat; outcome: use a small vocabulary and explicit anti-noise/performance/accessibility guardrails.
- important files/areas touched: docs/DESIGN-SYSTEM.md only.
- tests/checks: documentation-only; GitHub required checks will be verified on PR.
- last durable commit SHA: 3d2e0f60a7abde8a89191013225bc674102e46a7.
- timestamp: 2026-10-06T18:20:00Z
