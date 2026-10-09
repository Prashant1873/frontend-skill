#!/usr/bin/env node

/**
 * Validate reference playbooks in Frontend Skill.
 * Verifies file existence, headings, placeholder absence, and relative link integrity.
 *
 * Usage:
 *   node scripts/validate-playbooks.mjs [--json] [--quiet] [--dir <path>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_REF_DIR = path.resolve(ROOT_DIR, 'reference');

function parseArgs(argv) {
  const flags = {
    json: false,
    quiet: false,
    dir: DEFAULT_REF_DIR,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') {
      flags.json = true;
    } else if (arg === '--quiet') {
      flags.quiet = true;
    } else if (arg === '--dir' && argv[i + 1]) {
      flags.dir = path.resolve(process.cwd(), argv[++i]);
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/validate-playbooks.mjs [--json] [--quiet] [--dir <path>]');
      process.exit(0);
    }
  }

  return flags;
}

function discoverMarkdownFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...discoverMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

function extractMarkdownLinks(content) {
  const links = [];
  // Match [text](link)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const rawTarget = match[2].trim();
    // Exclude web urls, anchors only, and mailto
    if (
      rawTarget.startsWith('http://') ||
      rawTarget.startsWith('https://') ||
      rawTarget.startsWith('#') ||
      rawTarget.startsWith('mailto:')
    ) {
      continue;
    }
    // Remove query params or anchor hash
    const cleanTarget = rawTarget.split('#')[0].split('?')[0];
    if (cleanTarget.length > 0) {
      links.push({
        raw: rawTarget,
        target: cleanTarget,
        text: match[1],
      });
    }
  }
  return links;
}

function validateFile(filePath, rootDir) {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const issues = [];

  const stat = fs.statSync(filePath);
  if (stat.size === 0) {
    issues.push({ type: 'empty_file', message: 'File is 0 bytes' });
    return { file: relPath, issues };
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  // Check heading / frontmatter
  let hasValidStart = false;
  let inFrontmatter = false;

  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const trimmed = lines[i].trim();
    if (i === 0 && trimmed === '---') {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter) {
      if (trimmed === '---') {
        hasValidStart = true;
        break;
      }
      continue;
    }
    if (trimmed.startsWith('#')) {
      hasValidStart = true;
      break;
    }
  }

  if (!hasValidStart) {
    issues.push({ type: 'missing_heading', message: 'No top-level heading (# ) or frontmatter found' });
  }

  // Check placeholder patterns (uppercase TODO/TBD/FIXME or lorem ipsum)
  const placeholderRegex = /(\b(TODO|TBD|FIXME):|\b(TODO|TBD|FIXME)\b|lorem ipsum)/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Exclude code property accesses (e.g. .todo) or rule IDs/urls
    if (
      placeholderRegex.test(line) &&
      !line.includes('no-todo') &&
      !line.includes('antipattern') &&
      !line.includes('._') &&
      !line.includes('.todo')
    ) {
      issues.push({
        type: 'placeholder',
        message: `Placeholder pattern detected at line ${i + 1}: "${line.trim().slice(0, 60)}"`,
      });
    }
  }

  // Validate internal links
  const fileDir = path.dirname(filePath);
  const links = extractMarkdownLinks(content);
  for (const link of links) {
    const resolvedPath = path.resolve(fileDir, link.target);
    if (!fs.existsSync(resolvedPath)) {
      issues.push({
        type: 'broken_link',
        message: `Broken internal link "${link.raw}" pointing to non-existent "${path.relative(rootDir, resolvedPath).replace(/\\/g, '/')}"`,
      });
    }
  }

  return { file: relPath, issues };
}

function main() {
  const flags = parseArgs(process.argv);
  const files = discoverMarkdownFiles(flags.dir);

  if (files.length === 0) {
    if (flags.json) {
      console.log(JSON.stringify({ valid: false, error: `No markdown files found in ${flags.dir}` }, null, 2));
    } else {
      console.error(`Error: No markdown files found in ${flags.dir}`);
    }
    process.exit(1);
  }

  const results = [];
  let totalIssues = 0;

  for (const file of files) {
    const res = validateFile(file, ROOT_DIR);
    if (res.issues.length > 0) {
      totalIssues += res.issues.length;
    }
    results.push(res);
  }

  const valid = totalIssues === 0;

  if (flags.json) {
    console.log(
      JSON.stringify(
        {
          valid,
          total_files: files.length,
          total_issues: totalIssues,
          results: results.filter((r) => r.issues.length > 0),
        },
        null,
        2
      )
    );
  } else {
    if (!flags.quiet) {
      console.log(`\nPlaybook Integrity Validation: ${flags.dir}`);
      console.log(`Total playbooks inspected: ${files.length}`);
      console.log(`----------------------------------------`);
      for (const res of results) {
        if (res.issues.length > 0) {
          console.log(`\n❌ ${res.file}`);
          for (const issue of res.issues) {
            console.log(`   - [${issue.type}] ${issue.message}`);
          }
        }
      }
    }

    if (valid) {
      console.log(`\n✓ All ${files.length} playbooks passed structural and link validation.`);
    } else {
      console.log(`\n✗ Found ${totalIssues} issue(s) across playbooks.`);
    }
  }

  process.exit(valid ? 0 : 1);
}

main();
