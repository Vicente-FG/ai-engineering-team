# Security

Rules for application security, identity, supply chain, secrets and privacy. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### SEC-01 | Run every changed endpoint through the OWASP Top 10 checklist, starting with broken access control, cryptographic failures and injection
- Source: OWASP Top 10:2021
- URL: https://top10.owasp.org/2021/
- Authority: OWASP's flagship application-risk list, authoritative for the 2021 risk taxonomy
- Version/date: OWASP Top 10:2021 (A01:2021 Broken Access Control, A02:2021 Cryptographic Failures, A03:2021 Injection, A04:2021 Insecure Design and further categories)
- Verified on: 2026-11-05
- Apply when: reviewing a diff — walk categories A01-A10 and confirm an explicit control exists for each category the change touches (server-side authz check for A01, parameterized queries for A03)

### SEC-02 | Review new code against the current OWASP Top 10 (2025) categories, including software supply-chain failures
- Source: OWASP Top 10:2025
- URL: https://top10.owasp.org/2025/
- Authority: OWASP's current top-risk release, superseding the 2021 list
- Version/date: OWASP Top 10:2025 (A01:2025 Broken Access Control, A02:2025 Security Misconfiguration, A03:2025 Software Supply Chain Failures and further categories)
- Verified on: 2026-11-05
- Apply when: touching dependencies, CI or configuration — check A02 and A03 and state in the PR which 2025 category the change maps to

### SEC-03 | Turn applicable ASVS requirements into named test cases and block release when a required control fails
- Source: OWASP Application Security Verification Standard (ASVS)
- URL: https://asvs.owasp.org/
- Authority: OWASP flagship verification standard, published as PDF/DOCX/CSV requirement lists
- Version/date: ASVS 5.0.0, published 30 May 2025
- Verified on: 2026-11-05
- Apply when: adding a security test — cite the requirement in the versioned form `v5.0.0-<chapter>.<section>.<requirement>` (e.g. `v5.0.0-1.2.5` for OS command-injection-safe calls) and make CI assert it

### SEC-04 | Before writing security-sensitive code, open the matching OWASP cheat sheet for the stack and apply its pattern
- Source: OWASP/CheatSheetSeries
- URL: https://github.com/OWASP/CheatSheetSeries
- Authority: OWASP's community-maintained collection of concise application-security guidance (~33.9k stars at fetch time)
- Version/date: date not stated (live repository; ~33.9k stars)
- Verified on: 2026-11-05
- Apply when: starting a task in a given stack (SQL, React, Docker, GitHub Actions, GraphQL) — name the cheat sheet used and the pattern applied in the change description

### SEC-05 | Design and review every API endpoint against the OWASP API Security Top 10, starting with object-level authorization
- Source: OWASP Top 10 API Security Risks — 2023
- URL: https://api-security.owasp.org/editions/2023/en/0x11-t10/
- Authority: OWASP API Security project's official top-10 list
- Version/date: 2023 edition (API1:2023 Broken Object Level Authorization, API2:2023 Broken Authentication, API3:2023 Broken Object Property Level Authorization and further entries)
- Verified on: 2026-11-05
- Apply when: adding or changing an endpoint — write the missing authz check plus the negative test (another user's object returns 403) before shipping

### SEC-06 | Check the code's input handling against the current CWE Top 25 weaknesses before release
- Source: CWE Top 25 Most Dangerous Software Weaknesses
- URL: https://cwe.mitre.org/top25/
- Authority: MITRE's curated ranking of the most dangerous software weaknesses
- Version/date: 2025 CWE Top 25; date not stated
- Verified on: 2026-11-05
- Apply when: fixing or reviewing a defect — map it to its CWE, and if that weakness is on the Top 25, grep the codebase for the same pattern and fix all instances

### SEC-07 | Validate every untrusted input against an allowlist of expected values, types and lengths before use
- Source: OWASP Input Validation Cheat Sheet
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- Authority: OWASP's official input-validation guidance, including the allowlist-vs-denylist decision rule
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding a request field, query parameter or CLI argument — enforce allowlist (not denylist) checks at the boundary and reject anything that fails to parse or falls outside the allowed set

### SEC-08 | Encode output for its exact context (HTML body, HTML attribute, JavaScript, URL) instead of filtering dangerous input
- Source: Cross Site Scripting Prevention - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Authority: OWASP's official XSS-prevention guidance, whose output-encoding section covers HTML, attribute and JavaScript contexts
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: writing any template or JSON-to-HTML rendering — choose the context-specific encoder and confirm no raw interpolation of user-controlled data

### SEC-09 | Use parameterized queries and APIs for every data or command operation; never concatenate SQL, shell or XPath
- Source: Injection Prevention - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html
- Authority: OWASP's official injection-prevention guidance, routing to Query Parameterization and SQL Injection Prevention
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: writing or reviewing a query or subprocess call — confirm values are passed as bound parameters and that no string interpolation appears in the statement or command line

### SEC-10 | Block server-side request forgery by allowlisting destination hosts and validating resolved IPs before any outbound fetch
- Source: Server Side Request Forgery Prevention - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- Authority: OWASP's official SSRF-prevention guidance
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding an outbound HTTP call whose URL can be influenced by users — build a domain allowlist checked with strict comparison and validate the resolved IP against permitted networks (allowlisting alone does not stop DNS rebinding)

### SEC-11 | Design features so security is the product's default output, and state explicitly who owns customer security outcomes
- Source: Secure-by-Design (CISA, with national partners)
- URL: https://www.cisa.gov/resources-tools/resources/secure-by-design
- Authority: joint guidance from CISA and partner agencies addressed to software manufacturers
- Version/date: revision date October 25, 2023 (guidance first published April 2023)
- Verified on: 2026-11-05
- Apply when: at design time — write down the security outcomes the feature guarantees, the ones it explicitly does not, and reject designs that push the burden onto users

### SEC-12 | Map your build pipeline to the NIST SSDF practices and cite the practice each step implements
- Source: SP 800-218, Secure Software Development Framework (SSDF) Version 1.1
- URL: https://csrc.nist.gov/pubs/sp/800/218/final
- Authority: NIST's framework for integrating secure practices into the SDLC
- Version/date: Version 1.1; Date Published: February 2022
- Verified on: 2026-11-05
- Apply when: reviewing the CI/CD definition — tag each step with the SSDF practice it satisfies (e.g. protecting source and build environments) and require the practice-to-step mapping to be complete

### SEC-13 | Structure security work around the CSF 2.0 outcome taxonomy, including organizational risk management and not only technical controls
- Source: CSWP 29, The NIST Cybersecurity Framework (CSF) 2.0
- URL: https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
- Authority: NIST's cyber-risk management framework, official CSRC publication
- Version/date: Date Published: February 26, 2024
- Verified on: 2026-11-05
- Apply when: writing a security plan or control proposal — place each measure under a CSF 2.0 function/outcome and confirm the organizational side (Govern, asset inventory, roles) is covered alongside the technical controls

### SEC-14 | Implement the specific NIST SP 800-53 control you claim to meet and keep its evidence current
- Source: SP 800-53 Rev. 5, Security and Privacy Controls for Information Systems and Organizations
- URL: https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final
- Authority: NIST's control catalogue, with updated releases and crosswalk artifacts linked from the page
- Version/date: Date Published: September 2020 (includes updates as of Dec. 10, 2020); Release 5.2.0 issued August 27, 2025
- Verified on: 2026-11-05
- Apply when: a change touches a control family (AC, SC, SI) — point to the exact control and attach the assessment evidence (code, configuration, test result)

### SEC-15 | Treat EU CRA vulnerability handling and reporting duties as dated release requirements
- Source: Cyber Resilience Act (European Commission)
- URL: https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act
- Authority: European Commission's official implementation page for Regulation (EU) 2024/2847
- Version/date: Regulation (EU) 2024/2847; entered into force 10 December 2024; reporting obligations apply from 11 September 2026; main obligations apply from 11 December 2027
- Access: bot-blocked (the European Commission site intermittently returns 503 to automated clients; verified manually on 2026-11-05)
- Verified on: 2026-11-05
- Apply when: releasing a product with digital elements placed on the EU market — add the vulnerability-handling/SBOM process and the incident-reporting path to the release checklist before the 11 September 2026 reporting date

### SEC-16 | Classify identity flows by assurance level and meet the matching NIST SP 800-63-4 requirements
- Source: SP 800-63-4, Digital Identity Guidelines
- URL: https://csrc.nist.gov/pubs/sp/800/63/4/final
- Authority: NIST's current digital identity guideline set covering identity proofing, authentication and federation
- Version/date: Date Published: July 2025 (citation publication date 2025/07/31)
- Verified on: 2026-11-05
- Apply when: implementing login, identity proofing or federation — record the chosen IAL/AAL and cite the SP 800-63-4 requirement the flow satisfies

### SEC-17 | Implement OAuth 2.0 per RFC 9700 (Best Current Practice) rather than relying on the older RFCs alone
- Source: RFC 9700: Best Current Practice for OAuth 2.0 Security
- URL: https://datatracker.ietf.org/doc/html/rfc9700
- Authority: IETF Best Current Practice for OAuth 2.0 security
- Version/date: January 2025
- Verified on: 2026-11-05
- Apply when: reviewing an authorization server or client — list the RFC 9700 recommendations implemented (exact redirect-URI matching, PKCE, token handling) and which were consciously excluded

### SEC-18 | Use WebAuthn (the browser API behind passkeys/FIDO2) for phishing-resistant authentication instead of passwords alone
- Source: Web Authentication: An API for accessing Public Key Credentials Level 3
- URL: https://www.w3.org/TR/webauthn-3/
- Authority: W3C Recommendation defining the WebAuthn API used by passkey/FIDO2 authenticators
- Version/date: W3C Recommendation, 25 August 2026
- Verified on: 2026-11-05
- Apply when: implementing or reviewing a login or step-up flow — require a WebAuthn credential for high-value actions and verify origin, RP ID and challenge server-side

### SEC-19 | Renew the session identifier on every privilege change and expire sessions with bounded idle and absolute timeouts
- Source: Session Management - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Authority: OWASP's official session-management guidance
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: reviewing auth code — regenerate the session ID after login or privilege change, set idle and absolute timeouts, and confirm session identifiers are never written to logs

### SEC-20 | Enforce authorization server-side on every request, deny by default, and grant only the privilege needed
- Source: Authorization - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- Authority: OWASP's official authorization guidance (sections "Enforce Least Privileges" and "Deny by Default")
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding a handler — confirm the check runs server-side for each object and action (no client-only gating), default to deny, and add a test proving a non-owner is refused

### SEC-21 | Generate and verify build provenance for released artifacts at the SLSA level you claim
- Source: SLSA v1.2 (Supply-chain Levels for Software Artifacts)
- URL: https://slsa.dev/spec/v1.2/
- Authority: the official SLSA specification site for supply-chain integrity levels
- Version/date: SLSA v1.2, Status: Approved
- Verified on: 2026-11-05
- Apply when: publishing a release — produce provenance from the build platform (not a developer machine), publish it with the artifact and verify it in the consuming pipeline before deploy

### SEC-22 | Score third-party dependencies with OpenSSF Scorecard and reject dependencies with failed checks
- Source: ossf/scorecard — OpenSSF Scorecard, security health metrics for open source
- URL: https://github.com/ossf/scorecard
- Authority: OpenSSF's official tool for measuring security practices in open-source projects (~5.8k stars at fetch time)
- Version/date: date not stated (live repository; ~5.8k stars)
- Verified on: 2026-11-05
- Apply when: adding a dependency — inspect its Scorecard result and failing checks (dangerous workflow, unpinned dependencies) before it enters the build, and record the decision

### SEC-23 | Sign release artifacts and verify the signature, identity and transparency-log entry before publishing or consuming them
- Source: Sigstore — Overview
- URL: https://docs.sigstore.dev/about/overview/
- Authority: official Sigstore documentation (project backed by the OpenSSF under the Linux Foundation)
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: releasing or consuming a binary, container or SBOM — sign with cosign (ephemeral key, Fulcio identity, Rekor entry) and verify signature, expected identity and log inclusion; the page names typosquatting and post-publication tampering as the attack vectors this addresses

### SEC-24 | Check every locked dependency against the OSV vulnerability database in CI and fail the build on known-vulnerable versions
- Source: OSV — Open Source Vulnerabilities
- URL: https://osv.dev/
- Authority: official OSV distributed vulnerability database for open-source packages and dependencies
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: in CI — query the OSV database/API for each pinned dependency version and fail or annotate the build when an advisory matches, recording the affected version range

### SEC-25 | Emit an SBOM in SPDX format and attach it to every release
- Source: SPDX Specifications
- URL: https://spdx.dev/use/specifications/
- Authority: the SPDX project's official specification pages (Linux Foundation SPDX standard)
- Version/date: SPDX Document Version 3.0 (PDF 3.0.1); earlier 2.3 and 2.2.2 also listed
- Verified on: 2026-11-05
- Apply when: adding a release step — generate the SBOM from the resolved dependency graph in SPDX 3.0 (or 2.3 if a consumer requires it), publish it as a release artifact and diff it between versions

### SEC-26 | Produce an SBOM in CycloneDX format when a consumer requires a machine-readable bill of materials
- Source: CycloneDX Specification
- URL: https://cyclonedx.org/specification/overview/
- Authority: official CycloneDX specification site (OWASP Foundation project, ECMA-424)
- Version/date: Current Version 1.7; Release Date 2025-10-21; Published On 2025-12-10
- Verified on: 2026-11-05
- Apply when: a customer or regulator asks for CycloneDX — emit 1.7 JSON/XML containing component versions and hashes, and regenerate it on every build so it never drifts from the artifact

### SEC-27 | Commit a lockfile and pin every dependency to an exact, previously verified version
- Source: Software Supply Chain Security - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html
- Authority: OWASP's official software supply-chain security guidance (section "Lockfile/Version Pinning")
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: reviewing dependency manifests — require the ecosystem lockfile (e.g. package-lock.json) in the repository, reject floating ranges in production manifests, and monitor advisories for locked versions

### SEC-28 | Make installs reproducible by pinning exact versions and verifying artifact hashes
- Source: Repeatable Installs - pip documentation
- URL: https://pip.pypa.io/en/stable/topics/repeatable-installs/
- Authority: Python Packaging Authority's official pip documentation (`FooProject == 1.2 --hash=sha256:...`, hash-checking mode)
- Version/date: pip documentation v26.3
- Verified on: 2026-11-05
- Apply when: writing a requirements file or CI install step — use `==` pins with `--hash=sha256:...` so the exact artifact is fetched and a substituted or tampered wheel fails the install

### SEC-29 | Harden CI workflows: review third-party actions, use short-lived OIDC tokens, and keep untrusted code out of privileged steps
- Source: Secure use reference - GitHub Docs
- URL: https://docs.github.com/en/actions/reference/security/secure-use
- Authority: GitHub's official security guidance for the Actions platform (sections "Using third-party actions", "Mitigating the risks of untrusted code checkout", OpenID Connect)
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: reviewing a workflow file — confirm each third-party action was reviewed and referenced immutably, secrets are obtained through OpenID Connect short-lived tokens instead of long-lived keys, and untrusted PR input cannot reach privileged steps

### SEC-30 | Keep dependencies current automatically with Dependabot version updates rather than ad-hoc manual bumps
- Source: Dependabot version updates - GitHub Docs
- URL: https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-version-updates
- Authority: GitHub's official documentation for its Dependabot updater
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding or maintaining a repository — enable Dependabot version updates (and security updates) so patch PRs are opened automatically, and require the full test suite to pass before merging them

### SEC-31 | Run a secrets scanner over the repository and its history so committed credentials are caught before use
- Source: gitleaks/gitleaks — Find secrets with Gitleaks
- URL: https://github.com/gitleaks/gitleaks
- Authority: the Gitleaks project repository, the widely used open-source secret scanner (~30.7k stars at fetch time)
- Version/date: date not stated (live repository; ~30.7k stars)
- Verified on: 2026-11-05
- Apply when: adding a pre-commit hook or CI step that scans the working tree and full git history — fail the build on a finding and rotate any exposed credential

### SEC-32 | Scan and verify leaked credentials across repositories, CI logs and images, and treat a verified finding as a rotation incident
- Source: trufflesecurity/trufflehog — Find, verify, and analyze leaked credentials
- URL: https://github.com/trufflesecurity/trufflehog
- Authority: the TruffleHog project repository, open-source credential scanner with verification (~28.9k stars at fetch time)
- Version/date: date not stated (live repository; ~28.9k stars)
- Verified on: 2026-11-05
- Apply when: in CI — run the scanner over repo history and CI output; for each verified credential, revoke/rotate it and search for other uses instead of only deleting the line

### SEC-33 | Manage keys as managed keys with defined lifetimes, rotation and separation of duties rather than raw secrets in code
- Source: SP 800-57 Part 1 Rev. 5, Recommendation for Key Management: Part 1 — General
- URL: https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final
- Authority: NIST's key-management recommendation covering general key-management guidance and best practices
- Version/date: Date Published: May 2020
- Verified on: 2026-11-05
- Apply when: designing key storage — define key owners, access separation, validity period and a rotation schedule, and verify that no application code or config file holds long-lived key material

### SEC-34 | Encrypt bulk data with envelope encryption (per-object data key wrapped by a KMS key) instead of one shared key
- Source: AWS KMS cryptography essentials - AWS Key Management Service
- URL: https://docs.aws.amazon.com/kms/latest/developerguide/kms-cryptography.html
- Authority: AWS's own Key Management Service documentation, section "Envelope encryption"
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: implementing encryption for stored records — generate a data key via KMS, encrypt data with it, store only the encrypted data key, and enable automatic rotation of the wrapping key

### SEC-35 | Require TLS 1.3 (1.2 only for compatibility) and disable TLS 1.0/1.1 on every endpoint
- Source: Transport Layer Security - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html
- Authority: OWASP's official TLS guidance ("Web applications must default to TLS 1.3"; "TLS 1.0 and TLS 1.1 are formally deprecated")
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: configuring a server, client or load balancer — check the minimum protocol version, disable TLS 1.0/1.1, use standard AEAD suites (AES-GCM or ChaCha20-Poly1305) for TLS 1.3, and confirm certificate validation is enabled

### SEC-36 | Store passwords with Argon2id (or scrypt/bcrypt) and a per-user salt; never with fast hashes or plaintext
- Source: Password Storage - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Authority: OWASP's official password-storage guidance (Argon2id, scrypt and bcrypt sections with recommended parameters)
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: implementing signup, login or password reset — use Argon2id (or scrypt/bcrypt) with a unique salt and the sheet's recommended parameters, and store the salt and parameters alongside the hash

### SEC-37 | Before shipping a feature that handles personal data, map it to the GDPR principles for collection, processing and keeping
- Source: Principles of the GDPR - European Commission
- URL: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en
- Authority: European Commission's official guidance page on the principles governing how personal data can be collected, processed and kept under the GDPR
- Version/date: published 7 June 2019; last modified 23 July 2026
- Verified on: 2026-11-05
- Apply when: reviewing any change that adds or widens personal-data handling — record for each field its purpose, the minimum data needed, where it is stored and when it is deleted, and confirm the design satisfies the principles on this page

### SEC-38 | Manage privacy as an engineering risk across the data lifecycle using the NIST Privacy Framework
- Source: NIST Privacy Framework
- URL: https://www.nist.gov/privacy-framework
- Authority: NIST's framework for managing privacy risk
- Version/date: Version 1.0 (PDF, doi 10.6028/NIST.CSWP.01162020); Privacy Framework 1.1 also listed on the page
- Verified on: 2026-11-05
- Apply when: starting or auditing a privacy-relevant feature — identify the data involved, map processing to the framework's functions, and record the privacy risk and its mitigations next to the code review

### SEC-39 | Log security-relevant events, but never log secrets, session identifiers or personal data, and delete logs when the retention period ends
- Source: Logging - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- Authority: OWASP's official logging guidance, including its "Data to exclude" list and the rule that logs must not be destroyed before the required retention period nor kept beyond it
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding a logger call — check the payload against the excluded-data list (passwords, tokens, session identification values), confirm the event is recorded for audit, and set the retention/deletion rule

### SEC-40 | If the product ships an AI system in the EU, determine its risk tier and implement the matching AI Act obligations before launch
- Source: AI Act | Shaping Europe's digital future (European Commission)
- URL: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- Authority: European Commission's official AI Act implementation page (AI Act, Regulation (EU) 2024/1689)
- Version/date: AI Act, Regulation (EU) 2024/1689; page shows an item dated 20-07-2026
- Access: bot-blocked (the European Commission site intermittently returns 503 to automated clients; verified manually on 2026-11-05)
- Verified on: 2026-11-05
- Apply when: before release — classify the system by risk and, for high-risk uses, implement the provider obligations the page describes (documentation, logging, human oversight and transparency)

### SEC-41 | Verify mobile releases against the MASVS control groups and record how each is verified
- Source: OWASP MASVS - OWASP Mobile Application Security
- URL: https://mas.owasp.org/MASVS/
- Authority: OWASP's Mobile Application Security Verification Standard, hosted on the OWASP mobile security project site
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: releasing a mobile app — walk the MASVS control groups (storage, crypto, auth, platform, network, code, resilience, privacy) and record which are verified and by what evidence

### SEC-42 | Execute the MASTG test cases for mobile apps instead of relying on automated scanners alone
- Source: OWASP MASTG - OWASP Mobile Application Security
- URL: https://mas.owasp.org/MASTG/
- Authority: OWASP's Mobile Application Security Testing Guide, "a comprehensive manual for mobile app security testing and reverse engineering"
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: testing an Android or iOS build — execute the MASTG tests applicable to the app's platform and record the results alongside the MASVS verification

### SEC-43 | Rate-limit and bound every API endpoint's resource consumption (request rate, page size, execution time)
- Source: API4:2023 Unrestricted Resource Consumption - OWASP API Security Top 10
- URL: https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/
- Authority: OWASP API Security Top 10 entry; the page states it is common to find APIs that do not limit client interactions or resource consumption
- Version/date: API4:2023 (OWASP Top 10 API Security Risks — 2023)
- Verified on: 2026-11-05
- Apply when: exposing an endpoint — set per-client and per-token rate limits, maximum page size and execution timeouts, and return 429 with a Retry-After header when limits are exceeded

### SEC-44 | Constrain GraphQL endpoints with depth and amount limits, rate limiting and field-level authorization, and disable introspection in production
- Source: GraphQL - OWASP Cheat Sheet Series
- URL: https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html
- Authority: OWASP's official GraphQL security guidance (sections "Query Limiting (Depth & Amount)" and "Rate Limiting")
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: exposing or changing a GraphQL schema — enforce maximum query depth and result amount, rate limiting and per-field authorization, and disable introspection outside development

## Cross-cutting rules

1. Treat every external input as hostile: validate against an allowlist at the boundary, parameterize data access, and encode output for its context (SEC-07, SEC-08, SEC-09, SEC-10).
2. Never let the client decide access: re-evaluate authorization server-side on every request, deny by default, and grant the minimum privilege (SEC-19, SEC-20, SEC-05).
3. Keep secrets out of code and history: read credentials from a manager or environment, rotate on exposure, and scan commits and CI output automatically (SEC-31, SEC-32, SEC-33).
4. Encrypt in transit and at rest with managed keys: TLS 1.3 minimum, envelope encryption with KMS, defined key lifetimes and rotation (SEC-34, SEC-35, SEC-36, SEC-33).
5. Bound resource use on every externally reachable endpoint: rate limits, size limits, timeouts and query-depth limits (SEC-10, SEC-43, SEC-44).
6. Make the dependency chain reviewable and updatable: commit lockfiles, pin exact versions and hashes, generate an SBOM, scan advisories, and let Dependabot open the update PRs (SEC-24, SEC-25, SEC-26, SEC-27, SEC-28, SEC-30).
7. Log what an investigator needs and nothing else: record authentication, authorization and configuration-change events, exclude secrets and personal data, and expire logs on schedule (SEC-39, SEC-37, SEC-38).
8. Ship verifiable artifacts and prove them before release: sign releases, attach provenance, and pin CI to reviewed actions with short-lived credentials (SEC-21, SEC-22, SEC-23, SEC-29, SEC-31).

## Deliberately excluded sources

These were attempted and could not be verified, so no rule cites them. Re-test them on the next refresh — a bot challenge is not proof of a dead document.

- ISO/IEC 27001:2022 and 27017:2015 — https://www.iso.org/standard/27001 and https://www.iso.org/standard/44374.html — served a Cloudflare "Just a moment..." challenge instead of the standard page.
- EUR-Lex (Regulation (EU) 2024/2847, GDPR, AI Act) — every request returned an empty body; the European Commission implementation pages are cited instead.
- OWASP Output Encoding Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Output_Encoding_Cheat_Sheet.html — returned the site's 404 page; output encoding is sourced from the XSS Prevention sheet.
- EDPB "What is the GDPR" and euro.eu "Your Europe" data-protection pages — returned "Page not found".
- ICO storage-limitation guidance — served a Cloudflare managed challenge; retention is sourced from the OWASP Logging Cheat Sheet.
- awslabs/git-secrets — maintenance status and star count could not be read; Gitleaks and TruffleHog cover the same control.
