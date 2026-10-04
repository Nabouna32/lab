# Meta-Agent completion gate — checkpoint

- role: Meta-Agent
- mission: agent-system — enforce terminal checkpoint cleanup before mission completion
- issue: #305
- branch/ref: chore/terminal-checkpoint-gate
- base SHA: fc58523d61e05242db08ba60873129446e2ad8fd
- current state: IMPLEMENTING
- validated scope: harden terminal checkpoint cleanup, Issue completion ordering, and final PR verification
- completed milestones: root cause identified; cold-recovery test confirms #302 checkpoint is now absent from main
- current action: update completion contracts to make checkpoint cleanup an explicit terminal gate
- next action: inspect diff, validate documentation consistency, open PR, run CI, merge, then verify Issue/checkpoint state
- decisions already validated: no second memory system; checkpoints are temporary mission state; terminal missions must not leave active checkpoints
- important files: agents/HANDOFF-CONTRACT.md; agents/ISSUE-ORCHESTRATION-CONTRACT.md
- tests/checks: cold-recovery verification for #302 passed; checkpoint path returns NOT_FOUND on main
- last durable commit SHA: fc58523d61e05242db08ba60873129446e2ad8fd
- timestamp: 2026-10-04
