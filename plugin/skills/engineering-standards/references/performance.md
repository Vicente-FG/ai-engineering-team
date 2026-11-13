# Performance

Rules for latency, caching, query cost and measurable budgets. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### WEB-VITALS | Measure and guard Core Web Vitals (LCP, INP, CLS) against the published thresholds on every release
- Source: Web Vitals (web.dev)
- URL: https://web.dev/articles/vitals?hl=es-419
- Authority: Google/web.dev, the authoritative publisher of the Core Web Vitals metric definitions and thresholds used by Chrome tooling
- Version/date: 2024-10-31
- Verified on: 2026-11-05
- Apply when: shipping a front-end change — confirm LCP, INP and CLS are measured in the field or in CI against the documented thresholds, and that a regression blocks the release

### PERF-BUDGETS | Set an explicit performance budget (bundle bytes, request count, timing thresholds) and fail the build when it is exceeded
- Source: Performance budgets 101 (web.dev)
- URL: https://web.dev/articles/performance-budgets-101?hl=id
- Authority: web.dev's guidance on defining and enforcing performance budgets as part of the build
- Version/date: 2018-11-05
- Verified on: 2026-11-05
- Apply when: adding a dependency or asset — confirm the bundle-size and timing budgets are declared in the build config and that exceeding them fails CI rather than warning

### CHROME-PERF | Profile the actual runtime before optimizing, and attribute the cost to a specific function or layout
- Source: Analyze runtime performance (Chrome DevTools Documentation)
- URL: https://developer.chrome.com/docs/devtools/performance?hl=zh-tw
- Authority: the official DevTools documentation for the Performance panel, the canonical workflow for CPU and network profiling
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: a performance issue is reported — capture a profile and identify the dominating function/layout/render-blocking resource before changing code

### DJANGO-NPLUS1 | Eliminate N+1 queries by selecting related objects in one query instead of looping over lazy relations
- Source: Making queries (Django documentation)
- URL: https://docs.djangoproject.com/en/6.1/topics/db/queries/
- Authority: Django's official ORM documentation, which explicitly documents the N+1 problem and the `select_related`/`prefetch_related` remedies
- Version/date: date not stated (stable release documentation)
- Verified on: 2026-11-05
- Apply when: writing ORM code that iterates over a relation — confirm each query count is constant with respect to the number of rows, and use `select_related`/`prefetch_related` or the equivalent eager loading

### HTTP-CACHING | Set cache headers deliberately — `Cache-Control` for freshness, `ETag`/`Last-Modified` for revalidation, and `Vary` when the response depends on request headers
- Source: HTTP caching (MDN Web Docs)
- URL: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
- Authority: MDN's HTTP caching guide, the widely used reference for cache-control semantics and revalidation
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding or changing an HTTP response — confirm `Cache-Control` states the intended freshness, that `ETag` or `Last-Modified` is present for revalidation, and that `Vary` matches every header the response actually depends on
