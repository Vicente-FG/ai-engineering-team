# Observability and Reliability

Rules for making a running system explainable. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### OBS-01 | Name every span attribute and metric using OpenTelemetry semantic conventions instead of inventing names
- Source: Semantic Conventions (OpenTelemetry Docs)
- URL: https://opentelemetry.io/docs/concepts/semantic-conventions/index.md
- Authority: the OpenTelemetry project's own naming registry for traces, metrics, logs, profiles and resources
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding a new span attribute, metric or log attribute — check the semconv registry (trace/metric/log/resource) for an existing name before defining your own

### OBS-02 | Apply the trace semantic conventions so HTTP, RPC and database spans carry standard attributes
- Source: Trace semantic conventions (OpenTelemetry Docs)
- URL: https://opentelemetry.io/docs/specs/semconv/general/trace/index.md
- Authority: normative OpenTelemetry attribute definitions for spans
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: instrumenting an outbound HTTP/RPC/DB call — verify the span name, kind and required attributes match the convention set for that protocol

### OBS-03 | Pin the OpenTelemetry specification version you depend on and check its stability status before adopting a signal
- Source: open-telemetry/opentelemetry-specification (GitHub)
- URL: https://github.com/open-telemetry/opentelemetry-specification
- Authority: the canonical OpenTelemetry specification repository
- Version/date: last push 2026-11-04; 4,386 stars observed 2026-11-05 via api.github.com/repos/open-telemetry/opentelemetry-specification
- Verified on: 2026-11-05
- Apply when: adding a new signal, semconv set or SDK feature — confirm it is Stable (not Development) and match the spec version in your dependencies

### OBS-04 | Propagate W3C TraceContext (`traceparent`) across every service hop and let the SDK inject trace/span IDs into logs
- Source: Context propagation (OpenTelemetry Docs)
- URL: https://opentelemetry.io/docs/concepts/context-propagation/index.md
- Authority: OpenTelemetry's normative context/propagation specification
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: writing an HTTP client, message consumer or manual instrumentation — confirm the traceparent header is forwarded and that log records carry trace_id/span_id

### OBS-05 | Never put secrets or PII in baggage, and sanitize inbound trace headers from untrusted callers
- Source: Context propagation (OpenTelemetry Docs) — "Security best practices"
- URL: https://opentelemetry.io/docs/concepts/context-propagation/index.md
- Authority: OpenTelemetry's own security guidance on propagation
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: setting baggage keys or accepting a caller-supplied traceparent — reject or ignore forged context from external callers and keep credentials out of propagated values

### OBS-06 | Bound metric attribute cardinality and never attach user IDs or raw URLs as metric labels
- Source: Metrics (OpenTelemetry Docs)
- URL: https://opentelemetry.io/docs/concepts/signals/metrics/index.md
- Authority: OpenTelemetry metrics SDK/data-model documentation
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding attributes to a counter or histogram — check the combination count stays under the SDK cardinality limit (default 2000) and use views to drop or aggregate high-cardinality attributes

### OBS-07 | Emit structured, timestamped log records instead of free-text prints, bridging existing logging frameworks via the OTel Logs SDK
- Source: Logs (OpenTelemetry Docs)
- URL: https://opentelemetry.io/docs/concepts/signals/logs/index.md
- Authority: OpenTelemetry's log signal definition and SDK guidance
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: replacing console/print logging in a service — confirm records carry structured fields and are exported through the Logs API/bridge, not printed to stdout only

### OBS-08 | Instrument so an outsider can answer "why is this happening?" without internal knowledge of the code
- Source: Observability primer (OpenTelemetry Docs)
- URL: https://opentelemetry.io/docs/concepts/observability-primer/index.md
- Authority: OpenTelemetry's definition of observability and its telemetry signals
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: reviewing a service for telemetry coverage — verify traces, metrics and logs exist for each request path and can be correlated without reading the source

### OBS-09 | Define SLIs from user-visible symptoms (availability, latency, throughput, correctness) and write the SLO target and window explicitly
- Source: Service Level Objectives (The Site Reliability Engineering Book, Ch. 4)
- URL: https://sre.google/sre-book/service-level-objectives/
- Authority: Google SRE Book, the canonical definition of SLI/SLO/SLA terminology
- Version/date: date not stated (SRE Book)
- Verified on: 2026-11-05
- Apply when: creating or reviewing an SLO — confirm each SLI names a user-visible measure, a target, and a rolling window, and that SLA/SLO terms are not conflated

### OBS-10 | Page on symptoms that affect users, not on internal causes, and file tickets for everything else
- Source: Practical Alerting (The Site Reliability Engineering Book, Ch. 10)
- URL: https://sre.google/sre-book/practical-alerting/
- Authority: Google SRE Book chapter on alert policy
- Version/date: date not stated (SRE Book)
- Verified on: 2026-11-05
- Apply when: writing a new alert rule — classify it as page vs ticket and confirm the trigger is a user-visible symptom rather than a CPU/disk/queue metric

### OBS-11 | Build dashboards around the four golden signals (latency, traffic, errors, saturation)
- Source: Monitoring Distributed Systems (The Site Reliability Engineering Book, Ch. 5)
- URL: https://sre.google/sre-book/monitoring-distributed-systems/
- Authority: Google SRE Book chapter introducing symptom-vs-cause monitoring and the golden signals
- Version/date: date not stated (SRE Book)
- Verified on: 2026-11-05
- Apply when: creating a service dashboard — include latency, traffic, errors and saturation, and keep symptom-level views separate from cause-level views

### OBS-12 | Alert on SLO burn rate with a multi-window policy: page on fast burn, ticket on slow burn
- Source: Alerting on SLOs (The Site Reliability Engineering Workbook, Ch. 4)
- URL: https://sre.google/workbook/alerting-on-slos/
- Authority: Google SRE Workbook chapter on burn-rate-based alerting
- Version/date: date not stated (SRE Workbook)
- Verified on: 2026-11-05
- Apply when: implementing SLO alerting — define burn-rate thresholds over short and long windows so alerting is both fast and precise, and confirm the error budget consumption rate drives the threshold

### OBS-13 | Turn the error budget into a release-freeze policy, and state explicitly that missing the budget is not a punishment
- Source: Example Error Budget Policy (The Site Reliability Engineering Workbook, Ch. 17)
- URL: https://sre.google/workbook/error-budget-policy/
- Authority: Google SRE Workbook's worked error-budget policy
- Version/date: date not stated (SRE Workbook)
- Verified on: 2026-11-05
- Apply when: writing an error budget policy — confirm it names who freezes releases, how budget exhaustion is computed, and that it protects customers from repeated SLO misses rather than blaming teams

### OBS-14 | Write a blameless postmortem with impact, mitigation, root cause and tracked follow-up actions after every significant incident
- Source: Postmortem Culture: Learning from Failure (The Site Reliability Engineering Book, Ch. 16)
- URL: https://sre.google/sre-book/postmortem-culture/
- Authority: Google SRE Book chapter defining the postmortem format
- Version/date: date not stated (SRE Book)
- Verified on: 2026-11-05
- Apply when: closing an incident — confirm a postmortem document exists with root cause, follow-up actions and owners, and that it does not attribute fault to individuals

### OBS-15 | Pre-define incident roles and communication channels so responders coordinate instead of improvising
- Source: Incident Response (The Site Reliability Engineering Workbook)
- URL: https://sre.google/workbook/incident-response/
- Authority: Google SRE Workbook chapter adapting emergency-response practice to software incidents
- Version/date: date not stated (SRE Workbook)
- Verified on: 2026-11-05
- Apply when: writing an incident runbook — define incident commander, communications and operations roles plus the escalation path before an outage occurs

### OBS-16 | Structure on-call rotations and handoffs explicitly, and treat rotation design as a reliability risk
- Source: Being On-Call (The Site Reliability Engineering Book, Ch. 12)
- URL: https://sre.google/sre-book/being-on-call/
- Authority: Google SRE Book chapter on on-call organisation and its pitfalls
- Version/date: date not stated (SRE Book)
- Verified on: 2026-11-05
- Apply when: changing a rotation, adding a service to on-call, or writing a handoff procedure — specify primary/secondary, handoff contents and load limits

### OBS-17 | Run controlled fault-injection experiments with a stated steady-state hypothesis and a minimal blast radius
- Source: Principles of Chaos Engineering
- URL: https://principlesofchaos.org/
- Authority: the Netflix-originated principles maintained as the community reference for chaos engineering
- Version/date: "Last Update: 2019 March"
- Verified on: 2026-11-05
- Apply when: designing a resilience or failover test — write the steady-state metric, the hypothesis, the injected real-world fault, and the containment plan before running it in production

### OBS-18 | Ground delivery and platform changes in the DORA capability catalog and measure the capability, not the activity
- Source: Capability catalog (DORA)
- URL: https://dora.dev/capabilities/
- Authority: the DORA research program's own catalogue of delivery capabilities (continuous delivery, CI, code maintainability, database change management, etc.)
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: proposing a build/deploy/process change — identify the DORA capability it improves and state the metric you will move
