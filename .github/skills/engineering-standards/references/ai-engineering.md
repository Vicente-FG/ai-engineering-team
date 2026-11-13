# AI and LLM Engineering

Rules for building agentic and LLM-backed features. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### AI-01 | Start with a single LLM call and only add multi-step agent machinery when the task genuinely needs it
- Source: Building Effective Agents (Anthropic Engineering)
- URL: https://www.anthropic.com/research/building-effective-agents
- Authority: Anthropic's own engineering guidance on agent architecture, the most widely adopted reference for agent design
- Version/date: published 2024-12-19
- Verified on: 2026-11-05
- Apply when: designing an LLM feature — check whether a prompt, a tool call or a retrieval step suffices before introducing routing, orchestrator-workers or autonomous loops

### AI-02 | Design each tool with a self-describing name, minimal parameters and error messages the model can act on
- Source: Writing effective tools for agents (Anthropic Engineering)
- URL: https://www.anthropic.com/research/writing-tools-for-agents
- Authority: Anthropic's guidance on tool/function design for agents
- Version/date: published 2025-09-11
- Verified on: 2026-11-05
- Apply when: adding a tool to an agent — check its description says what it does and when to use it, that it takes the fewest possible arguments, and that failures return actionable messages

### AI-03 | Curate the context window deliberately: supply only the information the task needs and drop stale context
- Source: Effective context engineering for AI agents (Anthropic Engineering)
- URL: https://www.anthropic.com/research/effective-context-engineering-for-ai-agents
- Authority: Anthropic's guidance on context management for agents
- Version/date: published 2025-09-29
- Verified on: 2026-11-05
- Apply when: assembling a prompt or agent turn — check every included block is relevant and current, and that long histories are compacted or re-retrieved rather than accumulated

### AI-04 | Put durable project instructions in CLAUDE.md/AGENTS.md and verify each instruction actually changes model behaviour
- Source: Best practices for Claude Code (Anthropic Docs)
- URL: https://code.claude.com/docs/en/best-practices.md
- Authority: Anthropic's official coding-agent usage guide
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: adding repo guidance for an agent — confirm it lives in the instructions file rather than only in chat, and that a rule the model ignores is rewritten or escalated to a hook

### AI-05 | Enforce non-negotiable rules with hooks, not with prompt text
- Source: Hooks reference (Claude Code)
- URL: https://code.claude.com/docs/en/hooks.md
- Authority: Anthropic's official hook event/configuration reference
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: a rule must be deterministic (formatting, tests, secret scanning, forbidden commands) — implement it as a hook that blocks the action instead of asking the model to comply

### AI-06 | For long-running agents, initialise the environment up front and require each session to leave a clean, mergeable state
- Source: Effective harnesses for long-running agents (Anthropic Research)
- URL: https://www.anthropic.com/research/effective-harnesses-for-long-running-agents
- Authority: Anthropic's engineering post on multi-session agent harnesses
- Version/date: published Nov 26, 2025
- Verified on: 2026-11-05
- Apply when: setting up a multi-session agent task — confirm there is an initialiser step (setup script, progress log, first commit) and that each session must leave documented, ordered, mergeable work

### AI-07 | Start evals immediately with roughly twenty representative cases instead of delaying for a large suite
- Source: Demystifying evals for AI agents (Anthropic Research)
- URL: https://www.anthropic.com/research/demystifying-evals-for-ai-agents
- Authority: Anthropic's research post on evaluation practice for agents
- Version/date: published 2026-01-09
- Verified on: 2026-11-05
- Apply when: adding an eval suite — begin with a small set of real usage patterns and run it on every prompt/tool change

### AI-08 | Grade open-ended agent output with one LLM judge plus a written rubric, and keep human review for edge cases
- Source: Demystifying evals for AI agents (Anthropic Research)
- URL: https://www.anthropic.com/research/demystifying-evals-for-ai-agents
- Authority: Anthropic's research post describing its own LLM-as-judge methodology
- Version/date: published 2026-01-09
- Verified on: 2026-11-05
- Apply when: writing a rubric — check it scores criteria (factual accuracy, citation accuracy, completeness, source quality, tool efficiency) on a 0.0-1.0 scale with a pass/fail grade, and record human spot-checks

### AI-09 | Contextualise retrieved chunks before indexing them so retrieval stays accurate
- Source: Contextual Retrieval (Anthropic Research)
- URL: https://www.anthropic.com/research/contextual-retrieval
- Authority: Anthropic's research post introducing the contextual-retrieval technique for RAG
- Version/date: published 2024-09-19
- Verified on: 2026-11-05
- Apply when: building a RAG pipeline — confirm each chunk is given its document-level context before embedding, and measure retrieval failure modes separately from generation errors

### AI-10 | Execute code over data instead of pasting raw tool results into the model's context
- Source: Code execution with MCP: Building more efficient agents (Anthropic Research)
- URL: https://www.anthropic.com/research/code-execution-with-mcp
- Authority: Anthropic's engineering post on reducing tool-result token bloat via MCP code execution
- Version/date: published 2025-11-04
- Verified on: 2026-11-05
- Apply when: a tool returns large datasets — check the agent filters/aggregates in code and that only the distilled result enters the context window

### AI-11 | Evaluate agents on their final end state, not on whether they followed a prescribed step sequence
- Source: How we built our multi-agent research system (Anthropic Research)
- URL: https://www.anthropic.com/research/multi-agent-research-system
- Authority: Anthropic's engineering post on shipping a multi-agent system to production
- Version/date: published 2025-06-13
- Verified on: 2026-11-05
- Apply when: writing an eval for a stateful agent — assert on the end state at checkpoints rather than on turn-by-turn behaviour

### AI-12 | Trace production agent runs end to end and monitor decision patterns, not just output text
- Source: How we built our multi-agent research system (Anthropic Research)
- URL: https://www.anthropic.com/research/multi-agent-research-system
- Authority: Anthropic's account of debugging a production multi-agent system with full tracing
- Version/date: published 2025-06-13
- Verified on: 2026-11-05
- Apply when: an agent misbehaves in production — confirm full tracing records tool calls, search queries and sources, and that no raw user conversation content is captured in telemetry

### AI-13 | Keep agents version-safe with rainbow deployments instead of restarting every running agent at once
- Source: How we built our multi-agent research system (Anthropic Research)
- URL: https://www.anthropic.com/research/multi-agent-research-system
- Authority: Anthropic's production-engineering practice for stateful agent workloads
- Version/date: published 2025-06-13
- Verified on: 2026-11-05
- Apply when: deploying changes to prompts, tools or agent logic — confirm old and new agent versions can run simultaneously and that traffic shifts gradually

### AI-14 | Define agents with explicit prompts, tools and guardrails rather than hand-rolled retry loops
- Source: A guide to building agents (OpenAI Developer Docs)
- URL: https://developers.openai.com/api/docs/guides/agents.md
- Authority: OpenAI's official agent construction guide
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: implementing an agent — check the instructions, tool set and guardrails are defined as first-class components and that the orchestration loop is not custom-written

### AI-15 | Build on a maintained agents SDK with handoffs, guardrails, sessions and tracing instead of a bespoke runtime
- Source: openai/openai-agents-python (GitHub)
- URL: https://github.com/openai/openai-agents-python
- Authority: OpenAI's official Agents SDK repository
- Version/date: last push 2026-11-06; 30,523 stars observed 2026-11-05 via api.github.com/repos/openai/openai-agents-python; MIT license
- Verified on: 2026-11-05
- Apply when: choosing an agent runtime — check the SDK provides agent/handoff primitives, guardrails, session state and tracing before hand-rolling equivalents

### AI-16 | Constrain model output with a JSON Schema instead of parsing free text and retrying
- Source: Structured Outputs (OpenAI Developer Docs)
- URL: https://developers.openai.com/api/docs/guides/structured-outputs.md
- Authority: OpenAI's official structured-output guide
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: consuming model output programmatically — confirm a schema is supplied, refusals are detected explicitly, and no "parse and retry" fallback is used as the primary path

### AI-17 | Cut latency with the documented levers: fewer tokens, a smaller model where quality allows, streaming, and caching
- Source: Latency optimization (OpenAI Developer Docs)
- URL: https://developers.openai.com/api/docs/guides/latency-optimization.md
- Authority: OpenAI's production latency guide, organised into seven principles
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: an LLM path misses its latency budget — check which of the seven principles applies (model size, streaming, caching, batching) and record the measured effect

### AI-18 | Place static, reusable content at the front of the prompt so automatic prompt caching can hit
- Source: Prompt caching (OpenAI Developer Docs)
- URL: https://developers.openai.com/api/docs/guides/prompt-caching.md
- Authority: OpenAI's official caching guide for the Responses and Agents APIs
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: building a repeated LLM workflow — check the stable prefix is first, that cache-hit rate is monitored on the usage dashboard, and that session continuity is not mistaken for a guaranteed cache hit

### AI-19 | Write programmatic evals against the Evals API and plan for the platform's deprecation instead of depending on the hosted console
- Source: Evals (OpenAI Developer Docs)
- URL: https://developers.openai.com/api/docs/guides/evals.md
- Authority: OpenAI's official evals guide, including its own deprecation notice
- Version/date: date not stated; the page states the Evals platform becomes read-only for existing users on 2026-10-31 (deprecation noted 2026-06-03)
- Verified on: 2026-11-05
- Apply when: setting up LLM evaluations — confirm evals are defined in code and reproducible in CI, not only in a dashboard

### AI-20 | Use an open eval framework and benchmark registry for regression suites rather than bespoke scoring scripts
- Source: openai/evals (GitHub)
- URL: https://github.com/openai/evals
- Authority: OpenAI's official evaluation framework and open benchmark registry
- Version/date: last push 2026-04-14; 19,710 stars observed 2026-11-05 via api.github.com/repos/openai/evals
- Verified on: 2026-11-05
- Apply when: adding regression checks for model behaviour — check the task is expressed as a reusable eval definition and that results are logged per run

### AI-21 | Implement MCP servers against the current spec revision and negotiate capabilities instead of assuming them
- Source: Model Context Protocol — Introduction / Specification repository
- URL: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro
- Authority: the official MCP documentation site and specification repository
- Version/date: latest spec revision 2026-07-28 (repo last push 2026-11-05; 9,624 stars observed 2026-11-05 via api.github.com/repos/modelcontextprotocol/modelcontextprotocol)
- Verified on: 2026-11-05
- Apply when: building an MCP server or client — confirm the implementation targets a named spec version, declares its capabilities, and does not assume optional client features

### AI-22 | Route any human-in-the-loop step through MCP elicitation, and use URL mode so secrets never enter the model context
- Source: Elicitation (Model Context Protocol Specification)
- URL: https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation.md
- Authority: the normative MCP specification for server-initiated user interaction
- Version/date: spec revision 2026-07-28 (URL mode introduced in spec 2025-11-25)
- Verified on: 2026-11-05
- Apply when: an agent must ask a human for input, confirmation or a credential — check form mode is used only for non-sensitive data and URL mode for keys, tokens and payments

### AI-23 | Keep agent instructions in AGENTS.md so they are discoverable across tools
- Source: agentsmd/agents.md (GitHub) and Adding repository custom instructions for GitHub Copilot (GitHub Docs)
- URL: https://github.com/agentsmd/agents.md
- Authority: the open convention repository, referenced by GitHub Copilot's own documentation
- Version/date: repo last push 2026-09-10; 25,347 stars observed 2026-11-05 via api.github.com/repos/agentsmd/agents.md
- Verified on: 2026-11-05
- Apply when: adding repo-level instructions — confirm an AGENTS.md exists, that the nearest file wins, and that its content is tool-neutral so multiple agents read the same rules

### AI-24 | Run agent evaluations in a sandboxed harness that records every tool call and scorer result
- Source: UKGovernmentBEIS/inspect_ai (GitHub) and Inspect documentation
- URL: https://github.com/UKGovernmentBEIS/inspect_ai
- Authority: the UK AI Security Institute's open evaluation framework
- Version/date: repo last push 2026-11-05; 3,187 stars observed 2026-11-05 via api.github.com/repos/UKGovernmentBEIS/inspect_ai; MIT license
- Verified on: 2026-11-05
- Apply when: building an eval harness — check evaluations run in sandboxed environments with declared scorers and produce inspectable logs of tool use

### AI-25 | Gate prompt, agent and RAG changes with declarative tests in CI, and run red-team suites against the same harness
- Source: promptfoo/promptfoo (GitHub) and Promptfoo documentation
- URL: https://github.com/promptfoo/promptfoo
- Authority: the open-source prompt/RAG testing and AI red-teaming tool
- Version/date: repo last push 2026-11-06; 26,885 stars observed 2026-11-05 via api.github.com/repos/promptfoo/promptfoo; MIT license
- Verified on: 2026-11-05
- Apply when: changing a prompt, tool description or retrieval config — confirm a declarative test file exists and runs in CI, including adversarial cases
