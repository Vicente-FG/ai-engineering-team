#!/usr/bin/env node
/**
 * check-sources.mjs - deterministic liveness / drift check for every source URL cited in references/*.md
 *
 * What it does (no model tokens, no third-party deps):
 *   1. Parses references/*.md into rule blocks (a block starts with "### ").
 *   2. Extracts the URL and the "Verified on:" date of each block.
 *   3. Performs a HEAD request per URL (falling back to a ranged GET when HEAD is rejected).
 *   4. Classifies each source: ok / redirect (with canonical target) / dead / error.
 *   5. Flags sources whose "Verified on" date is older than --stale-days (default 180).
 *
 * Usage:
 *   node check-sources.mjs [--json] [--domain <name>] [--stale-days <n>] [--timeout <ms>]
 *                           [--concurrency <n>] [--apply-redirects]
 *
 * Exit codes: 0 = every source reachable and fresh, 1 = at least one dead or stale source.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve, basename } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const REFS_DIR = join(ROOT, 'references');

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const asJson = argv.includes('--json');
const applyRedirects = argv.includes('--apply-redirects');
const withStars = argv.includes('--stars');
const writeRegistry = argv.includes('--write-registry');
const domainFilter = flag('--domain', null);
const staleDays = Number(flag('--stale-days', '180'));
const timeoutMs = Number(flag('--timeout', '15000'));
const concurrency = Math.max(1, Number(flag('--concurrency', '8')));

const UA = 'engineering-standards-skill/check-sources (+source-verification)';

function parseBlocks(text, file) {
  const blocks = [];
  let current = null;
  for (const rawLine of text.split(/\r?\n/)) {
    if (rawLine.startsWith('### ')) {
      if (current) blocks.push(current);
      current = { file, id: rawLine.slice(4).trim(), body: [] };
    } else if (current) {
      current.body.push(rawLine);
    }
  }
  if (current) blocks.push(current);
  return blocks;
}

function field(block, label) {
  const re = new RegExp(`^-\\s*${label}:\\s*(.+)$`, 'im');
  const m = block.body.join('\n').match(re);
  return m ? m[1].trim() : null;
}

async function collectSources() {
  let files;
  try {
    files = await readdir(REFS_DIR);
  } catch (err) {
    console.error(`Cannot read ${REFS_DIR}: ${err.message}`);
    process.exit(2);
  }
  const mdFiles = files.filter((f) => f.endsWith('.md'));
  const sources = new Map();

  for (const file of mdFiles) {
    if (domainFilter && !file.includes(domainFilter)) continue;
    const text = await readFile(join(REFS_DIR, file), 'utf8');
    for (const block of parseBlocks(text, file)) {
      const url = field(block, 'URL');
      if (!url || !/^https?:\/\//i.test(url)) continue;
      const verifiedOn = field(block, 'Verified on');
      const version = field(block, 'Version/date');
      const title = field(block, 'Source');
      const authority = field(block, 'Authority');
      const access = field(block, 'Access');
      const key = url.trim();
      if (!sources.has(key)) {
        sources.set(key, { url: key, file, id: block.id, title, authority, version, verifiedOn, access });
      }
    }
  }
  return [...sources.values()];
}

function daysSince(dateStr) {
  if (!dateStr) return null;
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const attempt = async (method) => {
    const init = { method, redirect: 'follow', signal: controller.signal, headers: { 'user-agent': UA } };
    if (method === 'GET') init.headers.range = 'bytes=0-0';
    const res = await fetch(url, init);
    return res;
  };
  try {
    let res = await attempt('HEAD');
    // Some CDNs (e.g. NIST CSRC) answer HEAD with 404 even for live pages: retry with GET.
    if (res.status === 405 || res.status === 403 || res.status === 501 || res.status === 404) {
      res = await attempt('GET');
      if (res.body) await res.arrayBuffer().catch(() => {});
    }
    const finalUrl = res.url && res.url !== url ? res.url : null;
    const status = res.status;
    let statusText = 'ok';
    if (status >= 500) statusText = 'error';
    else if (status >= 400) statusText = 'dead';
    else if (finalUrl) statusText = 'redirect';
    return { status, statusText, finalUrl };
  } catch (err) {
    return { status: 0, statusText: 'error', finalUrl: null, error: err.name === 'AbortError' ? 'timeout' : err.message };
  } finally {
    clearTimeout(timer);
  }
}

function repoSlug(url) {
  const m = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!m) return null;
  const owner = m[1];
  const name = m[2].replace(/\.git$/, '');
  if (['orgs', 'sponsors', 'settings', 'about', 'topics', 'collections'].includes(owner.toLowerCase())) return null;
  return { owner, name };
}

async function githubMeta(slug) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`https://api.github.com/repos/${slug.owner}/${slug.name}`, {
      signal: controller.signal,
      headers: { 'user-agent': UA, accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const j = await res.json();
    return {
      stars: j.stargazers_count ?? null,
      archived: j.archived ?? null,
      pushedAt: j.pushed_at ?? null,
      description: j.description ?? null,
    };
  } catch (err) {
    return { error: err.name === 'AbortError' ? 'timeout' : err.message };
  } finally {
    clearTimeout(timer);
  }
}

async function writeRegistryFile(list) {
  const byFile = new Map();
  for (const s of list) {
    if (!byFile.has(s.file)) byFile.set(s.file, []);
    byFile.get(s.file).push(s);
  }
  const stamp = new Date().toISOString().slice(0, 10);
  const lines = [
    '# Source Registry',
    '',
    'Generated by `scripts/check-sources.mjs --write-registry`. Every rule in this skill traces back to one of these sources.',
    '',
    `Last regenerated: ${stamp}`,
    '',
  ];
  for (const file of [...byFile.keys()].sort()) {
    lines.push(`## ${file}`, '');
    lines.push('| Rule | Source | Version/date | Verified on | URL |');
    lines.push('|---|---|---|---|---|');
    for (const s of byFile.get(file).sort((a, b) => String(a.id).localeCompare(String(b.id)))) {
      const id = (s.id || '').split('|')[0].trim();
      const esc = (v) => String(v ?? '').replace(/\|/g, '\\|');
      lines.push(`| ${esc(id)} | ${esc(s.title)} | ${esc(s.version)} | ${esc(s.verifiedOn)} | ${s.url} |`);
    }
    lines.push('');
  }
  const out = join(REFS_DIR, 'sources.md');
  await writeFile(out, lines.join('\n'), 'utf8');
  console.log(`registry written: ${out} (${list.length} sources)`);
}

async function runPool(items, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return results;
}

async function applyRedirectFixes(redirects) {
  const files = [...new Set(redirects.map((r) => r.file))];
  for (const file of files) {
    const path = join(REFS_DIR, file);
    let text = await readFile(path, 'utf8');
    let changed = 0;
    for (const r of redirects.filter((x) => x.file === file)) {
      const from = r.url;
      const to = r.finalUrl;
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped, 'g');
      const matches = text.match(re);
      if (matches) {
        text = text.replace(re, to);
        changed += matches.length;
      }
    }
    if (changed) {
      await writeFile(path, text, 'utf8');
      console.log(`updated ${file}: ${changed} URL(s) rewritten`);
    }
  }
}

const sources = await collectSources();
if (sources.length === 0) {
  console.error('No sources found in references/*.md');
  process.exit(2);
}

console.log(`Checking ${sources.length} source(s) from ${new Set(sources.map((s) => s.file)).size} reference file(s)...\n`);

const probed = await runPool(sources, async (src) => {
  const result = await probe(src.url);
  // A source marked "Access: bot-blocked" that answers 403/406/503 is reachable for humans
  // but refuses automated clients: report it as blocked, never as dead.
  const blockedByPolicy = src.access && /bot|blocked/i.test(src.access) && [403, 406, 429, 503].includes(result.status);
  return { ...src, ...result, statusText: blockedByPolicy ? 'blocked' : result.statusText };
});

if (withStars) {
  const ghTargets = probed.filter((s) => repoSlug(s.url));
  if (ghTargets.length) {
    console.log(`Fetching GitHub metadata for ${ghTargets.length} repo(s)...`);
    await runPool(ghTargets, async (s) => {
      s.meta = await githubMeta(repoSlug(s.url));
    });
  }
}

const archivedRepos = withStars ? probed.filter((s) => s.meta?.archived === true) : [];const dormantRepos = withStars
  ? probed.filter((s) => {
      if (!s.meta?.pushedAt) return false;
      const age = Math.floor((Date.now() - new Date(s.meta.pushedAt).getTime()) / 86400000);
      return age > staleDays;
    })
  : [];

const stale = probed.filter((s) => {
  const age = daysSince(s.verifiedOn);
  return age !== null && age > staleDays;
});
const missingDate = probed.filter((s) => daysSince(s.verifiedOn) === null);
const dead = probed.filter((s) => s.statusText === 'dead');
const errored = probed.filter((s) => s.statusText === 'error');
const redirected = probed.filter((s) => s.statusText === 'redirect');

if (asJson) {
  console.log(JSON.stringify({
    checkedAt: new Date().toISOString(),
    total: probed.length,
    ok: probed.length - dead.length - errored.length - redirected.length,
    dead: dead.map((s) => s.url),
    errored: errored.map((s) => ({ url: s.url, error: s.error })),
    redirected: redirected.map((s) => ({ url: s.url, finalUrl: s.finalUrl })),
    stale: stale.map((s) => ({ url: s.url, verifiedOn: s.verifiedOn, ageDays: daysSince(s.verifiedOn) })),
    missingVerifiedOn: missingDate.map((s) => s.url),
    archivedRepos: archivedRepos.map((s) => s.url),
    dormantRepos: dormantRepos.map((s) => ({ url: s.url, lastPush: s.meta.pushedAt, stars: s.meta.stars })),
    repos: withStars
      ? probed.filter((s) => s.meta).map((s) => ({ url: s.url, stars: s.meta.stars ?? null, archived: s.meta.archived ?? null, lastPush: s.meta.pushedAt ?? null }))
      : [],
  }, null, 2));
} else {
  const pad = (v, n) => String(v).padEnd(n);
  console.log(pad('STATUS', 10) + pad('CODE', 6) + 'URL');
  console.log('-'.repeat(100));
  for (const s of probed) {
    const target = s.finalUrl ? `  -> ${s.finalUrl}` : '';
    console.log(pad(s.statusText, 10) + pad(s.status || 'ERR', 6) + s.url + target);
  }
  console.log('\n--- summary ---');
  console.log(`total: ${probed.length}`);
  console.log(`reachable: ${probed.length - dead.length - errored.length - redirected.length}`);
  console.log(`redirected: ${redirected.length}`);
  console.log(`dead: ${dead.length}`);
  console.log(`error: ${errored.length}`);
  const blocked = probed.filter((s) => s.statusText === 'blocked');
  if (blocked.length) {
    console.log(`bot-blocked (expected, marked "Access: bot-blocked"): ${blocked.length}`);
    for (const s of blocked) console.log(`  ${s.url}`);
  }
  console.log(`stale (>${staleDays}d since Verified on): ${stale.length}`);
  console.log(`missing "Verified on" date: ${missingDate.length}`);
  if (stale.length) {
    console.log('\nstale sources (need semantic re-verification, not just a ping):');
    for (const s of stale) console.log(`  ${s.url}  (${s.verifiedOn}, ${daysSince(s.verifiedOn)}d)`);
  }
  if (missingDate.length) {
    console.log('\nsources missing a "Verified on:" line:');
    for (const s of missingDate) console.log(`  ${s.url}`);
  }
  if (redirected.length) {
    console.log('\nredirected sources (canonical target shown above; rerun with --apply-redirects to rewrite them):');
    for (const s of redirected) console.log(`  ${s.url} -> ${s.finalUrl}`);
  }
  if (withStars) {
    const repos = probed.filter((s) => s.meta);
    if (repos.length) {
      console.log('\ngithub repositories (stars / last push):');
      for (const s of repos) {
        const stars = s.meta.stars === null || s.meta.stars === undefined ? 'n/a' : s.meta.stars;
        const push = s.meta.pushedAt ? s.meta.pushedAt.slice(0, 10) : 'n/a';
        const flag = s.meta.archived ? ' [ARCHIVED]' : '';
        console.log(`  ${pad(stars, 9)}${pad(push, 13)}${s.url}${flag}`);
      }
    }
    if (archivedRepos.length) {
      console.log('\narchived repositories (rule may need a new home):');
      for (const s of archivedRepos) console.log(`  ${s.url}`);
    }
    if (dormantRepos.length) {
      console.log(`\ndormant repositories (no push in ${staleDays}d):`);
      for (const s of dormantRepos) console.log(`  ${s.url}  (last push ${s.meta.pushedAt})`);
    }
  }
}

if (applyRedirects && redirected.length) {
  await applyRedirectFixes(redirected);
}

if (writeRegistry) {
  await writeRegistryFile(await collectSources());
}

process.exit(dead.length || errored.length || stale.length || missingDate.length ? 1 : 0);
