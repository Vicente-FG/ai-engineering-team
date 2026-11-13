/**
 * tools.spec.mjs - per-tool frontmatter rules used by scripts/build.mjs.
 *
 * Every mapping here was verified against the tool's own documentation:
 *
 *  Claude Code   .claude/agents/<name>.md          name, description (required); tools, model, skills optional
 *  GitHub Copilot .github/agents/<name>.agent.md   description (required); name, tools, model optional
 *  OpenCode      .opencode/agents/<name>.md        V2 format: description, mode, permissions (no V1-only keys)
 *
 * Canonical tool names in plugin/agents/*.md: read, write, edit, grep, glob, bash, task, todowrite
 */

// Claude Code built-in tool names.
const CLAUDE_TOOLS = {
  read: 'Read',
  write: 'Write',
  edit: 'Edit',
  grep: 'Grep',
  glob: 'Glob',
  bash: 'Bash',
  task: 'Task',
  todowrite: 'TodoWrite',
  web: 'WebFetch',
};

// GitHub Copilot tool aliases (case-insensitive).
const COPILOT_TOOLS = {
  read: 'read',
  write: 'edit',
  edit: 'edit',
  grep: 'search',
  glob: 'search',
  bash: 'execute',
  task: 'agent',
  todowrite: 'todo',
  web: 'web',
};

function mapTools(names, table) {
  const mapped = names.map((n) => table[n]).filter(Boolean);
  return [...new Set(mapped)];
}

export const TOOLS = {
  order: ['claude', 'copilot', 'opencode'],

  agents: {
    claude: {
      dir: '.claude/agents',
      extension: '.md',
      frontmatter(agent) {
        const lines = [`name: ${agent.name}`, `description: ${agent.description}`];
        const tools = mapTools(agent.tools, CLAUDE_TOOLS);
        if (tools.length) lines.push(`tools: ${tools.join(', ')}`);
        lines.push('model: inherit');
        return lines;
      },
    },

    copilot: {
      dir: '.github/agents',
      extension: '.agent.md',
      frontmatter(agent) {
        const lines = [`name: ${agent.name}`, `description: ${agent.description}`];
        const tools = mapTools(agent.tools, COPILOT_TOOLS);
        lines.push(`tools: [${tools.map((t) => `"${t}"`).join(', ')}]`);
        return lines;
      },
    },

    opencode: {
      dir: '.opencode/agents',
      extension: '.md',
      frontmatter(agent) {
        // OpenCode V2 format. Mixing V1-only keys (tools, temperature, prompt)
        // with V2 keys makes the runtime read the file as V1 and drop them.
        const lines = [`description: ${agent.description}`, 'mode: subagent'];
        if (!agent.writes) {
          // A planning or exploration agent must not write files.
          lines.push('permissions:', '  - action: edit', '    resource: "*"', '    effect: deny');
        }
        return lines;
      },
    },
  },

  // Where each tool looks for skills. The canonical copy lives in plugin/skills/.
  //
  //  .claude/skills   Claude Code, and read by Copilot, Cursor and OpenCode (compat roots)
  //  .github/skills   GitHub Copilot project skills
  //  .agents/skills   Copilot, Cursor and Junie (cross-agent directory)
  //  .opencode/skills OpenCode
  skills: [
    { dir: '.claude/skills' },
    { dir: '.github/skills' },
    { dir: '.agents/skills' },
    { dir: '.opencode/skills' },
  ],
};

/**
 * Static, generated instruction files. Each one adapts the shared AGENTS.md for a
 * tool that reads a different location or expects a different shape.
 */
export const STATIC_FILES = [
  {
    // Claude Code ignores AGENTS.md when a CLAUDE.md exists, so ship both.
    path: 'CLAUDE.md',
    from: 'AGENTS.md',
  },
  {
    // Junie uses .junie/AGENTS.md exclusively, never combined with the root file.
    path: '.junie/AGENTS.md',
    from: 'AGENTS.md',
  },
  {
    path: '.cursor/rules/agent-team.mdc',
    transform: (body) => [
      '---',
      'description: The planner / codebase-explorer / implementer team and its workflow',
      'alwaysApply: true',
      '---',
      '',
      body.replace(/^#\s+AGENTS\.md[ \t]*\r?\n/i, '# Engineering Team Toolkit\n'),
    ].join('\n'),
    from: 'AGENTS.md',
  },
  {
    path: '.github/copilot-instructions.md',
    transform: (body) => [
      '# Project instructions',
      '',
      'This repository ships an AI engineering team and a source-backed standards skill.',
      '',
      '## The team',
      '',
      '- `planner` - decomposes the work, dispatches explorers, writes the plan and asks for approval.',
      '- `codebase-explorer` - read-only investigation; never writes files.',
      '- `implementer` - writes the code, validates it, and commits, pushes or deploys only when the approved plan authorizes it.',
      '',
      '## Rules that change how you work here',
      '',
      '- No code is written before a human approves the plan.',
      '- One owner per file: never let two writers touch the same file.',
      '- Load the `engineering-standards` skill before planning or writing non-trivial code, and cite the rule IDs that drove each decision.',
      '- Verify a standard identifier against the published source; never cite one from memory.',
      '- Report the real command and its real output. Never claim a test run that did not happen.',
      '',
      'The full instructions are in `AGENTS.md`.',
      '',
    ].join('\n'),
  },
  {
    path: '.github/instructions/engineering-standards.instructions.md',
    transform: () => [
      '---',
      'applyTo: "**/*"',
      '---',
      '',
      '# Engineering standards',
      '',
      'This repository ships the `engineering-standards` skill in `.github/skills/engineering-standards/`',
      '(and in `.agents/skills/`, `.claude/skills/` and `.opencode/skills/`).',
      '',
      '- Load it before planning or writing non-trivial code.',
      '- Read only the domain files the task touches: security, architecture, development, testing,',
      '  api-design, performance, accessibility, documentation, release, observability, ai-engineering, ai-security.',
      '- Turn each applicable rule into a concrete artifact (a validation, a test, a config default, a doc section).',
      '- Cite the rule ID next to the decision it drove, and flag the rules you could not satisfy.',
      '',
    ].join('\n'),
  },
];
