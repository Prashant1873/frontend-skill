#!/usr/bin/env node
/**
 * ingest-component.mjs: CLI tool to query, inspect, and ingest human-crafted UI patterns.
 *
 * Commands:
 *   node scripts/ingest-component.mjs --list [--category <cat>] [--archetype <arch>]
 *   node scripts/ingest-component.mjs --get <id> [--css|--html|--both]
 *   node scripts/ingest-component.mjs --search <query>
 *   node scripts/ingest-component.mjs --file <path> --name <name> --category <cat> [--archetype <arch>]
 *   node scripts/ingest-component.mjs --url <url> --name <name> --category <cat> [--archetype <arch>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  sanitizeHtml,
  adaptCssTokens,
  extractHtmlAndCss,
} from './lib/component-sanitizer.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const REGISTRY_DIR = path.join(REPO_ROOT, 'scripts', 'data', 'component-registry');
const REGISTRY_FILE = path.join(REGISTRY_DIR, 'registry.json');

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function printUsage() {
  console.log(`
Human Component Registry & Ingestion CLI

Usage:
  node scripts/ingest-component.mjs --list [--category <cat>] [--archetype <arch>]
  node scripts/ingest-component.mjs --get <id> [--css|--html|--both]
  node scripts/ingest-component.mjs --search <query>
  node scripts/ingest-component.mjs --file <path> --name <name> --category <cat> [--archetype <arch>]
  node scripts/ingest-component.mjs --url <url> --name <name> --category <cat> [--archetype <arch>]

Options:
  --category    Filter or assign category (bento, cards, navigation, heros, buttons)
  --archetype   Filter or assign aesthetic archetype (modern-saas, editorial-luxury, etc.)
  --tags        Comma-separated tags for ingested component
  --preview     Description of component craft
`);
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_FILE)) {
    return { components: [] };
  }
  return JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf-8'));
}

function saveRegistry(registry) {
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2) + '\n', 'utf-8');
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function runList(categoryFilter, archetypeFilter) {
  const registry = loadRegistry();
  let components = registry.components || [];

  if (categoryFilter) {
    components = components.filter(
      (c) => c.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }
  if (archetypeFilter) {
    components = components.filter(
      (c) => c.archetype.toLowerCase() === archetypeFilter.toLowerCase()
    );
  }

  console.log(`\n========================================================================`);
  console.log(`                   HUMAN UI COMPONENT REGISTRY                         `);
  console.log(`========================================================================`);
  console.log(`Found: ${components.length} component(s)\n`);

  if (components.length === 0) {
    console.log('No components match the specified filters.');
    return;
  }

  const colWidths = { id: 28, cat: 12, arch: 18, name: 30 };
  console.log(
    `${'ID'.padEnd(colWidths.id)} | ${'Category'.padEnd(colWidths.cat)} | ${'Archetype'.padEnd(colWidths.arch)} | Name`
  );
  console.log('-'.repeat(95));

  for (const c of components) {
    console.log(
      `${c.id.padEnd(colWidths.id)} | ${c.category.padEnd(colWidths.cat)} | ${c.archetype.padEnd(colWidths.arch)} | ${c.name}`
    );
  }
  console.log('========================================================================\n');
}

function runGet(id, mode) {
  if (!id) {
    console.error('Error: --get requires a component ID.');
    process.exit(1);
  }

  const registry = loadRegistry();
  const componentEntry = (registry.components || []).find((c) => c.id === id);

  if (!componentEntry) {
    console.error(`Error: Component '${id}' not found in registry.`);
    process.exit(1);
  }

  const componentPath = path.join(REGISTRY_DIR, componentEntry.path);
  if (!fs.existsSync(componentPath)) {
    console.error(`Error: Component data file missing at '${componentPath}'.`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(componentPath, 'utf-8'));
  const outputMode = mode || (hasFlag('css') ? 'css' : hasFlag('html') ? 'html' : 'both');

  if (outputMode === 'html' || outputMode === 'both') {
    if (outputMode === 'both') console.log(`\n<!-- Component: ${data.name} (${data.id}) -->`);
    console.log(data.html);
  }

  if (outputMode === 'css' || outputMode === 'both') {
    if (outputMode === 'both') console.log(`\n/* Stylesheet: ${data.name} */`);
    console.log(data.css);
  }
}

function runSearch(query) {
  if (!query) {
    console.error('Error: --search requires a query string.');
    process.exit(1);
  }

  const q = query.toLowerCase();
  const registry = loadRegistry();
  const matches = (registry.components || []).filter((c) => {
    return (
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  console.log(`\nSearch results for "${query}" (${matches.length} matches):`);
  console.log('------------------------------------------------------------------------');
  for (const m of matches) {
    console.log(`• ${m.id} [${m.category}] — ${m.name} (${(m.tags || []).join(', ')})`);
  }
  console.log('------------------------------------------------------------------------\n');
}

function validateUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(`Unsupported protocol: ${parsed.protocol}. Only http: and https: allowed.`);
    }

    const host = parsed.hostname.toLowerCase();
    // SSRF protection: block loopback and private networks
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      throw new Error(`SSRF blocked: Requests to internal/loopback host '${host}' are forbidden.`);
    }
    return parsed;
  } catch (err) {
    console.error(`URL validation failed: ${err.message}`);
    process.exit(1);
  }
}

function registerComponentData(name, category, archetype, tags, rawContent, previewText) {
  const id = slugify(name);
  const cat = slugify(category || 'misc');
  const arch = archetype || 'modern-saas';
  const tagList = tags
    ? tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [cat, id];

  const { html, css } = extractHtmlAndCss(rawContent);

  if (!html && !css) {
    console.error('Error: Ingested content contained no valid HTML markup or CSS.');
    process.exit(1);
  }

  // Ensure target category directory exists
  const targetDir = path.join(REGISTRY_DIR, cat);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const relFilePath = `${cat}/${id}.json`;
  const fullFilePath = path.join(REGISTRY_DIR, relFilePath);

  // Path traversal guard
  if (!fullFilePath.startsWith(REGISTRY_DIR)) {
    console.error('Error: Invalid path resolution outside registry root.');
    process.exit(1);
  }

  const componentPayload = {
    id,
    name,
    category: cat,
    archetype: arch,
    tags: tagList,
    tokensUsed: ['--surface', '--border', '--text-primary'],
    preview: previewText || `Ingested component: ${name}`,
    html,
    css,
  };

  fs.writeFileSync(fullFilePath, JSON.stringify(componentPayload, null, 2) + '\n', 'utf-8');

  // Update registry.json
  const registry = loadRegistry();
  const existingIdx = (registry.components || []).findIndex((c) => c.id === id);

  const manifestEntry = {
    id,
    name,
    category: cat,
    archetype: arch,
    tags: tagList,
    tokensUsed: componentPayload.tokensUsed,
    path: relFilePath,
  };

  if (existingIdx !== -1) {
    registry.components[existingIdx] = manifestEntry;
    console.log(`Updated existing registry component: ${id}`);
  } else {
    registry.components.push(manifestEntry);
    console.log(`Registered new component: ${id} (${cat})`);
  }

  saveRegistry(registry);
  console.log(`✓ Successfully ingested and sanitized '${name}' -> ${relFilePath}`);
}

async function runFileIngest(filePath, name, category, archetype, tags) {
  if (!filePath || !name) {
    console.error('Error: --file requires --name and a valid file path.');
    process.exit(1);
  }

  const resolved = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`Error: File not found at '${resolved}'.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(resolved, 'utf-8');
  registerComponentData(name, category, archetype, tags, raw, `Imported from ${filePath}`);
}

async function runUrlIngest(rawUrl, name, category, archetype, tags) {
  if (!rawUrl || !name) {
    console.error('Error: --url requires a URL and --name.');
    process.exit(1);
  }

  const parsedUrl = validateUrl(rawUrl);
  console.log(`Fetching component snippet from ${parsedUrl.href}...`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(parsedUrl.href, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Frontend-Skill-Ingestion-Bot/1.0',
        Accept: 'text/html, text/plain, */*',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }

    const raw = await res.text();
    registerComponentData(name, category, archetype, tags, raw, `Imported from ${parsedUrl.href}`);
  } catch (err) {
    console.error(`Failed to ingest from URL: ${err.message}`);
    process.exit(1);
  }
}

async function main() {
  if (hasFlag('list')) {
    runList(arg('category'), arg('archetype'));
    return;
  }

  if (hasFlag('get')) {
    const id = arg('get');
    runGet(id, arg('mode'));
    return;
  }

  if (hasFlag('search')) {
    const query = arg('search');
    runSearch(query);
    return;
  }

  if (hasFlag('file')) {
    const filePath = arg('file');
    const name = arg('name') || path.basename(filePath, path.extname(filePath));
    const category = arg('category') || 'cards';
    const archetype = arg('archetype') || 'modern-saas';
    const tags = arg('tags');
    await runFileIngest(filePath, name, category, archetype, tags);
    return;
  }

  if (hasFlag('url')) {
    const rawUrl = arg('url');
    const name = arg('name') || 'External Component';
    const category = arg('category') || 'cards';
    const archetype = arg('archetype') || 'modern-saas';
    const tags = arg('tags');
    await runUrlIngest(rawUrl, name, category, archetype, tags);
    return;
  }

  printUsage();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
