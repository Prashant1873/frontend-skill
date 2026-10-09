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

  await suite.run('Unit: detectText catches generic-pill-badge', () => {
    const html = '<span class="pill-badge">NEW FEATURE</span><h1>Headline</h1>';
    const findings = detectText(html, 'hero.html');
    suite.assertHasFinding(findings, 'generic-pill-badge', 'pill badge kicker');
  });

  await suite.run('Unit: detectText catches button-missing-active-squish', () => {
    const css = '.btn { color: #fff; background: #000; } .btn:hover { background: #222; }';
    const findings = detectText(css, 'button.css');
    suite.assertHasFinding(findings, 'button-missing-active-squish', 'unsquished button');
  });

  await suite.run('Unit: detectText catches button-insufficient-contrast', () => {
    const css = 'button { color: #94a3b8; background: #ffffff; }';
    const findings = detectText(css, 'button.css');
    suite.assertHasFinding(findings, 'button-insufficient-contrast', 'low contrast button');
  });

  await suite.run('Unit: detectText passes tactile button with active squish', () => {
    const css = '.tactile-btn { color: #fff; background: #0284c7; } .tactile-btn:hover { background: #0369a1; } .tactile-btn:active { transform: scale(1.03, 0.94); }';
    const findings = detectText(css, 'tactile-button.css');
    suite.assertNoFindings(findings, 'tactile button');
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

  const pillFixture = path.join(FIXTURES_DIR, 'slop-eyebrow-pill.html');
  await suite.run('Fixture: slop-eyebrow-pill.html triggers generic-pill-badge', async () => {
    suite.assert(fs.existsSync(pillFixture), 'Fixture file exists');
    const findings = await detectHtml(pillFixture);
    suite.assertHasFinding(findings, 'generic-pill-badge', 'slop-eyebrow-pill fixture');
  });

  const buttonFixture = path.join(FIXTURES_DIR, 'slop-button.html');
  await suite.run('Fixture: slop-button.html triggers button dynamics rules', async () => {
    suite.assert(fs.existsSync(buttonFixture), 'Fixture file exists');
    const findings = await detectHtml(buttonFixture);
    suite.assertHasFinding(findings, 'button-missing-active-squish', 'slop-button fixture missing squish');
    suite.assertHasFinding(findings, 'button-insufficient-contrast', 'slop-button fixture contrast');
  });

  const cleanFixture = path.join(FIXTURES_DIR, 'clean-accessible.html');
  await suite.run('Fixture: clean-accessible.html produces zero findings (negative control)', async () => {
    suite.assert(fs.existsSync(cleanFixture), 'Fixture file exists');
    const findings = await detectHtml(cleanFixture);
    suite.assertNoFindings(findings, 'clean-accessible fixture');
  });

  const cleanButtonsFixture = path.join(FIXTURES_DIR, 'clean-tactile-buttons.html');
  await suite.run('Fixture: clean-tactile-buttons.html produces zero findings (negative control)', async () => {
    suite.assert(fs.existsSync(cleanButtonsFixture), 'Fixture file exists');
    const findings = await detectHtml(cleanButtonsFixture);
    suite.assertNoFindings(findings, 'clean-tactile-buttons fixture');
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
