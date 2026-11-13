# Testing

Rules for test strategy, doubles, and the tools that prove behaviour. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### TEST-PYRAMID | Bias the suite toward many fast unit tests with a thin layer of slower integration and end-to-end tests
- Source: The Practical Test Pyramid (Martin Fowler)
- URL: https://martinfowler.com/articles/practical-test-pyramid.html
- Authority: Fowler's article codifying the pyramid as an executable test suite shape rather than a slogan
- Version/date: 26 February 2018
- Verified on: 2026-11-05
- Apply when: adding a test — place it at the lowest layer that can verify the behaviour; flag new end-to-end tests unless they cover a genuinely cross-service path

### TEST-DOUBLE | Use the cheapest test double that still proves the behaviour, and prefer a real implementation over a mock
- Source: Test Double (Martin Fowler)
- URL: https://martinfowler.com/bliki/TestDouble.html
- Authority: Fowler's catalogue entry that defines the dummy, stub, spy, mock and fake taxonomy
- Version/date: 17 January 2006
- Verified on: 2026-11-05
- Apply when: writing a test that needs a collaborator — choose dummy/stub/spy/mock/fake deliberately, and never mock the type you are trying to verify

### GOOGLE-TDD | Write the test first and let it fail for the right reason before writing the implementation
- Source: The Way of TDD (Google Testing Blog)
- URL: https://testing.googleblog.com/2024/12/tech-on-toilet-driving-software.html
- Authority: Google's own testing blog, the canonical internal voice of Google testing practice
- Version/date: December 03, 2024
- Verified on: 2026-11-05
- Apply when: implementing new behaviour — confirm a failing test exists that states the expected outcome, and that the test fails on the assertion rather than on a setup error

### FLAKY-TESTS | Treat every flaky test as a defect with an owner, quarantine it explicitly, and block on the rate rather than on the flake count
- Source: Flaky Tests at Google and How We Mitigate Them (Google Testing Blog)
- URL: https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html
- Authority: Google's own testing blog reporting their flake-mitigation programme
- Version/date: May 27, 2016
- Verified on: 2026-11-05
- Apply when: a test fails intermittently — record it in a known-flaky list with an owner and an expiry, and confirm CI reports the flake rate instead of silently retrying until green

### HYPOTHESIS | Generate randomized inputs and assert invariants instead of hand-picking examples for edge cases
- Source: Hypothesis (GitHub repository)
- URL: https://github.com/HypothesisWorks/hypothesis
- Authority: the reference property-based testing library for Python, documented as the property-based testing implementation of the Hypothesis project
- Version/date: repository page as fetched; 9,138 stars observed on the repo page
- Verified on: 2026-11-05
- Apply when: writing tests for parsing, serialization, validation or algorithmic code — express an invariant and let the generator explore the input space, including shrinking on failure

### PACT | Verify that a consumer and a provider agree on a message contract before they are deployed together
- Source: Pact specification (GitHub repository)
- URL: https://github.com/pact-foundation/pact-specification
- Authority: the versioned specification of the Pact contract-testing protocol maintained by the Pact Foundation
- Version/date: repository page as fetched; 317 stars observed on the repo page
- Verified on: 2026-11-05
- Apply when: two services communicate over HTTP, a queue or an event — confirm a Pact-style contract test exists on the consumer side and is verified in the provider's build

### STRYKER | Use mutation testing to measure whether your assertions actually detect broken behaviour
- Source: Stryker-js (GitHub repository)
- URL: https://github.com/stryker-mutator/stryker-js
- Authority: the reference JavaScript/TypeScript mutation-testing tool, implementing the mutation-testing method in the Stryker family
- Version/date: repository page as fetched; 3,333 stars observed on the repo page
- Verified on: 2026-11-05
- Apply when: reviewing coverage that looks high but is unproven — run mutation testing on critical modules and confirm the surviving mutants are killed by real assertions, not by assertion-free tests

### PLAYWRIGHT | Drive the user-visible path through a real browser with an isolated, deterministic test context
- Source: Playwright (GitHub repository)
- URL: https://github.com/microsoft/playwright
- Authority: Microsoft's cross-browser end-to-end testing framework, the de facto standard for browser automation
- Version/date: repository page as fetched; 99,402 stars observed on the repo page
- Verified on: 2026-11-05
- Apply when: adding an end-to-end test — confirm each test uses an isolated browser context and a ready locator (role/label-based), never fixed sleeps, and that the selectors do not depend on CSS class names
