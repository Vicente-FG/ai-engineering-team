#!/usr/bin/env node
/**
 * lint-skill.mjs - self-contained validator for a skill directory.
 *
 * Checks the structure a skill must have to load reliably across tools:
 *   - SKILL.md exists and its YAML frontmatter parses
 *   - `name` is kebab-case and matches the directory name
 *   - `description` is present and carries a trigger hint
 *   - the body stays under a size that keeps it cheap to load
 *   - no forbidden scaffolding files are present
 *   - every references/<file>.md mentioned in the body actually exists
 *
 * Usage:
 *   node scripts/lint-skill.mjs [skill-dir] [--strict]
 *
 * Exit code 0 when the skill passes, 1 otherwise.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve, basename } from 'node:path';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const skillArg = args.find((a) => !a.startsWith('--'));
const skillDir = skillArg
  ? resolve(skillArg)
  : resolve(import.meta.dirname, '..', 'plugin', 'skills', 'engineering-standards');

const FORBIDDEN = [
  'README.md', 'CHANGELOG.md', 'install.sh', '.env', '.env.example',
  '.gitignore', 'Dockerfile', 'requirements.txt', 'package.json',
];
const MAX_BODY_LINES = 500;

let failures = 0;
let warnings = 0;

function fail(message) {
  failures++;
  console.error(`[FAIL] ${message}`);
}
function warn(message) {
  warnings++;
  console.error(`[WARN] ${message}`);
}
function ok(message) {
  console.log(`[OK]   ${message}`);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

console.log(`Linting skill at: ${skillDir}\n`);

const skillFile = join(skillDir, 'SKILL.md');
if (!(await exists(skillFile))) {
  fail('SKILL.md is missing');
  process.exit(1);
}
ok('SKILL.md exists');

const raw = await readFile(skillFile, 'utf8');
const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
if (!match) {
  fail('frontmatter is missing or not closed with a second ---');
  process.exit(1);
}
ok('frontmatter parsed');

const meta = {};
{
  let key = null;
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    key = pair[1];
    const value = pair[2].trim();
    meta[key] = value === '' ? '' : value.replace(/^["']|["']$/g, '');
  }
}

const name = meta.name || '';
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
  fail(`name "${name}" is not kebab-case`);
} else if (name !== basename(skillDir)) {
  fail(`name "${name}" does not match the directory name "${basename(skillDir)}"`);
} else {
  ok(`name "${name}" is valid kebab-case and matches the directory`);
}

const description = meta.description || '';
if (!description) {
  fail('description is empty');
} else if (description.length < 40) {
  warn(`description is very short (${description.length} chars); it should carry a trigger hint`);
} else {
  ok(`description present (${description.length} chars)`);
}

const unknownKeys = Object.keys(meta).filter((k) => !['name', 'description', 'license', 'allowed-tools', 'metadata'].includes(k));
if (unknownKeys.length) warn(`frontmatter keys not in the known set: ${unknownKeys.join(', ')}`);

const body = raw.slice(match[0].length);
const bodyLines = body.split(/\r?\n/).length;
if (bodyLines > MAX_BODY_LINES) {
  fail(`body is ${bodyLines} lines (limit ${MAX_BODY_LINES})`);
} else {
  ok(`body is ${bodyLines} lines (limit ${MAX_BODY_LINES})`);
}

// Forbidden scaffolding files.
async function walk(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];
  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      found.push(...(await walk(join(dir, entry.name), rel)));
    } else {
      found.push(rel);
    }
  }
  return found;
}
const files = await walk(skillDir);
const forbidden = files.filter((f) => FORBIDDEN.includes(basename(f)));
if (forbidden.length) fail(`forbidden files present: ${forbidden.join(', ')}`);
else ok('no forbidden files in the skill directory');

// Referenced files must exist.
const referenced = [...body.matchAll(/references\/[A-Za-z0-9._-]+\.md/g)].map((m) => m[0]);
const uniqueRefs = [...new Set(referenced)];
const missing = [];
for (const ref of uniqueRefs) {
  if (!(await exists(join(skillDir, ref)))) missing.push(ref);
}
if (missing.length) fail(`referenced files do not exist: ${missing.join(', ')}`);
else ok(`all ${uniqueRefs.length} referenced file(s) resolve`);

// Every rule entry must carry its required fields.
const referenceFiles = files.filter((f) => f.startsWith('references/') && f.endsWith('.md') && !f.endsWith('/sources.md'));
let ruleTotal = 0;
const badEntries = [];
for (const rel of referenceFiles) {
  const text = await readFile(join(skillDir, rel), 'utf8');
  const blocks = text.split(/^### /m).slice(1);
  for (const block of blocks) {
    ruleTotal++;
    const id = block.split('\n')[0].trim();
    for (const field of ['Source:', 'URL:', 'Authority:', 'Version/date:', 'Verified on:', 'Apply when:']) {
      if (!block.includes(`- ${field}`)) badEntries.push(`${rel}: ${id} is missing "${field}"`);
    }
    if (!/^https?:\/\//.test((block.match(/- URL: (\S+)/) || [])[1] || '')) {
      badEntries.push(`${rel}: ${id} has an invalid URL`);
    }
  }
}
if (badEntries.length) {
  for (const problem of badEntries.slice(0, 20)) fail(problem);
  if (badEntries.length > 20) fail(`... and ${badEntries.length - 20} more entry problems`);
} else {
  ok(`all ${ruleTotal} rule entries carry Source, URL, Authority, Version/date, Verified on and Apply when`);
}

console.log(`\n${failures ? 'FAILED' : 'PASSED'}: ${failures} failure(s), ${warnings} warning(s), ${ruleTotal} rule entries checked.`);
process.exit(failures ? 1 : 0);
