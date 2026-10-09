# Loculary audit procedures

All audit procedures inherit the mandatory rules in agents/AGENT-CONTRACT.md. The common contract defines bootstrap, challenge, source precedence, verification and continuity; agents/PRODUCT-ISSUE-CONTRACT.md defines mission checkpointing; agents/AUDIT-CONTRACT.md defines audit-specific evidence and reporting rules.

Each Markdown file in this directory is a reusable audit procedure for the same assistant. Read agents/AUDIT-CONTRACT.md before executing a mission. A mission may add domain-specific checks but cannot weaken the common contract.

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