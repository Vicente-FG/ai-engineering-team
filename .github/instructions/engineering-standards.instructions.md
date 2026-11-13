---
applyTo: "**/*"
---

# Engineering standards

This repository ships the `engineering-standards` skill in `.github/skills/engineering-standards/`
(and in `.agents/skills/`, `.claude/skills/` and `.opencode/skills/`).

- Load it before planning or writing non-trivial code.
- Read only the domain files the task touches: security, architecture, development, testing,
  api-design, performance, accessibility, documentation, release, observability, ai-engineering, ai-security.
- Turn each applicable rule into a concrete artifact (a validation, a test, a config default, a doc section).
- Cite the rule ID next to the decision it drove, and flag the rules you could not satisfy.
