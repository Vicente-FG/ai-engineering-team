# API Design

Rules for HTTP semantics, resource modelling, versioning, errors and pagination. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### OPENAPI | Describe the HTTP API with an OpenAPI document and generate the client, server stubs and docs from it
- Source: OpenAPI Specification v3.1.0
- URL: https://spec.openapis.org/oas/v3.1.0.html
- Authority: the OpenAPI Initiative's normative specification, aligned with JSON Schema, and the input format for the major code generators
- Version/date: Version 3.1.0, 15 February 2021
- Verified on: 2026-11-05
- Apply when: adding or changing an HTTP endpoint — update the OpenAPI document in the same change and confirm schemas, status codes and error responses are described and that the spec validates

### RFC9110 | Implement HTTP semantics per RFC 9110: correct methods, status codes, headers and idempotency of GET/HEAD/PUT/DELETE
- Source: RFC 9110 — HTTP Semantics (IETF)
- URL: https://datatracker.ietf.org/doc/html/rfc9110
- Authority: the IETF Standards Track document that obsoletes RFC 7231 and is the normative definition of HTTP semantics
- Version/date: June 2022; Standards Track
- Verified on: 2026-11-05
- Apply when: writing or reviewing a handler — confirm the method semantics, status codes and headers match the RFC and that GET/HEAD remain safe and GET/PUT/DELETE idempotent

### RFC9457 | Return errors as `application/problem+json` with type, title, status, detail and per-field errors
- Source: RFC 9457 — Problem Details for HTTP APIs (IETF)
- URL: https://datatracker.ietf.org/doc/html/rfc9457
- Authority: the IETF Standards Track standard that obsoletes RFC 7807 and defines the HTTP problem-details format
- Version/date: July 2023; Standards Track
- Verified on: 2026-11-05
- Apply when: designing an error response — return `Content-Type: application/problem+json` with at least `type`, `title` and `status`, and use `errors[]` for field-level validation failures

### JSONAPI | Model an API as a JSON:API document with `data`, `relationships`, `included` and a `links` object
- Source: JSON:API — Latest Specification
- URL: https://jsonapi.org/format/
- Authority: the JSON:API specification published by the JSON:API community, defining a concrete media type for REST APIs
- Version/date: v1.1
- Verified on: 2026-11-05
- Apply when: building a resource-oriented JSON API — confirm top-level `data`/`errors` objects, `type`/`id` identifiers, `attributes` vs `relationships` separation, and `included` for compound documents

### STRIPE-IDEMPOTENCY | Accept an `Idempotency-Key` header on every mutating endpoint and return the original response on replay
- Source: Idempotent requests (Stripe API Reference)
- URL: https://docs.stripe.com/api/idempotent_requests
- Authority: Stripe's own API reference, which specifies the `Idempotency-Key` header semantics and error behaviour for reused keys
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding a `POST` that creates or mutates state — accept `Idempotency-Key`, persist the key with the result, and return the stored response (not a new side effect) when the key is replayed

### STRIPE-RATELIMIT | Publish and enforce rate limits with `429`, `Retry-After` and descriptive rate-limit headers
- Source: Rate limits (Stripe Documentation)
- URL: https://docs.stripe.com/rate-limits
- Authority: Stripe's published rate-limit contract, including the `429 Too Many Requests` response and the headers clients must read
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding a throttled endpoint — confirm the client receives `429` with `Retry-After`, that the limit is keyed to a stable identifier, and that the client backs off on `429` specifically

### STRIPE-VERSIONING | Version the API with an explicit account-level version pinned at request time, and change it only on a schedule
- Source: Versioning (Stripe API Reference)
- URL: https://docs.stripe.com/api/versioning
- Authority: Stripe's own documented API versioning strategy, including how a request pins a version and how upgrades are rolled out
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: introducing a breaking API change — confirm it lands behind a new version identifier, that the default version is bumped on a published schedule, and that clients are notified before the change takes effect

### STRIPE-PAGINATION | Paginate every collection endpoint with a cursor (`starting_after` / `ending_before`) and a `has_more` flag
- Source: Pagination (Stripe API Reference)
- URL: https://docs.stripe.com/api/pagination
- Authority: Stripe's documented cursor-based pagination contract, the de facto reference for paginating a large REST collection
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding a list endpoint — confirm it accepts a cursor parameter, returns a `has_more` flag and a cursor for the next page, and that page size is bounded

### STRIPE-WEBHOOKS | Deliver webhooks with a signature header, event IDs, idempotent handling and explicit retry semantics
- Source: Receive Stripe events in your webhook endpoint (Stripe Documentation)
- URL: https://docs.stripe.com/webhooks
- Authority: Stripe's own webhook delivery specification, including signature verification, event identifiers, retry behaviour and ordering caveats
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: building a webhook receiver — verify the signature on every request, deduplicate by event ID, and treat delivery as at-least-once rather than assuming exactly-once
