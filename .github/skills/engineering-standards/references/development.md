# Development Workflow

Rules for branching, commits, versioning, build tooling and dependency management. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### TRUNK-BASED | Merge to the main branch many times per day and keep the branch always releasable
- Source: Introduction (trunkbaseddevelopment.com)
- URL: https://trunkbaseddevelopment.com/
- Authority: the reference site for trunk-based development, maintained by the practitioners who popularised it against long-lived branching
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: setting up branching or reviewing a branch strategy — confirm branches live for hours, not weeks, and that the trunk is protected by CI

### GH-FLOW | Use the GitHub Flow loop: branch from main, open a pull request, review, merge, deploy
- Source: GitHub flow (GitHub Docs)
- URL: https://docs.github.com/en/get-started/using-github/github-flow
- Authority: GitHub's own product documentation for the branch-and-pull-request workflow it supports
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: creating a branch or pull request — confirm it targets `main`, is named for the change, and is merged (not left open) once CI is green

### CONV-COMMIT | Write commit messages in Conventional Commits format so tooling can generate changelogs and bump versions automatically
- Source: Conventional Commits 1.0.0
- URL: https://www.conventionalcommits.org/en/v1.0.0/
- Authority: the specification itself, published by the conventional-commits organisation and consumed by commitlint, semantic-release and conventional-changelog
- Version/date: 1.0.0
- Verified on: 2026-11-05
- Apply when: writing a commit message — check the `type(scope): description` shape and that the type is one of the specified values, so release tooling can parse it

### SEMVER | Version releases as MAJOR.MINOR.PATCH and treat each part with its documented meaning
- Source: Semantic Versioning 2.0.0
- URL: https://semver.org/
- Authority: the SemVer specification that npm, Maven, Cargo and most package ecosystems implement
- Version/date: 2.0.0
- Verified on: 2026-11-05
- Apply when: deciding a version bump — confirm a breaking change is MAJOR, a backward-compatible feature is MINOR, and a backward-compatible fix is PATCH; verify the public API surface is what actually changed

### KEEPACHANGELOG | Maintain a human-readable changelog organized by Added/Changed/Deprecated/Removed/Fixed/Security per release
- Source: Keep a Changelog
- URL: https://keepachangelog.com/en/1.1.0/
- Authority: the format specification adopted by many open-source projects and by release-note tooling
- Version/date: 1.1.0
- Verified on: 2026-11-05
- Apply when: producing a release — confirm the changelog has a version heading with a release date and uses the prescribed categories, and that every user-visible change appears under one of them

### SEMANTIC-RELEASE | Let version bumps and release notes be derived from commit history rather than hand-edited
- Source: semantic-release (GitHub repository)
- URL: https://github.com/semantic-release/semantic-release
- Authority: the tool that implements the Conventional Commits → SemVer pipeline and publishes releases to npm and GitHub Releases
- Version/date: repository page as fetched; 24,159 stars observed on the repo page
- Verified on: 2026-11-05
- Apply when: setting up release automation — confirm the commit-analysis plugin, the release branches and the npm/GitHub publishing steps are configured, and that CI runs it on the release trigger

### CHANGESETS | Keep version bumps as explicit, reviewable changeset files in the pull request instead of deriving them from labels
- Source: changesets (GitHub repository)
- URL: https://github.com/changesets/changesets
- Authority: the tool used by many monorepos to manage versioning across packages with a per-package changelog
- Version/date: repository page as fetched; 12,558 stars observed on the repo page
- Verified on: 2026-11-05
- Apply when: changing a published package in a monorepo — require a changeset file describing the bump and the user-visible change, and verify the `changeset version` + `changeset publish` steps run in CI

### BAZEL | Describe builds as hermetic, reproducible targets with declared dependencies instead of ad-hoc shell scripts
- Source: { Fast, Correct }: Choose two — Bazel Documentation
- URL: https://bazel.build/
- Authority: Bazel's own documentation and the `bazelbuild/bazel` repository (26,054 stars observed on the repo page)
- Version/date: repository page as fetched; 26,054 stars observed on the repo page
- Verified on: 2026-11-05
- Apply when: adding a build target or a dependency — confirm inputs are declared, external dependencies are pinned, and the build is reproducible on a clean checkout

### PRECOMMIT | Run fast, local format-and-lint checks in a pre-commit hook so broken style never reaches CI
- Source: pre-commit
- URL: https://pre-commit.com/
- Authority: the tool's own documentation, which defines the hook lifecycle, the `pre-commit` framework and its use with repository-local configurations
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding a linter or formatter — wire it into `.pre-commit-config.yaml` with a pinned `rev`, and confirm it runs locally before the commit is created

### COMMITLINT | Enforce the Conventional Commits format on commit messages with a linter, failing the commit rather than warning
- Source: commitlint (GitHub repository)
- URL: https://github.com/conventional-changelog/commitlint
- Authority: the reference linter for Conventional Commits, used by the conventional-changelog toolchain
- Version/date: repository page as fetched; 18,802 stars observed on the repo page
- Verified on: 2026-11-05
- Apply when: adding commit-message validation — confirm a `commitlint.config.js` (or equivalent) exists, is run in the pre-commit hook or CI, and rejects malformed messages

### RENOVATE | Automate dependency updates with a bot that opens version-bump pull requests per dependency
- Source: Renovate Docs
- URL: https://docs.renovatebot.com/
- Authority: the tool's own documentation, which defines the managed-update model, grouping and pinning behaviour
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: dependencies are added or upgraded — confirm `renovate.json` pins the update policy, groups related packages, and that a scheduled job opens the upgrade PR with the changelog attached
