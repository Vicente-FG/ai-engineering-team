# Architecture and Engineering Practice at Scale

Rules for system structure, service boundaries, resilience patterns and the organizational decisions that large engineering teams have published. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### 12F-CFG | Read configuration from environment variables, never from a file committed to the repository
- Source: The Twelve-Factor App — Config
- URL: https://12factor.net/config
- Authority: the canonical 12-factor definition, authored by the platform's creators and cited by Heroku/Cloud Foundry as the reference implementation contract
- Version/date: site-wide notice "Last updated 2017"; factor XI (Config) is the current text
- Verified on: 2026-11-05
- Apply when: adding a setting — reject any new constant or config file in the repo; confirm the value is read from `os.environ`/`process.env` and that secrets are absent from the working tree

### 12F-DISP | Make every process disposable: start fast, shut down fast, and survive an abrupt kill
- Source: The Twelve-Factor App — Disposability
- URL: https://12factor.net/disposability
- Authority: canonical 12-factor contract; factor IX defines the process lifecycle every deployable unit must honour
- Version/date: site-wide notice "Last updated 2017"; factor IX (Disposability) is the current text
- Verified on: 2026-11-05
- Apply when: adding a long-running worker, consumer or server — confirm it handles SIGTERM, has a bounded startup path, and holds no state that cannot be rebuilt

### FOWLER-MS | Organize a service boundary around business capabilities, give each service its own data, and automate its deployment
- Source: Microservices (Martin Fowler and James Lewis)
- URL: https://martinfowler.com/articles/microservices.html
- Authority: the most-cited microservices definition, written by the author whose site is the de facto reference for software architecture
- Version/date: 25 March 2014
- Verified on: 2026-11-05
- Apply when: proposing or reviewing a service split — check that the boundary follows a business capability, that data ownership is not shared, and that CI/CD for the service is automated

### FOWLER-MONO | Default to a modular monolith and split into services only when a concrete scaling or ownership pressure demands it
- Source: Monolith First (Martin Fowler)
- URL: https://martinfowler.com/bliki/MonolithFirst.html
- Authority: Fowler's explicit stance, referenced by nearly every engineering organisation that has since published monorepo retrospectives
- Version/date: 3 June 2015
- Verified on: 2026-11-05
- Apply when: a design proposes introducing microservices — require a stated trigger (team autonomy, independent scaling, deployment isolation) before accepting the added operational cost

### HEX-PORTS | Put domain logic at the centre and push frameworks, I/O and databases to the edges as replaceable adapters
- Source: Hexagonal architecture (Alistair Cockburn)
- URL: https://alistair.cockburn.us/hexagonal-architecture/
- Authority: the original "ports and adapters" article by the pattern's inventor; the pattern still named after it
- Version/date: page `dateModified` 2025-04-18 (original pattern post dated 2005)
- Verified on: 2026-11-05
- Apply when: creating a module or service — confirm the core has no framework, ORM, HTTP or filesystem imports, and that every external call goes through a port defined by the core

### BOUNDED-CTX | Declare a bounded context and give it its own model instead of sharing one across the whole system
- Source: Bounded Context (Martin Fowler)
- URL: https://martinfowler.com/bliki/BoundedContext.html
- Authority: Fowler's entry for the core DDD concept, with links to the original Domain-Driven Design material
- Version/date: 15 January 2014
- Verified on: 2026-11-05
- Apply when: two modules need different shapes of the same concept — verify each has a distinct model and that translation happens at an explicit boundary, not by sharing an entity class

### DB-PER-SVC | Give each service exclusive ownership of its data and access it only through that service's API
- Source: Pattern: Database per service (microservices.io)
- URL: https://microservices.io/patterns/data/database-per-service.html
- Authority: the reference implementation catalog for microservices patterns, maintained as the working companion to Richardson's pattern catalogue
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: a new service needs data that another service also reads — forbid direct cross-service table access and require an API or event contract instead

### IDEMPOTENT-CONS | Make every message handler idempotent so a redelivered message cannot cause a second side effect
- Source: Pattern: Idempotent Consumer (microservices.io)
- URL: https://microservices.io/patterns/communication-style/idempotent-consumer.html
- Authority: the reference microservices pattern catalog entry for message-driven reliability
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: writing a queue or event subscriber — require a deduplication key with a store (or a naturally idempotent update) before any state mutation, and confirm the handler tolerates at-least-once delivery

### CIRCUIT-BREAKER | Wrap every remote call in a circuit breaker that fails fast instead of exhausting the caller's thread pool
- Source: Pattern: Circuit Breaker (microservices.io)
- URL: https://microservices.io/patterns/reliability/circuit-breaker.html
- Authority: reference microservices pattern catalog; the canonical implementation of the breaker described in Richardson's catalogue
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding an outbound HTTP/RPC dependency — confirm a breaker with closed/open/half-open transitions and a timeout exists, and that a dependency can never block the whole request path

### BACKOFF-JITTER | Retry transient failures with exponential backoff plus full jitter, cap the attempts, and retry only idempotent operations
- Source: Exponential Backoff And Jitter (AWS Architecture Blog)
- URL: https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
- Authority: AWS's own architecture blog, the origin of the widely implemented "full jitter" retry formula
- Version/date: date not stated on the page as fetched
- Verified on: 2026-11-05
- Apply when: adding a retry loop — confirm randomized full-jitter backoff rather than a fixed sleep, a bounded attempt count, and that the operation is safe to repeat

### BULKHEAD | Isolate each dependency into its own thread pool, connection pool or worker so one slow service cannot starve the rest
- Source: Bulkhead Pattern — Azure Architecture Center
- URL: https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead
- Authority: Microsoft's official cloud architecture pattern catalog, maintained by the Azure architecture center
- Version/date: page `ms.date` 2026-03-19
- Verified on: 2026-11-05
- Apply when: adding a call to a shared downstream service — confirm per-dependency concurrency limits and bulkhead isolation rather than one unbounded shared pool

### NETFLIX-KV | Give each data access pattern its own storage abstraction instead of forcing one datastore for every workload
- Source: Introducing Netflix's Key-Value Data Abstraction Layer (Netflix TechBlog)
- URL: https://netflixtechblog.com/introducing-netflixs-key-value-data-abstraction-layer-1ea8a0a11b30
- Authority: Netflix's own engineering blog describing the production system behind its polyglot persistence layer
- Version/date: `datePublished` 2024-09-18
- Access: bot-blocked (Medium-hosted netflixtechblog.com returns 403 to non-browser clients; verified in a browser on 2026-11-05)
- Verified on: 2026-11-05
- Apply when: choosing storage for a new feature — confirm the choice follows the access pattern (key-value, time-series, graph, relational) and that the choice is hidden behind an abstraction the domain owns

### GH-MERGEQ | Land changes through a merge queue that re-tests each change against the current trunk tip before merging
- Source: How GitHub uses merge queue to ship hundreds of changes every day (GitHub Engineering Blog)
- URL: https://github.blog/engineering/engineering-principles/how-github-uses-merge-queue-to-ship-hundreds-of-changes-every-day/
- Authority: GitHub's own engineering blog documenting the production merge queue GitHub runs on its own repository
- Version/date: 2024-03-06
- Verified on: 2026-11-05
- Apply when: adding or changing CI for a repository — confirm merges are gated on a queue that re-runs CI against the latest trunk, not on a stale per-PR result

### GOOGLE-SMALL-CL | Keep every change small enough that a reviewer can read it in one sitting and approve it within hours
- Source: Small CLs (Google Engineering Practices)
- URL: https://google.github.io/eng-practices/review/developer/small-cls.html
- Authority: Google's official code review developer guide, published from the `google/eng-practices` repository (23,279 stars, archived 2024-09-19)
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: splitting or reviewing a pull request — check the diff size and that the change does one thing; split unrelated edits before requesting review

### GOOGLE-CRR | Review every change for design, correctness and readability, and approve it only when you understand it well enough to defend it
- Source: The Standard of Code Review (Google Engineering Practices)
- URL: https://google.github.io/eng-practices/review/reviewer/standard.html
- Authority: Google's official reviewer-side guide from the `google/eng-practices` repository
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: approving a change — confirm the review covered design, functionality, complexity, tests, naming and comments, and that the author responded to every comment

### UBER-RETRY | Own retryable errors at the producing service so a retry storm cannot be triggered downstream
- Source: How Uber Protects Against Retry Storms (Uber Engineering Blog)
- URL: https://www.uber.com/us/en/blog/protecting-against-retry-storms/
- Authority: Uber's own engineering blog describing the production mechanism behind its at-least-once retry guarantee
- Version/date: September 17, 2026
- Access: bot-blocked (uber.com returns 406 to non-browser clients; verified with a browser user-agent on 2026-11-05)
- Verified on: 2026-11-05
- Apply when: reviewing a service that returns 5xx to callers — confirm the service distinguishes retryable from terminal errors and shifts the retryable error to the caller instead of re-issuing it internally

### UBER-MONOREPO | Consolidate a growing multi-repo codebase into one monorepo with shared build and dependency management
- Source: The Journey To Android Monorepo: The History Of Our Journey Into Monorepo (Uber Engineering Blog)
- URL: https://www.uber.com/us/en/blog/android-engineering-code-monorepo/
- Authority: Uber's own engineering blog documenting its real migration from many repositories to a monorepo
- Version/date: May 11, 2017
- Access: bot-blocked (uber.com returns 406 to non-browser clients; verified with a browser user-agent on 2026-11-05)
- Verified on: 2026-11-05
- Apply when: repository sprawl appears — confirm the proposal includes a plan for shared build tooling, dependency upgrades and ownership rules inside a single repository

### SPOTIFY-AI-QUALITY | Raise engineering quality gates and review depth as AI-authored code volume increases, instead of lowering the bar
- Source: AI Changed How Spotify Builds. What We Learned (and Fixed) About Quality at Higher Velocity (Spotify Engineering Blog)
- URL: https://engineering.atspotify.com/2026/9/ai-changed-how-spotify-builds-what-we-learned-and-fixed-about-quality-at-higher-velocity
- Authority: Spotify's own technology blog, reporting production scale (777M MAU, ~11-12M backend requests/sec, ~3,000 production services)
- Version/date: September 16, 2026
- Verified on: 2026-11-05
- Apply when: AI assists in producing a change — confirm the same test, review and observability gates are applied as for hand-written code, with no unreviewed AI output merged

### SHOPIFY-MONOLITH | Decompose a monolith into bounded modules that maximize developer productivity, not into independently deployed services
- Source: Deconstructing the Monolith: Designing Software that Maximizes Developer Productivity (Shopify Engineering)
- URL: https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity
- Authority: Shopify's own engineering blog describing the refactor of one of the largest Ruby on Rails codebases
- Version/date: published Feb 21, 2019
- Verified on: 2026-11-05
- Apply when: planning a large-codebase refactor — confirm the target is a modular monolith with explicit module boundaries and that the metric of success is developer productivity

### META-RELIABILITY | Engineer for known peak events: rehearse the traffic spike, then ship with automated reliability safeguards
- Source: 2026 World Cup: Breaking Records, Spiky Charts and Reliability at Scale (Meta Engineering Blog)
- URL: https://engineering.fb.com/2026/10/15/production-engineering/2026-world-cup-record-traffic-reliability-at-scale/
- Authority: Meta's own engineering blog reporting how it absorbed a predictable, extreme global traffic spike
- Version/date: 2026-10-15
- Verified on: 2026-11-05
- Apply when: a launch or event will cause an order-of-magnitude traffic spike — confirm load tests, autoscaling and degradation paths exist before the event date

### AIRBNB-AUTH | Design authentication for the real access pattern of a two-sided marketplace rather than for a per-session web app
- Source: Flexible Authentication: Reimagining authentication for millions of users at Airbnb (Airbnb Engineering & Data Science)
- URL: https://airbnb.tech/uncategorized/flexible-authentication-reimagining-authentication-for-millions-of-users-at-airbnb/
- Authority: Airbnb's own engineering blog describing the production authentication system behind its marketplace
- Version/date: date not stated on the page as fetched
- Verified on: 2026-11-05
- Apply when: designing login, session or token handling — check that token lifetime, refresh and revocation match the real access pattern, and that a failed login degrades gracefully instead of blocking revenue paths

## Cross-cutting rules

1. Default to a modular monolith; require a stated trigger before splitting into services (FOWLER-MONO, SHOPIFY-MONOLITH, FOWLER-MS).
2. Give each service its own data and talk to it only through its contract (DB-PER-SVC, BOUNDED-CTX).
3. Keep the domain at the centre and frameworks at the edges (HEX-PORTS, 12F-CFG).
4. Every remote call needs a timeout, a bounded retry with jitter, and an isolation boundary (CIRCUIT-BREAKER, BACKOFF-JITTER, BULKHEAD).
5. Every message handler must be idempotent and every process disposable (IDEMPOTENT-CONS, 12F-DISP).
6. Measure quality gates, not velocity, and never lower them because a change was machine-authored (SPOTIFY-AI-QUALITY, GOOGLE-CRR, GOOGLE-SMALL-CL).
7. Choose storage by access pattern and hide it behind a domain-owned abstraction (NETFLIX-KV).
8. Land changes through a queue that re-tests against the current trunk (GH-MERGEQ).

## Deliberately excluded sources

Attempted and unverifiable at the time of writing; re-test them on the next refresh.

- Netflix "How we build code at Netflix" (paved roads) — not present in the blog's own sitemap and unreachable from this network; the key-value abstraction post is cited instead.
- Spotify model gateway post — HTTP 308 with an unresolvable redirect target.
- Google Testing Blog "code coverage best practices" and "test size" — HTTP 404, those permalinks moved.
- microservices.io retry pattern — HTTP 404; retry guidance is cited from AWS instead.
- github.com/anthropics/rfcs and github.com/Netflix/chaos-monkey — HTTP 404 / connection reset.
- AWS Well-Architected marketing landing page — not fetched; the framework document under docs.aws.amazon.com was fetched instead.
