#!/usr/bin/env node
/**
 * build.mjs - generate the per-tool agent, skill and instruction files from the canonical sources.
 *
 * Canonical sources (edit these, never the generated ones):
 *   plugin/agents/<agent>.md              agent body + canonical metadata in YAML frontmatter
 *   plugin/skills/engineering-standards/  the skill, verbatim
 *   AGENTS.md                             the shared instructions
 *
 * Generated outputs:
 *   .claude/agents/*.md        .claude/skills/*          Claude Code
 *   .github/agents/*.agent.md  .github/skills/*          GitHub Copilot
 *   .opencode/agents/*.md      .opencode/skills/*        OpenCode
 *   .agents/skills/*                                      Copilot / Cursor / Junie
 *   .cursor/rules/*.mdc        .junie/AGENTS.md          Cursor / Junie
 *   CLAUDE.md                                           Claude Code (it ignores AGENTS.md)
 *
 * Usage:
 *   node scripts/build.mjs           regenerate everything
 *   node scripts/build.mjs --check   fail if the generated files are out of sync (used by CI)
 *
 * No third-party dependencies: the frontmatter parser handles the small YAML subset used here.
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, resolve, dirname, relative } from 'node:path';
import { TOOLS, STATIC_FILES } from './tools.spec.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const checkOnly = process.argv.includes('--check');

/* ------------------------------------------------------------------ utils */

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  let currentKey = null;
  for (const rawLine of match[1].split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;
    const listItem = rawLine.match(/^\s*-\s+(.*)$/);
    if (listItem && currentKey) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(listItem[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    const pair = rawLine.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    currentKey = pair[1];
    const value = pair[2].trim();
    meta[currentKey] = value === '' ? [] : value.replace(/^["']|["']$/g, '');
  }
  // A comma-separated scalar is a list for the keys that always hold a list.
  for (const key of ['tools']) {
    if (typeof meta[key] === 'string') {
      meta[key] = meta[key].split(',').map((v) => v.trim()).filter(Boolean);
    }
  }
  return { meta, body: text.slice(match[0].length) };
}

function frontmatter(lines) {
  return ['---', ...lines.filter((l) => l !== null && l !== undefined), '---', ''].join('\n');
}

async function writeIfChanged(path, content) {
  let existing = null;
  try {
    existing = await readFile(path, 'utf8');
  } catch {
    /* new file */
  }
  if (existing === content) return false;
  if (!checkOnly) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, 'utf8');
  }
  return true;
}

async function copyTree(from, to) {
  const entries = await readdir(from, { withFileTypes: true });
  const changed = [];
  for (const entry of entries) {
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    if (entry.isDirectory()) {
      changed.push(...(await copyTree(src, dest)));
    } else {
      const content = await readFile(src);
      let existing = null;
      try {
        existing = await readFile(dest);
      } catch {
        /* new */
      }
      if (!existing || !existing.equals(content)) {
        changed.push(relative(ROOT, dest));
        if (!checkOnly) {
          await mkdir(dirname(dest), { recursive: true });
          await writeFile(dest, content);
        }
      }
    }
  }
  return changed;
}

/* ------------------------------------------------------- agent generation */

async function loadAgents() {
  const dir = join(ROOT, 'plugin', 'agents');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'));
  const agents = [];
  for (const file of files) {
    const raw = await readFile(join(dir, file), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    agents.push({
      slug: file.replace(/\.md$/, ''),
      name: meta.name || file.replace(/\.md$/, ''),
      description: meta.description || '',
      tools: Array.isArray(meta.tools) ? meta.tools : [],
      writes: meta.writes === true || meta.writes === 'true',
      body: body.replace(/^\s+/, ''),
    });
  }
  return agents;
}

/* -------------------------------------------------------------------- run */

const agents = await loadAgents();
const changed = [];

for (const tool of TOOLS.order) {
  const spec = TOOLS.agents[tool];
  if (!spec || !spec.dir) continue;
  for (const agent of agents) {
    const target = join(ROOT, spec.dir, agent.slug + spec.extension);
    const rendered = `${frontmatter(spec.frontmatter(agent))}\n${agent.body}`;
    if (await writeIfChanged(target, rendered)) changed.push(relative(ROOT, target));
  }
}

// Skills: copy the canonical tree into every location a tool looks at.
const CANONICAL_SKILL = join(ROOT, 'plugin', 'skills', 'engineering-standards');
for (const skillTarget of TOOLS.skills) {
  const dest = join(ROOT, skillTarget.dir, 'engineering-standards');
  changed.push(...(await copyTree(CANONICAL_SKILL, dest)));
}

// Instruction files adapted per tool.
const agentsMd = await readFile(join(ROOT, 'AGENTS.md'), 'utf8');
for (const spec of STATIC_FILES) {
  const target = join(ROOT, spec.path);
  const source = spec.from ? await readFile(join(ROOT, spec.from), 'utf8') : '';
  const content = spec.transform ? spec.transform(source) : source;
  if (await writeIfChanged(target, content)) changed.push(relative(ROOT, target));
}

if (checkOnly) {
  if (changed.length) {
    console.error('Generated files are out of sync with the canonical sources:');
    for (const file of changed) console.error(`  ${file}`);
    console.error('\nRun: node scripts/build.mjs');
    process.exit(1);
  }
  console.log('Generated files are in sync.');
} else {
  console.log(`Generated ${changed.length} file(s).`);
  for (const file of changed) console.log(`  ${file}`);
}
