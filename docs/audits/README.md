# Loculary audit reports

This directory stores the historical outputs of autonomous audits defined in `agents/audits/`.

## Historical policy

Audit reports are **append-only historical records**.

When an audit is rerun:

- create a new timestamped report;
- audit the current repository state;
- keep the previous report unchanged;
- explicitly identify findings that disappeared, changed, remain unresolved, or were superseded;
- do not treat an old report as proof that the current code still has the same issue.

Recommended structure:

```
docs/audits/
├── README.md
├── 01-qa-global/
│   ├── LATEST.md
│   └── 2026-10-04T09-30-00Z.md
├── 02-qa-outils/
│   └── ...
└── ...
```

## Report contents

A complete report should normally contain:

1. audit scope and repository commit;
2. environment and tools used;
3. methodology and coverage;
4. observed facts and measurements;
5. deductions;
6. findings classified by severity/type;
7. explicit challenges to the current design;
8. proposed improvements/refactors;
9. elements to preserve;
10. decisions requiring validation;
11. verification/test recommendations;
12. the autonomous implementation-agent prompt;
13. a concise conclusion.

The report may reference code and documentation, but it should remain understandable as a historical snapshot.

## Latest pointer

`LATEST.md` is optional and replaceable. It is only an index to the most recent report. It must never contain the only copy of audit findings.
