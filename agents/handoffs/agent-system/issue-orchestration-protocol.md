# Issue orchestration — checkpoint

- role: agent-system
- mission: issue-orchestration-protocol
- branch/ref: chore/issue-orchestration-protocol
- base: main
- current state: IMPLEMENTING
- validated scope: define shared GitHub Issue lifecycle, label conventions, ownership/recovery rules, automation boundaries and GitHub Project policy; integrate only where necessary
- completed: orchestration contract added; common agent contract references it
- current action: verify branch scope and open PR
- next action: inspect changed files, run validation via CI, merge if green
- decisions: Issues remain tracking/index layer; Git/docs/handoffs/reports/PRs remain authoritative; Projects optional
- blockers: connector does not expose Project-specific operations or label-creation operation
- tests: not yet run
- last durable commit: 2de44e11c4b97a601f39e474fb1e1cc676a74302
- timestamp: 2026-10-04
