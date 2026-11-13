# Contributing

This repository is published as a **read-only distribution point**. The maintainer holds the only write access, and the default branch is protected so that no change lands without a reviewed pull request.

That is deliberate: the contents are a versioned standard, not a community codebase. If a change were merged casually, users installing from `main` would silently receive a different set of rules than the ones their teammates verified.

## How to contribute

1. **Fork** the repository to your own account.
2. **Make your change** in the fork. Edit only what belongs to you:
   - `src/agents/*.md` — the canonical agent bodies
   - `src/skills/engineering-standards/references/*.md` — the rules and their sources
   - `src/skills/engineering-standards/SKILL.md` — the skill procedure
   - `src/tools.json` — the per-tool frontmatter rules
3. **Regenerate** the per-tool files: `node scripts/build.mjs`.
4. **Open a pull request** from your fork against this repository's `main`, describing which source you changed and why.

## What a pull request must include

- The **source** change, not only the generated files. Generated files under `.claude/`, `.github/`, `.opencode/` are rebuilt by CI and a PR that edits them by hand will be rejected.
- For a new or changed rule: the **exact source URL**, the version or publication date as stated on the page, and the date you verified it. A rule without a verified source will not be merged.
- The verification note: how you confirmed the source is live and that the rule still matches the current text of the document.

## Maintaining the standards

The standards expire. The refresh procedure lives in `src/skills/engineering-standards/SKILL.md` and is driven by `scripts/check-sources.ps1`:

```powershell
powershell -ExecutionPolicy Bypass -File src/skills/engineering-standards/scripts/check-sources.ps1
```

It reports every cited URL as reachable, redirected, dead or stale, and flags sources whose verification date is older than 180 days. Regenerate the registry with `--write-registry` after updating a source.

## Code of conduct

Be precise and generous with context. A rule that cites a document and names the check it enables is worth more than a paragraph of advice.
