# Documentation

Rules for the structure, ownership and review of documentation. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### DIATAXIS | Split documentation into four distinct types — tutorials, how-to guides, reference and explanation — and never blend them in one page
- Source: Diátaxis
- URL: https://diataxis.fr/
- Authority: the framework's own site, the definitive statement of the documentation-type model
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: writing or reorganizing docs — confirm the page has exactly one dominant type; if it mixes tutorial steps with reference tables, split it

### DOCS-AS-CODE | Keep documentation in the repository, reviewed and versioned with the code, and publish it automatically
- Source: docs-as-code
- URL: https://docs-as-code.com/
- Authority: the reference site for the docs-as-code movement, describing how docs live beside the code in version control and are built by CI
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding documentation — put it in the repository next to the code, wire it into the docs build, and require the same review as a code change

### ADR-COGNITECT | Record architecturally significant decisions as ADRs with context, options, decision and consequences
- Source: Documenting Architecture Decisions (Cognitect)
- URL: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- Authority: the article that introduced the ADR format still in use by adr.github.io and most ADR tooling
- Version/date: 2011-11-15
- Verified on: 2026-11-05
- Apply when: choosing an approach that would be expensive to reverse — write an ADR with the forces, considered options, decision and consequences, and link it from the code or the PR

### PEP257 | Write docstrings that state the contract, the arguments, the return value and the raised exceptions
- Source: PEP 257 — Docstring Conventions
- URL: https://peps.python.org/pep-0257/
- Authority: the Python Enhancement Proposal that defines the language's own docstring convention and is the reference for Python docstring tooling
- Version/date: PEP 257 (accepted; status as stated on the page)
- Verified on: 2026-11-05
- Apply when: writing a public function, class or module — add a docstring in the prescribed sections and verify it appears in the generated API documentation

### GH-README | Write a README that states what the project is, how to install and run it, and how to get help
- Source: About the repository README file (GitHub Docs)
- URL: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- Authority: GitHub's own documentation on the purpose and structure of a repository README
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: creating or updating a repository README — confirm it covers what the project does, installation, a minimal usage example and where to file issues; keep it in sync with the actual commands
