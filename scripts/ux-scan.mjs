#!/usr/bin/env node
/**
 * ux-scan.mjs: Cognitive UX Laws Audit & Friction Scanner CLI.
 *
 * Scans HTML/CSS deliverables against fundamental behavioral psychology laws:
 * - Hick's Law: Decision latency & competing primary CTAs
 * - Fitts's Law: Touch target geometry (Apple 44px / WCAG 24px)
 * - Miller's Law: Chunking & working memory overload (forms & lists)
 *
 * Computes Cognitive Friction Index (CFI 0-100) and actionable remediation diffs.
 *
 * Usage:
 *   node scripts/ux-scan.mjs --target index.html
 *   node scripts/ux-scan.mjs --target ./src --max-friction 35
 *   node scripts/ux-scan.mjs --target prototype.html --json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanMarkup, generateRemediationDiff } from './lib/ux-engine.mjs';

function printHelp() {
  console.log(`
Cognitive UX Laws Audit & Friction Scanner (Frontend Skill)

Usage:
  node scripts/ux-scan.mjs [options]

Options:
  --target <path>        Target HTML file or directory to scan (default: current directory HTML files)
  --max-friction <score> Maximum acceptable Cognitive Friction Index (0-100) threshold before exit code 1
  --format <fmt>         Output format: "text", "json", "diff" (default: "text")
  --json                 Shortcut for --format json
  -h, --help             Show this help message

Examples:
  node scripts/ux-scan.mjs --target index.html
  node scripts/ux-scan.mjs --target ./test/fixtures/clean-accessible.html --max-friction 25
  node scripts/ux-scan.mjs --target prototype.html --format diff
  node scripts/ux-scan.mjs --target ./dist --json
`.trim());
}

function parseArgs(args) {
  const options = {
    target: null,
    maxFriction: null,
    format: 'text',
    json: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--target' && i + 1 < args.length) {
      options.target = args[++i];
    } else if (arg === '--max-friction' && i + 1 < args.length) {
      options.maxFriction = Number(args[++i]);
    } else if (arg === '--format' && i + 1 < args.length) {
      options.format = args[++i].toLowerCase();
    } else if (arg === '--json') {
      options.json = true;
      options.format = 'json';
    }
  }

  return options;
}

/**
 * Finds all HTML files recursively in a directory.
 */
function findHtmlFiles(dirPath, files = []) {
  if (!fs.existsSync(dirPath)) return files;
  const stat = fs.statSync(dirPath);

  if (stat.isFile()) {
    if (dirPath.endsWith('.html') || dirPath.endsWith('.htm')) {
      files.push(dirPath);
    }
    return files;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath, files);
    } else if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.htm'))) {
      files.push(fullPath);
    }
  }

  return files;
}

export function runUxScanner(argv = process.argv.slice(2)) {
  const opts = parseArgs(argv);

  if (opts.help) {
    printHelp();
    return { exitCode: 0 };
  }

  const targetPath = opts.target || '.';
  const resolvedTarget = path.resolve(process.cwd(), targetPath);

  if (!fs.existsSync(resolvedTarget)) {
    console.error(`Error: Target path does not exist: ${targetPath}`);
    return { exitCode: 1 };
  }

  const htmlFiles = findHtmlFiles(resolvedTarget);
  if (htmlFiles.length === 0) {
    console.log(`No HTML files found to scan in: ${targetPath}`);
    return { exitCode: 0, results: [] };
  }

  const results = [];
  let highestScore = 0;
  let totalViolations = 0;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const report = scanMarkup(content, { file });
    report.file = path.relative(process.cwd(), file);
    results.push(report);

    if (report.score > highestScore) {
      highestScore = report.score;
    }
    totalViolations += report.findings.length;
  }

  // JSON Output
  if (opts.format === 'json') {
    const payload = {
      meta: {
        scanner: 'Cognitive UX Laws Audit & Friction Scanner',
        timestamp: new Date().toISOString(),
        scannedCount: htmlFiles.length,
        highestScore,
        maxFrictionThreshold: opts.maxFriction,
      },
      results,
    };
    console.log(JSON.stringify(payload, null, 2));

    const failedThreshold = opts.maxFriction !== null && highestScore > opts.maxFriction;
    return { exitCode: failedThreshold ? 1 : 0, results, highestScore };
  }

  // Diff / Remediation Output
  if (opts.format === 'diff') {
    for (const res of results) {
      console.log(`\n========================================================`);
      console.log(`File: ${res.file} (CFI: ${res.score}/100 - ${res.rating})`);
      console.log(`========================================================`);

      if (res.findings.length === 0) {
        console.log('✓ No cognitive friction violations detected.');
        continue;
      }

      for (const finding of res.findings) {
        console.log('\n' + generateRemediationDiff(finding));
      }
    }

    const failedThreshold = opts.maxFriction !== null && highestScore > opts.maxFriction;
    return { exitCode: failedThreshold ? 1 : 0, results, highestScore };
  }

  // Standard Text Output
  console.log(`\nCognitive UX Laws Audit Report (${htmlFiles.length} file(s) scanned)\n`);

  for (const res of results) {
    console.log(`------------------------------------------------------------------------`);
    console.log(`File: ${res.file}`);
    console.log(`Cognitive Friction Index (CFI): ${res.score}/100 [${res.rating}]`);
    console.log(`Violations: ${res.findings.length} (Hick's: ${res.summary.hicksViolations}, Fitts's: ${res.summary.fittsViolations}, Miller's: ${res.summary.millersViolations})`);

    if (res.findings.length > 0) {
      console.log(`\nKey Findings:`);
      for (const f of res.findings) {
        const sev = f.severity === 'error' ? '✖ ERROR' : '⚠ WARN';
        console.log(`  ${sev} [${f.ruleId}] Line ${f.line}: ${f.title}`);
        console.log(`    ${f.message}`);
        console.log(`    ↳ Remediation: ${f.remediation}`);
      }
    } else {
      console.log(`  ✓ Perfectly balanced cognitive ergonomics. No violations.`);
    }
  }

  console.log(`\n========================================================================`);
  console.log(`Summary: Highest CFI = ${highestScore}/100 across ${htmlFiles.length} file(s)`);

  let exitCode = 0;
  if (opts.maxFriction !== null && highestScore > opts.maxFriction) {
    console.error(`\n✖ FAILED: Highest CFI ${highestScore} exceeds threshold of ${opts.maxFriction}`);
    exitCode = 1;
  } else {
    console.log(`✓ Scan passed.`);
  }

  return { exitCode, results, highestScore };
}

// CLI Execution guard
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const result = runUxScanner();
  if (result?.exitCode !== 0) {
    process.exit(result?.exitCode ?? 1);
  }
}
