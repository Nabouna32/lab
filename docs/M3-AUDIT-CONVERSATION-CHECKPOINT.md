# Material 3 audit — historical checkpoint

**Status:** superseded by the canonical audit documents. This short file remains only as a historical signpost; it is not an active source of requirements or next steps.

## Sources of truth

- [Design direction and accepted product decisions](./DESIGN-SYSTEM.md) and DEC-026 in [the decision register](./DECISIONS.md).
- [Material 3 web conventions](./M3-CONVENTIONS.md) — canonical implementation and adaptation conventions.
- [Material 3 conformance audit](./M3-CONFORMANCE-AUDIT.md) — findings, evidence, open gaps and verification status.
- [Component inventory](./M3-COMPONENT-INVENTORY.md) — API/component-family coverage and audit progress.
- [Issue #731](https://github.com/Nabouna32/lab/issues/731) — mission-level progress and decisions; verify its current live state before resuming.
- The repository's current branch, pull requests and CI runs are authoritative for implementation and delivery status.

## Historical context

This checkpoint was created on 2026-10-15 to carry the Material 3 / Pixel fidelity audit across conversations. It recorded the selected Fidelity direction, source-evidence rules, component-by-component reviews, unresolved browser/accessibility checks, and the progression from PR #723 (closed without merging) to PR #729. Those PR and CI details are historical snapshots, not current instructions; consult GitHub for their present state.

The detailed component/source audit, official references, verification discipline and user-reported Design Lab findings have been transferred to or are maintained in the canonical documents above. Do not duplicate detailed findings here.

## Resume protocol

1. Read the current state of Issue #731 and the latest relevant pull requests/CI runs.
2. Read the canonical audit and conventions above; identify the next unresolved, evidence-backed priority.
3. Inspect current source, production call sites, tests and official version-pinned references before proposing changes.
4. Keep source observations, inferences, user-approved decisions and missing runtime/browser verification clearly distinct.
5. Do not infer visual, responsive, keyboard, screen-reader or contrast conformance from source inspection or a green CI run alone.
