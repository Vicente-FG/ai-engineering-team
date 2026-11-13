# AI Engineering Team

A three-role agent team and a source-backed engineering standards skill, packaged so the same content loads correctly in **Claude Code**, **GitHub Copilot**, **OpenCode**, **JetBrains Junie**, **Cursor** and **OpenAI Codex**.

```text
planner ──▶ codebase-explorer × N ──▶ plan ──▶ [human approval] ──▶ implementer × N ──▶ verifier
```

- **175 rules** across 12 engineering domains, every one traced to a source document that was fetched and verified.
- **163 sources** live: OWASP, NIST, IETF, W3C, CISA, and the published engineering practices of Anthropic, OpenAI, Google, Netflix, Uber, Spotify, Shopify, GitHub, Meta, Airbnb, Stripe and Microsoft.
- **A refresh path**, not a snapshot: one command revalidates every cited URL and flags what has gone stale.

---

## Install

### Claude Code — as a plugin (recommended)

```bash
/plugin marketplace add Vicente-FG/ai-engineering-team
/plugin install ai-engineering-team@vicentefg-tools
```

Or from the shell:

```bash
claude plugin marketplace add Vicente-FG/ai-engineering-team
claude plugin install ai-engineering-team@vicentefg-tools
```

### GitHub Copilot

```bash
gh skill install Vicente-FG/ai-engineering-team engineering-standards          # project scope
gh skill install Vicente-FG/ai-engineering-team engineering-standards --scope user
```

The Copilot custom agents (`planner`, `codebase-explorer`, `implementer`) live in `.github/agents/`. To use them in your own repository, copy that folder across, or run the installer below.

### OpenCode

```bash
cp -R .opencode/agents ~/.config/opencode/agents/
cp -R .opencode/skills ~/.config/opencode/skills/
```

OpenCode also reads `.claude/skills/` and `.agents/skills/` as compatibility roots, so the skill is already available once you copy it.

### JetBrains Junie

```bash
cp -R .junie ~/.junie-project     # or copy .junie/ into your project
cp -R .agents/skills ~/.agents/skills
```

Junie reads `.junie/AGENTS.md` exclusively, or the root `AGENTS.md` combined with `.junie/playbook.md` and `.junie/rules/*.md`. The skill is picked up from `.agents/skills/`.

### Cursor

```bash
cp -R .cursor/rules .cursor/rules
cp -R .agents/skills ~/.agents/skills
```

Cursor reads `.agents/skills/`, `.cursor/skills/` and `.claude/skills/`.

### OpenAI Codex

```bash
cp AGENTS.md ~/.codex/AGENTS.md
```

Codex reads `AGENTS.md` from the project root downwards, plus `AGENTS.override.md` per directory.

### Any tool that reads AGENTS.md

`AGENTS.md` is the portable entry point: Codex, OpenCode, Cursor, Junie, Jules, Aider, goose, Zed, Warp, VS Code, Devin and Copilot all read it. Claude Code reads it too — but only when no `CLAUDE.md` exists, which is why this repository ships both.

### One-command install

```bash
# into the current project
./scripts/install.sh project .
powershell -ExecutionPolicy Bypass -File scripts/install.ps1 -Scope project -Target .

# into your user config, for every tool
./scripts/install.sh user
powershell -ExecutionPolicy Bypass -File scripts/install.ps1 -Scope user
```

---

## What is inside

```text
plugin/agents/                  canonical agent definitions (edit here)
plugin/skills/engineering-standards/   the canonical skill (edit here)
plugin/.claude-plugin/plugin.json
.claude-plugin/marketplace.json  makes the repository a Claude Code marketplace
scripts/build.mjs               regenerates every per-tool file
scripts/lint-skill.mjs          validates the skill and all 175 rule entries
scripts/check-sources.ps1       revalidates every cited URL
                                 (plugin/skills/engineering-standards/scripts/)
scripts/install.ps1 / .sh       installers
AGENTS.md / CLAUDE.md           the shared instructions
```

The per-tool files are **generated**. Edit `plugin/agents/` and `plugin/skills/`, then run:

```bash
node scripts/build.mjs
```

CI runs `node scripts/build.mjs --check` and fails when the generated files drift, so a hand-edited copy cannot slip through.

| Tool | Agents | Skill | Instructions |
|---|---|---|---|
| Claude Code | `.claude/agents/*.md` | `.claude/skills/` | `CLAUDE.md` |
| GitHub Copilot | `.github/agents/*.agent.md` | `.github/skills/`, `.agents/skills/` | `.github/copilot-instructions.md`, `.github/instructions/` |
| OpenCode | `.opencode/agents/*.md` | `.opencode/skills/` | `AGENTS.md` |
| JetBrains Junie | — | `.agents/skills/` | `.junie/AGENTS.md` |
| Cursor | — | `.agents/skills/`, `.claude/skills/` | `.cursor/rules/*.mdc`, `AGENTS.md` |
| OpenAI Codex | — | — | `AGENTS.md` |

---

## The team

| Role | Owns | Never |
|---|---|---|
| `planner` | decomposition, exploration dispatch, the plan, the approval gate | writes code, commits, pushes, deploys |
| `codebase-explorer` | read-only investigation, evidence with file paths | writes files, decides the design |
| `implementer` | the code, the tests, the validation, commit/push/deploy when authorized | rewrites the plan, touches another implementer's files |

**The approval gate is the point.** The planner presents the plan and stops; nothing is written until a human approves it. Complexity drives the fan-out: one file means no exploration, one subsystem means one or two explorers, several subsystems means three or four explorers in parallel plus parallel implementers with disjoint file ownership.

---

## The standards skill

`engineering-standards` is a skill, not a document dump. It holds 175 rules, each with an ID, a one-line instruction addressed to a coding agent, the source it comes from, and the concrete check to perform:

```text
### SEC-09 | Use parameterized queries and APIs for every data or command operation
- Source: Injection Prevention - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html
- Authority: OWASP's official injection-prevention guidance
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: writing or reviewing a query or subprocess call
```

| Domain | Rules | Domain | Rules |
|---|---|---|---|
| security | 44 | testing | 8 |
| architecture | 21 | api-design | 9 |
| ai-engineering | 25 | performance | 5 |
| observability | 18 | accessibility | 6 |
| ai-security | 17 | documentation | 5 |
| development | 11 | release | 6 |

The skill teaches the agent to select only the domains a task touches, read them before writing code, turn each applicable rule into a concrete artifact (a validation, a test, a config default, a doc section), and cite the rule IDs in its report.

---

## Keeping it current

Standards expire: versions get superseded, URLs rot, guidance changes without a new URL.

```bash
powershell -ExecutionPolicy Bypass -File plugin/skills/engineering-standards/scripts/check-sources.ps1
./plugin/skills/engineering-standards/scripts/check-sources.ps1   # no PowerShell? use the .mjs
node plugin/skills/engineering-standards/scripts/check-sources.mjs --json
```

The checker reports every cited URL as reachable, redirected (with its canonical target), dead or errored, flags sources whose verification date is older than 180 days, detects archived or dormant GitHub repositories, and can regenerate the source registry:

```bash
node plugin/skills/engineering-standards/scripts/check-sources.mjs --apply-redirects --write-registry
```

A GitHub Actions workflow runs the same check weekly and publishes the report as an artifact.

---

## Contributing

This repository is a **read-only distribution point**: the maintainer holds the only write access and the default branch is protected. It is a versioned standard, not a community codebase — a change merged casually would silently give installers different rules than their teammates verified.

**Fork it, change it, open a pull request.** Edit only the canonical sources, then run `node scripts/build.mjs` so the generated files stay in sync. A pull request that adds or changes a rule must include the exact source URL, the version or publication date as stated on the page, and the date you verified it.

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT. See [LICENSE](LICENSE).
