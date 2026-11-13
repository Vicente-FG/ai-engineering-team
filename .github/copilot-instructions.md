# Project instructions

This repository ships an AI engineering team and a source-backed standards skill.

## The team

- `planner` - decomposes the work, dispatches explorers, writes the plan and asks for approval.
- `codebase-explorer` - read-only investigation; never writes files.
- `implementer` - writes the code, validates it, and commits, pushes or deploys only when the approved plan authorizes it.

## Rules that change how you work here

- No code is written before a human approves the plan.
- One owner per file: never let two writers touch the same file.
- Load the `engineering-standards` skill before planning or writing non-trivial code, and cite the rule IDs that drove each decision.
- Verify a standard identifier against the published source; never cite one from memory.
- Report the real command and its real output. Never claim a test run that did not happen.

The full instructions are in `AGENTS.md`.
