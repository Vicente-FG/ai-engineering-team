# AI Security and Governance

Rules for securing LLM features and agent permissions, plus the governance frameworks that apply. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### AIS-01 | Check every LLM feature against the OWASP Top 10 for LLM Applications and map findings to the relevant risk
- Source: 2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps (OWASP GenAI Security Project)
- URL: https://genai.owasp.org/llm-top-10/
- Authority: the OWASP project's official LLM risk taxonomy
- Version/date: 2025 edition (LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain, LLM04 Data and Model Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector and Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption)
- Verified on: 2026-11-05
- Apply when: reviewing an LLM-backed feature — record which of the ten risks apply and what mitigation is implemented for each

### AIS-02 | Treat model output as untrusted input and validate or escape it before it reaches SQL, HTML, shell or another interpreter
- Source: 2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps (OWASP GenAI Security Project) — LLM05 Improper Output Handling
- URL: https://genai.owasp.org/llm-top-10/
- Authority: OWASP's official LLM risk taxonomy
- Version/date: 2025 edition
- Verified on: 2026-11-05
- Apply when: writing code that consumes a model response — confirm the value is parsed against a schema and passed to interpreters through parameterised APIs, never concatenated

### AIS-03 | Give agents the minimum tool permissions possible and require human approval for consequential actions
- Source: 2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps (OWASP GenAI Security Project) — LLM06 Excessive Agency
- URL: https://genai.owasp.org/llm-top-10/
- Authority: OWASP's official LLM risk taxonomy
- Version/date: 2025 edition
- Verified on: 2026-11-05
- Apply when: granting an agent access to a tool that writes, deletes, pays or sends — confirm the scope is minimal, destructive operations are gated by an approval step, and the action is auditable

### AIS-04 | Do not rely on the system prompt as a security boundary, and filter data out of prompts that the model must not see
- Source: 2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps (OWASP GenAI Security Project) — LLM07 System Prompt Leakage and LLM02 Sensitive Information Disclosure
- URL: https://genai.owasp.org/llm-top-10/
- Authority: OWASP's official LLM risk taxonomy
- Version/date: 2025 edition
- Verified on: 2026-11-05
- Apply when: designing prompts — confirm secrets and PII are excluded server-side and that permissions are enforced in application code, not in prompt instructions

### AIS-05 | Bound LLM token, request and concurrency consumption with hard limits
- Source: 2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps (OWASP GenAI Security Project) — LLM10 Unbounded Consumption
- URL: https://genai.owasp.org/llm-top-10/
- Authority: OWASP's official LLM risk taxonomy
- Version/date: 2025 edition
- Verified on: 2026-11-05
- Apply when: exposing an LLM endpoint to users or agents — confirm max tokens, timeouts, per-user rate limits and a spend ceiling are enforced, and that tool loops are iteration-capped

### AIS-06 | Review agent designs against the OWASP Agentic AI threats and mitigations taxonomy
- Source: Agentic AI — OWASP Lists Threats and Mitigations (OWASP GenAI Security Project)
- URL: https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/
- Authority: OWASP's agent-specific threat catalogue
- Version/date: published 2025-02-17
- Verified on: 2026-11-05
- Apply when: designing an autonomous or multi-agent system — check goal hijack, tool misuse, identity spoofing, cascading failure and rogue-agent behaviours are each considered

### AIS-07 | Use the OWASP Top 10 for Agentic Applications as the checklist for agent reviews
- Source: OWASP Agentic Security Initiative (OWASP GenAI Security Project)
- URL: https://genai.owasp.org/initiatives/agentic-security-initiative/
- Authority: the OWASP initiative that publishes the agentic Top 10 and crosswalks (including AIUC-1) and the State of Agentic AI Security and Governance report
- Version/date: date not stated on the page; the page references "Top 10 for Agentic Applications 2026" (globally peer-reviewed) and "State of Agentic AI Security and Governance 2.01"
- Verified on: 2026-11-05
- Apply when: performing an agentic-system security review — walk the agentic Top 10 entries and confirm mitigations or accepted risks are recorded

### AIS-08 | Run the Govern, Map, Measure and Manage functions of the NIST AI RMF over every AI feature you ship
- Source: NIST AI Risk Management Framework (AI RMF 1.0) (NIST)
- URL: https://www.nist.gov/itl/ai-risk-management-framework
- Authority: the US national standards body framework for AI risk management; the AI RMF 1.0 PDF is also published at https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf (HTTP 200)
- Version/date: AI RMF 1.0, released January 2023; framework intended for voluntary use
- Verified on: 2026-11-05
- Apply when: adding an AI capability — confirm the team can point to documented governance, context mapping, measurement and treatment of risks for that feature

### AIS-09 | Apply the NIST AI RMF Generative AI Profile's risk list when the feature is generative
- Source: Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (NIST)
- URL: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
- Authority: NIST's official GenAI-specific profile of the AI RMF
- Version/date: "Created July 26, 2024, Updated April 8, 2026"
- Verified on: 2026-11-05
- Apply when: a feature calls a generative model — check the profile's risks (confabulation, data privacy, information integrity, harmful bias, etc.) are assessed for that use case

### AIS-10 | Put AI-specific risk treatment under a documented AI management system rather than ad-hoc review
- Source: ISO/IEC 42001:2023 — AI management systems (ISO)
- URL: https://www.iso.org/standard/81230.html
- Authority: the international management-system standard for AI, issued jointly by ISO and IEC
- Version/date: ISO/IEC 42001:2023; International Standard published 2023-12-18 (ISO stage 60.60); page canonical https://www.iso.org/standard/42001
- Access: bot-blocked (iso.org returns 403 to automated clients; verified manually in a browser on 2026-11-05)
- Verified on: 2026-11-05
- Apply when: the organisation operates AI in production — confirm there is a management system with risk assessment, treatment, statement of applicability and continual improvement for AI

### AIS-11 | Record red-team findings as MITRE ATLAS technique IDs so they are comparable across runs
- Source: MITRE ATLAS (MITRE)
- URL: https://atlas.mitre.org/
- Authority: MITRE's official knowledge base of adversary tactics and techniques for AI systems (underlying data published at https://github.com/mitre-atlas/atlas-data)
- Version/date: date not stated on the site (client-side rendered app); data repo last push 2026-10-28, 206 stars observed 2026-11-05 via api.github.com/repos/mitre-atlas/atlas-data
- Verified on: 2026-11-05
- Apply when: writing a security test or assessment report for an AI system — tag each finding with an ATLAS technique/tactic ID

### AIS-12 | Gate model deployment on documented capability evaluations rather than shipping on confidence
- Source: Responsible Scaling Policy (Anthropic)
- URL: https://www.anthropic.com/responsible-scaling-policy
- Authority: Anthropic's own published risk-management policy for frontier models, including Risk Reports
- Version/date: Version 3.3 update, May 26, 2026 (page lists 3.3 on 2026-05-26 and 3.2 on 2026-04-29); the current Risk Report coverage date is July 15
- Verified on: 2026-11-05
- Apply when: adopting or upgrading a model — confirm capability evaluations exist for the deployed risk tier and that mitigations are in place before the model handles production traffic

### AIS-13 | Reject any MCP server that accepts tokens not issued for it, and never pass client tokens through to downstream APIs
- Source: Security Best Practices (Model Context Protocol)
- URL: https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices.md
- Authority: the official MCP security guidance; token passthrough is explicitly forbidden by the authorization specification
- Version/date: spec revision 2026-07-28
- Verified on: 2026-11-05
- Apply when: implementing MCP authorization — confirm the server validates token audience/resource claims and stores/rotates tokens itself rather than forwarding caller tokens

### AIS-14 | Harden OAuth metadata fetches against SSRF before following any server-supplied URL
- Source: Security Best Practices (Model Context Protocol) and Server Side Request Forgery Prevention (OWASP Cheat Sheet Series)
- URL: https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices.md
- Authority: MCP's own SSRF section, cross-referenced to OWASP's official cheat sheet
- Version/date: spec revision 2026-07-28 (OWASP cheat sheet: date not stated)
- Verified on: 2026-11-05
- Apply when: a client fetches `resource_metadata`, `authorization_servers` or token endpoints — confirm HTTPS enforcement, blocking of private/link-local ranges (including 169.254.169.254), redirect validation and egress-proxy use

### AIS-15 | Bind agent state handles to authenticated users, require consent before running local MCP servers, and request narrow scopes
- Source: Security Best Practices (Model Context Protocol)
- URL: https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices.md
- Authority: the official MCP security guidance for state, local servers and authorization scope
- Version/date: spec revision 2026-07-28
- Verified on: 2026-11-05
- Apply when: a server mints a handle, an ID or a token for an agent — confirm it is bound server-side to the verified user, that local server commands require an explicit consent dialog showing the full command, and that wildcard or omnibus scopes are not published

### AIS-16 | Treat agent-requested URLs as untrusted: show the full URL, require consent, and never pre-fetch or auto-open
- Source: Elicitation (Model Context Protocol Specification)
- URL: https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation.md
- Authority: the normative MCP client requirements for elicitation
- Version/date: spec revision 2026-07-28
- Verified on: 2026-11-05
- Apply when: implementing an MCP client that handles elicitation — confirm it does not pre-fetch the URL, displays the full URL and highlights the domain before consent, and offers decline/cancel paths

### AIS-17 | Classify your AI feature's EU AI Act risk tier and implement the matching provider and deployer obligations
- Source: AI Act — Regulatory framework (European Commission)
- URL: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- Authority: the European Commission's official AI Act page
- Version/date: date not stated on the page; the page states transparency rules come into effect in August 2026, that the AI Office and Member State authorities implement and enforce the Act from 2 August 2026, and that prohibition obligations come into effect in December 2026 under the AI Omnibus
- Access: bot-blocked (the European Commission site intermittently returns 503 to automated clients; verified manually on 2026-11-05)
- Verified on: 2026-11-05
- Apply when: releasing an AI feature into the EU — confirm the risk tier, and for high-risk use cases that logging, human oversight (deployer) and post-market monitoring (provider) are implemented
