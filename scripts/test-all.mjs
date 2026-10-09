#!/usr/bin/env node
/**
 * Unified Test & Verification Pipeline Runner.
 * Executes all test and validation suites for Frontend Skill:
 *  1. Playbook structural integrity & link validation
 *  2. SKILL.md command routing validation
 *  3. Antipattern detector unit and fixture test suite
 *  4. Doctor automation, schema compliance, and exit code suite
 *  5. Live repository doctor health scan
 *
 * Usage:
 *   node scripts/test-all.mjs        # Standard execution with summary table
 *   node scripts/test-all.mjs --json # Machine-readable JSON output
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');

const SUITES = [
  {
    name: 'Playbook Integrity',
    script: path.join(SCRIPT_DIR, 'validate-playbooks.mjs'),
    args: [],
    description: 'Structure, headings, and links across reference playbooks',
  },
  {
    name: 'SKILL.md Routing',
    script: path.join(SCRIPT_DIR, 'validate-routing.mjs'),
    args: [],
    description: 'Command routing targets and cross-references',
  },
  {
    name: 'Antipattern Detector',
    script: path.join(SCRIPT_DIR, 'test-detector.mjs'),
    args: [],
    description: 'Unit and fixture tests for UI antipattern rules',
  },
  {
    name: 'Curated Typography & Fallbacks',
    script: path.join(REPO_ROOT, 'test', 'test-font-fallbacks.mjs'),
    args: [],
    description: 'Curated font archetype catalog and zero-CLS metric fallbacks',
  },
  {
    name: 'Perceptual Color Engine',
    script: path.join(REPO_ROOT, 'test', 'test-color-engine.mjs'),
    args: [],
    description: 'OKLCH conversions, gamut clipping, and WCAG/APCA contrast math',
  },
  {
    name: 'Component Ingestion & Registry',
    script: path.join(REPO_ROOT, 'test', 'test-ingestion.mjs'),
    args: [],
    description: 'HTML/CSS sanitization, token mapping, and registry integrity',
  },
  {
    name: 'Tactile Buttons Engine',
    script: path.join(REPO_ROOT, 'test', 'test-buttons.mjs'),
    args: [],
    description: 'Squish spring physics, geometry classes, and button tokens',
  },
  {
    name: 'Human Editorial Architecture',
    script: path.join(REPO_ROOT, 'test', 'test-editorial.mjs'),
    args: [],
    description: 'Anti-pill rules, asymmetric editorial layouts, and hairline dividers',
  },
  {
    name: 'Asymmetric Bento Grids',
    script: path.join(REPO_ROOT, 'test', 'test-bento.mjs'),
    args: [],
    description: 'Responsive multi-span Bento grids and asymmetric layout rhythms',
  },
  {
    name: 'Natural Language Router',
    script: path.join(REPO_ROOT, 'test', 'test-router.mjs'),
    args: [],
    description: 'Surgical intent routing, green-field consent, and agent directive consistency',
  },
  {
    name: 'Visual Sandbox & Test Bench',
    script: path.join(REPO_ROOT, 'test', 'test-sandbox.mjs'),
    args: [],
    description: 'Local zero-dependency HTTP server, API endpoints, and sandbox UI',
  },
  {
    name: 'Multi-Variant Prototype Engine',
    script: path.join(REPO_ROOT, 'test', 'test-prototype.mjs'),
    args: [],
    description: 'PICKER.md spec, floating glass switcher, keyboard controls, and URL sync',
  },
  {
    name: 'Doctor Automation',
    script: path.join(SCRIPT_DIR, 'test-doctor.mjs'),
    args: [],
    description: 'CLI exit codes, schema validation, and corruption tests',
  },
  {
    name: 'Repository Doctor Scan',
    script: path.join(SCRIPT_DIR, 'doctor.mjs'),
    args: ['--strict'],
    description: 'Active repository artifact health and drift check',
  },
];

function runSuite(suite, isJsonMode) {
  const start = performance.now();
  let exitCode = 0;
  let stdout = '';
  let stderr = '';

  try {
    stdout = execFileSync(process.execPath, [suite.script, ...suite.args], {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    exitCode = err.status ?? 1;
    stdout = err.stdout?.toString?.() || '';
    stderr = err.stderr?.toString?.() || '';
  }

  const durationMs = Math.round(performance.now() - start);

  if (!isJsonMode) {
    const symbol = exitCode === 0 ? '✓ PASS' : '✗ FAIL';
    console.log(`[${symbol}] ${suite.name} (${durationMs}ms)`);
    if (exitCode !== 0) {
      if (stdout) console.log(stdout.trim());
      if (stderr) console.error(stderr.trim());
    }
  }

  return {
    name: suite.name,
    description: suite.description,
    status: exitCode === 0 ? 'PASS' : 'FAIL',
    exitCode,
    durationMs,
    output: stdout.trim(),
    error: stderr.trim(),
  };
}

function printSummaryTable(results, totalDurationMs) {
  console.log('\n========================================================================');
  console.log('                 UNIFIED VERIFICATION PIPELINE SUMMARY                 ');
  console.log('========================================================================');

  const colWidths = { name: 26, status: 10, duration: 12, desc: 20 };
  const header = `${'Suite'.padEnd(colWidths.name)} | ${'Status'.padEnd(colWidths.status)} | ${'Duration'.padEnd(colWidths.duration)} | Description`;
  console.log(header);
  console.log('-'.repeat(header.length + 15));

  for (const r of results) {
    const statusStr = r.status === 'PASS' ? '✓ PASS' : '✗ FAIL';
    const durStr = `${r.durationMs}ms`;
    console.log(
      `${r.name.padEnd(colWidths.name)} | ${statusStr.padEnd(colWidths.status)} | ${durStr.padEnd(colWidths.duration)} | ${r.description}`
    );
  }

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log('------------------------------------------------------------------------');
  console.log(`Total: ${results.length} suites | Passed: ${passed} | Failed: ${failed} | Duration: ${totalDurationMs}ms`);
  console.log('========================================================================\n');
}

function main() {
  const isJsonMode = process.argv.includes('--json');
  const pipelineStart = performance.now();

  if (!isJsonMode) {
    console.log('Running unified test and verification pipeline...\n');
  }

  const results = [];
  for (const suite of SUITES) {
    results.push(runSuite(suite, isJsonMode));
  }

  const totalDurationMs = Math.round(performance.now() - pipelineStart);
  const allPassed = results.every((r) => r.status === 'PASS');

  if (isJsonMode) {
    const report = {
      passed: allPassed,
      totalSuites: results.length,
      passedSuites: results.filter((r) => r.status === 'PASS').length,
      failedSuites: results.filter((r) => r.status === 'FAIL').length,
      totalDurationMs,
      suites: results.map((r) => ({
        name: r.name,
        description: r.description,
        status: r.status,
        exitCode: r.exitCode,
        durationMs: r.durationMs,
      })),
    };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    printSummaryTable(results, totalDurationMs);
    if (allPassed) {
      console.log('✓ All verification suites passed successfully!\n');
    } else {
      console.error('✗ One or more verification suites failed.\n');
    }
  }

  process.exit(allPassed ? 0 : 1);
}

main();
