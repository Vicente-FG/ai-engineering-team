---
name: engineering-standards
description: |
  Apply verified state-of-the-art engineering standards — security, architecture, development workflow, testing, API design, performance, accessibility, observability and AI engineering — while planning, writing or reviewing code, and refresh the cited sources when they drift or expire. Load this skill when the user says "follow best practices", "apply the standards", "is this production ready", "review this against the guidelines", "check the security of", "update or refresh the standards", or when a non-trivial change touches production code, an API, authentication, personal data or an LLM-backed feature. Do NOT use it for trivia, syntax questions, dependency version lookups, or prose-only work where no code behavior changes.
---

# Engineering Standards

A curated, source-backed standard set. Every rule carries an ID, a one-line instruction and the authoritative document it came from, so any claim can be checked against the original source instead of trusted on faith.

## Inputs to collect

- **Stack and runtime**: language, framework, deployment target. Some rules are stack-specific (the performance and accessibility sets lean web).
- **Risk tier**: what the code touches and what a failure costs. Internet-facing code or personal data means the security set is mandatory, not optional.
- **Domains in scope**: pick only the reference files the task actually touches. Loading every file wastes context and dilutes attention.

If the stack or risk tier is unclear and would change the answer, ask one question. Otherwise state the assumption in a line and continue.

## Reference map

| File | Domains | Load when |
|---|---|---|
| `references/security.md` | Application security, identity and access, supply chain, secrets, privacy | any auth, user input, external dependency, deployment or personal data |
| `references/architecture.md` | Modularity, integration patterns, resilience, scaling, service design | designing or restructuring a service, adding a dependency, splitting a module |
| `references/development.md` | Git and branching, commits, reviews, code quality, dependency management | any change that ends in a commit |
| `references/testing.md` | Strategy, test doubles, contract and property testing, flakiness | adding or changing behavior |
| `references/api-design.md` | REST, resource modeling, versioning, errors, pagination, webhooks | public or shared API surface |
| `references/performance.md` | Latency, caching, queries, bundles, load and cost | user-facing latency, data volume, cost per request |
| `references/accessibility.md` | WCAG, ARIA, keyboard, contrast, i18n and l10n | any user interface |
| `references/documentation.md` | Docs structure, ADRs, changelogs | user-facing or contributor-facing docs |
| `references/release.md` | Versioning, SBOM, signing, rollout and rollback | tagging, publishing, deploying |
| `references/observability.md` | Logging, metrics, traces, SLIs and SLOs, incidents | anything that runs in production |
| `references/ai-engineering.md` | Agent design, tool interfaces, context management, evals, MCP | LLM features, agent workflows, prompt engineering |
| `references/ai-security.md` | LLM threats, prompt injection, agent permissions, governance, regulation | LLM features and any agent with real-world capability |
| `references/sources.md` | Full registry: every cited source with version and verification date | auditing citations, refreshing, retiring rules |

Entry format used in every reference file:

```
### SEC-01 | <one-line instruction addressed to a coding agent>
- Source: <official title>
- URL: <exact URL>
- Authority: <why this source is authoritative>
- Version/date: <as stated on the page>
- Verified on: <YYYY-MM-DD>
- Apply when: <the concrete check to perform>
```

## Procedure

1. **Select the domains** using the map above. Two or three files is typical; more than five usually means the task is too broad to apply standards meaningfully.
2. **Read those files before writing code**, not after. Rules read after implementation degrade into a list of regrets.
3. **Verify every standard identifier you cite against the authoritative file**, not from memory. Fetch the published requirement list (the ASVS CSV, the RFC text, the WCAG success criteria) and confirm the exact identifier exists before writing it down. A plausible-looking but wrong identifier is worse than no identifier, because it looks checkable.
4. **Turn rules into constraints during planning.** For each applicable rule, name the artifact it produces: a validation at the boundary, a test, a config default, a doc section. A rule with no artifact in the plan is not being applied.
5. **Apply them in the code** as you write it, following the project's existing conventions instead of imposing a new style on it.
6. **Cite the rule IDs in the report** — `SEC-04, PERF-11` next to the decision each one drove. Cheap to review, and it exposes the rules nobody checked.
7. **Flag what you skipped and why.** Silence about an unapplied rule reads as compliance.

## Applying by role

| Role | Focus |
|---|---|
| Planner | security, architecture, testing, release, observability — these reshape the plan itself: validation points, module boundaries, test layers, rollout steps, telemetry |
| Implementer | every domain in scope, expressed as code, tests and config, using the project's own tooling |
| Reviewer | security, testing, API design, release — using each rule's "Apply when" line as the review question |

## Bundled scripts

| Script | Use it for |
|---|---|
| `scripts/check-sources.ps1` | Refreshing the standards: liveness, redirects, staleness, repo obsolescence, and regenerating `references/sources.md` |
| `scripts/pin-requirements.py` | Building a hash-pinned requirements file (`name==version --hash=sha256:...`) from the PyPI JSON API, so a tampered artifact fails the install (SEC-28) |

`pin-requirements.py` needs Python 3.8+ and only the standard library; it reads the PyPI JSON API and writes the file you name, without touching the system environment.

## Refresh procedure

Standards expire: versions get superseded, URLs rot, guidance changes without a new URL. Refresh monthly, and always before quoting a rule in a decision that carries real risk.

1. **Check liveness and drift** — deterministic, no model tokens:

   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/check-sources.ps1
   ```

   Run it from the skill directory (the path in the `skill` tool's `Location:` header). It reports every cited URL as reachable, redirected with its canonical target, dead or errored, and flags sources whose `Verified on` date is older than 180 days. Exit code is non-zero when something needs attention.

2. **Re-verify whatever the script flagged.** Fetch the source, confirm the rule still matches the current text, then update `Version/date` and `Verified on` in the reference file. If the guidance itself changed, update the rule and say so in the report.

3. **Sweep for new sources.** Per domain, search the canonical source: the standards body's own site, the vendor's engineering blog, and the repository behind the rule. Fetch every candidate before citing it — a search snippet is not a source. Prefer the primary document over commentary about it.

4. **Add entries in the established shape**, continuing the ID prefix of the file, and place each entry where it belongs instead of appending to the end.

5. **Update `references/sources.md`** so the registry, the rule files and the script agree.

6. **Report the refresh**: what was added, what changed, what was retired, and the verification date per source. A refresh that silently rewrites files is indistinguishable from a mistake.

## Output contract

Applying standards — the report contains:

- the domains loaded and the rule IDs that applied,
- for each applied rule, the concrete artifact it produced (file, test, config, doc),
- the rules deliberately skipped and the reason,
- unresolved risks with the rule ID that covers each.

Refreshing — the report contains: added, updated, retired, and the verification date per source.

## Failure handling

- A source will not load → do not cite it. Report it as unverifiable and keep the current entry until it is confirmed dead.
- The project already violates a rule → do not silently refactor. Note it as a finding, fix only what the task covers, and put the rest in the report.
- Two rules conflict → prefer the more specific standard (a framework spec beats a general guide) and state the conflict in the report.
- A rule's identifier cannot be confirmed against the published source → cite the rule without the identifier and say the identifier could not be verified, rather than reproducing an identifier from memory.
- A reference file is missing or stale → say so, then continue with the domains you can read.

## Windows (win32) platform notes

`node` is usually not on PATH here. `scripts/check-sources.ps1` resolves a runtime itself: it uses `node` when present and otherwise falls back to the Node runtime bundled with the MiniMax Code desktop app:

```powershell
$env:ELECTRON_RUN_AS_NODE = '1'
& "$env:LOCALAPPDATA\Programs\MiniMax Code\MiniMax Code.exe" "<skill-dir>\scripts\check-sources.mjs"
```

Launch the `.ps1` rather than the `.mjs` so the fallback works. The script itself is cross-platform; only the launcher differs.
