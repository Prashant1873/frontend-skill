#!/usr/bin/env node

/**
 * Antipattern Detector Unit & Fixture Test Suite.
 * Exercises detectText and detectHtml engines against unit cases and positive/negative fixtures.
 *
 * Usage:
 *   node scripts/test-detector.mjs [--json] [--quiet]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectText, detectHtml } from './detector/detect-antipatterns.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const FIXTURES_DIR = path.resolve(ROOT_DIR, 'test', 'fixtures');

function parseArgs(argv) {
  const flags = { json: false, quiet: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') flags.json = true;
    else if (arg === '--quiet') flags.quiet = true;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/test-detector.mjs [--json] [--quiet]');
      process.exit(0);
    }
  }
  return flags;
}

class TestSuite {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  async run(name, fn) {
    const start = Date.now();
    try {
      await fn();
      const duration = Date.now() - start;
      this.passed++;
      this.tests.push({ name, status: 'pass', duration });
    } catch (err) {
      const duration = Date.now() - start;
      this.failed++;
      this.tests.push({ name, status: 'fail', duration, error: err.message });
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertHasFinding(findings, expectedRule, testContext) {
    const list = Array.isArray(findings) ? findings : [];
    const hasRule = list.some((f) => (f.antipattern || f.ruleId || f.id) === expectedRule);
    if (!hasRule) {
      const foundRules = list.map((f) => f.antipattern || f.ruleId || f.id).join(', ') || 'none';
      throw new Error(`Expected rule "${expectedRule}" not found in [${foundRules}] (${testContext})`);
    }
  }

  assertNoFindings(findings, testContext) {
    const list = Array.isArray(findings) ? findings : [];
    // Filter out advisory rules if any
    const blocking = list.filter((f) => f.severity !== 'advisory');
    if (blocking.length > 0) {
      const found = blocking.map((f) => `${f.antipattern || f.ruleId}: ${f.snippet || f.description}`).join('; ');
      throw new Error(`Expected zero findings, but found ${blocking.length}: ${found} (${testContext})`);
    }
  }
}

async function main() {
  const flags = parseArgs(process.argv);
  const suite = new TestSuite();

  // ── Unit Tests: detectText engine ──
  await suite.run('Unit: detectText catches overused-font (Inter)', () => {
    const css = '.hero { font-family: "Inter", sans-serif; }';
    const findings = detectText(css, 'hero.css');
    suite.assertHasFinding(findings, 'overused-font', 'inline css');
  });

  await suite.run('Unit: detectText catches gradient-text on headings', () => {
    const css = 'h1 { background: linear-gradient(#f00, #00f); -webkit-background-clip: text; color: transparent; }';
    const findings = detectText(css, 'heading.css');
    suite.assertHasFinding(findings, 'gradient-text', 'gradient text heading');
  });

  await suite.run('Unit: detectText catches side-tab accent border', () => {
    const css = '.card { border-left: 4px solid #3b82f6; border-radius: 8px; }';
    const findings = detectText(css, 'card.css');
    suite.assertHasFinding(findings, 'side-tab', 'side-tab border');
  });

  await suite.run('Unit: detectText passes clean typography and color', () => {
    const css = 'body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #111827; }';
    const findings = detectText(css, 'clean.css');
    suite.assertNoFindings(findings, 'clean css');
  });

  // ── Fixture Tests: detectHtml & detectText on test/fixtures/ ──
  const typographyFixture = path.join(FIXTURES_DIR, 'slop-typography.html');
  await suite.run('Fixture: slop-typography.html triggers overused-font', async () => {
    suite.assert(fs.existsSync(typographyFixture), 'Fixture file exists');
    const findings = await detectHtml(typographyFixture);
    suite.assertHasFinding(findings, 'overused-font', 'slop-typography fixture');
  });

  const colorsFixture = path.join(FIXTURES_DIR, 'slop-colors.html');
  await suite.run('Fixture: slop-colors.html triggers gradient-text', async () => {
    suite.assert(fs.existsSync(colorsFixture), 'Fixture file exists');
    const findings = await detectHtml(colorsFixture);
    suite.assertHasFinding(findings, 'gradient-text', 'slop-colors fixture');
  });

  const layoutFixture = path.join(FIXTURES_DIR, 'slop-layout.html');
  await suite.run('Fixture: slop-layout.html triggers side-tab', async () => {
    suite.assert(fs.existsSync(layoutFixture), 'Fixture file exists');
    const findings = await detectHtml(layoutFixture);
    suite.assertHasFinding(findings, 'side-tab', 'slop-layout fixture');
  });

  const cleanFixture = path.join(FIXTURES_DIR, 'clean-accessible.html');
  await suite.run('Fixture: clean-accessible.html produces zero findings (negative control)', async () => {
    suite.assert(fs.existsSync(cleanFixture), 'Fixture file exists');
    const findings = await detectHtml(cleanFixture);
    suite.assertNoFindings(findings, 'clean-accessible fixture');
  });

  // Output formatting
  const success = suite.failed === 0;

  if (flags.json) {
    console.log(
      JSON.stringify(
        {
          success,
          total: suite.tests.length,
          passed: suite.passed,
          failed: suite.failed,
          tests: suite.tests,
        },
        null,
        2
      )
    );
  } else {
    if (!flags.quiet) {
      console.log('\nAntipattern Detector Test Suite');
      console.log('----------------------------------------');
      for (const t of suite.tests) {
        if (t.status === 'pass') {
          console.log(`  ✓ ${t.name} (${t.duration}ms)`);
        } else {
          console.log(`  ✗ ${t.name} (${t.duration}ms)`);
          console.log(`    Error: ${t.error}`);
        }
      }
      console.log('----------------------------------------');
    }

    if (success) {
      console.log(`\n✓ All ${suite.tests.length} detector tests passed cleanly.`);
    } else {
      console.log(`\n✗ ${suite.failed} of ${suite.tests.length} tests failed.`);
    }
  }

  process.exit(success ? 0 : 1);
}

main();
