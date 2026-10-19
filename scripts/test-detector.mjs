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

  await suite.run('Unit: detectText catches generic electric blue AI heading', () => {
    const html = '<h2 class="text-blue-500 text-3xl">Generic Electric Cloud Engine</h2>';
    const findings = detectText(html, 'hero.html');
    suite.assertHasFinding(findings, 'ai-color-palette', 'generic electric blue heading');
  });

  await suite.run('Unit: detectText catches generic AI blue/cyan gradient', () => {
    const html = '<div class="bg-gradient-to-r from-blue-500 to-indigo-500">AI Gradient Card</div>';
    const findings = detectText(html, 'card.html');
    suite.assertHasFinding(findings, 'ai-color-palette', 'generic blue/indigo gradient');
  });

  await suite.run('Unit: detectText passes whitelisted brand colors (amber, teal, navy, royal, velvet)', () => {
    const html = `
      <h1 class="text-amber-500 text-3xl">Artisanal Honey</h1>
      <h2 class="text-teal-600 text-2xl">Deep Spruce Botanical</h2>
      <h2 class="text-blue-950 text-2xl">Midnight Navy Maritime</h2>
      <span class="text-orange-600">Terracotta Coral</span>
    `;
    const findings = detectText(html, 'characterful.html');
    suite.assertNoFindings(findings, 'whitelisted brand colors');
  });

  await suite.run('Unit: detectText catches generic-pill-badge', () => {
    const html = '<span class="pill-badge">NEW FEATURE</span><h1>Headline</h1>';
    const findings = detectText(html, 'hero.html');
    suite.assertHasFinding(findings, 'generic-pill-badge', 'pill badge kicker');
  });

  await suite.run('Unit: detectText catches monochromatic-pill-slop (light and dark mode)', () => {
    const lightHtml = '<div class="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1"><span>Dedicated</span></div>';
    const darkHtml = '<div class="rounded-full bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 px-3 py-1"><span>Dedicated</span></div>';
    const lightFindings = detectText(lightHtml, 'light-badge.html');
    const darkFindings = detectText(darkHtml, 'dark-badge.html');
    suite.assertHasFinding(lightFindings, 'monochromatic-pill-slop', 'light mode pill slop');
    suite.assertHasFinding(darkFindings, 'monochromatic-pill-slop', 'dark mode pill slop');
  });

  await suite.run('Unit: detectText catches monochromatic-pill-slop in React TSX (className and nested children)', () => {
    const tsxSingle = '<span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700">Dedicated</span>';
    const tsxNested = '<div className="rounded-full bg-blue-50 border border-blue-200">\n  <span className="text-blue-700">Dedicated</span>\n</div>';
    const singleFindings = detectText(tsxSingle, 'Badge.tsx');
    const nestedFindings = detectText(tsxNested, 'Badge.tsx');
    suite.assertHasFinding(singleFindings, 'monochromatic-pill-slop', 'TSX single line pill slop');
    suite.assertHasFinding(nestedFindings, 'monochromatic-pill-slop', 'TSX nested child pill slop');
  });

  await suite.run('Unit: detectText catches emoji-in-ui in buttons and badges', () => {
    const btnEmoji = '<button className="px-4 py-2">🚀 Launch Platform</button>';
    const badgeEmoji = '<span className="badge">✨ AI Powered</span>';
    const btnFindings = detectText(btnEmoji, 'Button.tsx');
    const badgeFindings = detectText(badgeEmoji, 'Hero.tsx');
    suite.assertHasFinding(btnFindings, 'emoji-in-ui', 'button with raw emoji');
    suite.assertHasFinding(badgeFindings, 'emoji-in-ui', 'badge with raw emoji');
  });

  await suite.run('Unit: detectText catches monochromatic pill slop in CSS regardless of property order', () => {
    const css = '.pill-slop { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 9999px; }';
    const findings = detectText(css, 'styles.css');
    suite.assertHasFinding(findings, 'monochromatic-pill-slop', 'CSS pill slop with reversed property order');
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

  await suite.run('Unit: detectText catches gesture-linear-transition', () => {
    const css = '.bottom-sheet { transition: transform 0.3s linear; }';
    const findings = detectText(css, 'gesture.css');
    suite.assertHasFinding(findings, 'gesture-linear-transition', 'linear gesture transition');
  });

  await suite.run('Unit: detectText catches gesture-pointer-lag', () => {
    const css = '.drag-handle { width: 40px; height: 6px; touch-action: auto; }';
    const findings = detectText(css, 'drag.css');
    suite.assertHasFinding(findings, 'gesture-pointer-lag', 'missing touch-action');
  });

  await suite.run('Unit: detectText catches touch-target-sub-44px', () => {
    const css = '.close-btn { width: 20px; height: 20px; }';
    const findings = detectText(css, 'button.css');
    suite.assertHasFinding(findings, 'touch-target-sub-44px', 'sub-44px button');
  });

  await suite.run('Unit: detectText catches segmented-rigid-sliding-pill', () => {
    const css = '.segmented-indicator { transition: left 0.3s ease; }';
    const findings = detectText(css, 'segmented.css');
    suite.assertHasFinding(findings, 'segmented-rigid-sliding-pill', 'rigid sliding pill');
  });

  await suite.run('Unit: detectText catches non-concentric-border-radius', () => {
    const css = '.card { padding: 8px; border-radius: 12px; } .card .inner { border-radius: 12px; }';
    const findings = detectText(css, 'card.css');
    suite.assertHasFinding(findings, 'non-concentric-border-radius', 'non-concentric nested radius');
  });

  await suite.run('Unit: detectText catches off-center-icon-container', () => {
    const css = '.btn svg { width: 16px; height: 16px; }';
    const findings = detectText(css, 'btn.css');
    suite.assertHasFinding(findings, 'off-center-icon-container', 'off-center button icon');
  });

  // ── Fixture Tests: detectHtml & detectText on test/fixtures/ ──
  const typographyFixture = path.join(FIXTURES_DIR, 'slop-typography.html');
  await suite.run('Fixture: slop-typography.html triggers overused-font', async () => {
    suite.assert(fs.existsSync(typographyFixture), 'Fixture file exists');
    const findings = await detectHtml(typographyFixture);
    suite.assertHasFinding(findings, 'overused-font', 'slop-typography fixture');
  });

  const colorsFixture = path.join(FIXTURES_DIR, 'slop-colors.html');
  await suite.run('Fixture: slop-colors.html triggers gradient-text and ai-color-palette', async () => {
    suite.assert(fs.existsSync(colorsFixture), 'Fixture file exists');
    const findings = await detectHtml(colorsFixture);
    suite.assertHasFinding(findings, 'gradient-text', 'slop-colors fixture');
    suite.assertHasFinding(findings, 'ai-color-palette', 'slop-colors fixture');
  });

  const layoutFixture = path.join(FIXTURES_DIR, 'slop-layout.html');
  await suite.run('Fixture: slop-layout.html triggers side-tab', async () => {
    suite.assert(fs.existsSync(layoutFixture), 'Fixture file exists');
    const findings = await detectHtml(layoutFixture);
    suite.assertHasFinding(findings, 'side-tab', 'slop-layout fixture');
  });

  const pillFixture = path.join(FIXTURES_DIR, 'slop-eyebrow-pill.html');
  await suite.run('Fixture: slop-eyebrow-pill.html triggers generic-pill-badge and monochromatic-pill-slop', async () => {
    suite.assert(fs.existsSync(pillFixture), 'Fixture file exists');
    const findings = await detectHtml(pillFixture);
    suite.assertHasFinding(findings, 'generic-pill-badge', 'slop-eyebrow-pill fixture');
    suite.assertHasFinding(findings, 'monochromatic-pill-slop', 'slop-eyebrow-pill fixture');
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

  const cleanColorsFixture = path.join(FIXTURES_DIR, 'clean-characterful-colors.html');
  await suite.run('Fixture: clean-characterful-colors.html produces zero findings (whitelisted brand colors)', async () => {
    suite.assert(fs.existsSync(cleanColorsFixture), 'Fixture file exists');
    const findings = await detectHtml(cleanColorsFixture);
    suite.assertNoFindings(findings, 'clean-characterful-colors fixture');
  });

  const slopGesturesFixture = path.join(FIXTURES_DIR, 'slop-gestures.html');
  await suite.run('Fixture: slop-gestures.html triggers gesture and touch target rules', async () => {
    suite.assert(fs.existsSync(slopGesturesFixture), 'Fixture file exists');
    const findings = await detectHtml(slopGesturesFixture);
    suite.assertHasFinding(findings, 'gesture-linear-transition', 'slop-gestures linear transition');
    suite.assertHasFinding(findings, 'gesture-pointer-lag', 'slop-gestures pointer lag');
    suite.assertHasFinding(findings, 'touch-target-sub-44px', 'slop-gestures sub-44px target');
  });

  const cleanGesturesFixture = path.join(FIXTURES_DIR, 'clean-gestures.html');
  await suite.run('Fixture: clean-gestures.html produces zero findings (negative control)', async () => {
    suite.assert(fs.existsSync(cleanGesturesFixture), 'Fixture file exists');
    const findings = await detectHtml(cleanGesturesFixture);
    suite.assertNoFindings(findings, 'clean-gestures fixture');
  });

  const slopSegmentedFixture = path.join(FIXTURES_DIR, 'slop-segmented.html');
  await suite.run('Fixture: slop-segmented.html triggers segmented-rigid-sliding-pill', async () => {
    suite.assert(fs.existsSync(slopSegmentedFixture), 'Fixture file exists');
    const findings = await detectHtml(slopSegmentedFixture);
    suite.assertHasFinding(findings, 'segmented-rigid-sliding-pill', 'slop-segmented rigid indicator');
  });

  const slopConcentricFixture = path.join(FIXTURES_DIR, 'slop-concentric.html');
  await suite.run('Fixture: slop-concentric.html triggers non-concentric and off-center rules', async () => {
    suite.assert(fs.existsSync(slopConcentricFixture), 'Fixture file exists');
    const findings = await detectHtml(slopConcentricFixture);
    suite.assertHasFinding(findings, 'non-concentric-border-radius', 'slop-concentric border radius');
    suite.assertHasFinding(findings, 'off-center-icon-container', 'slop-concentric off-center icon');
  });

  const cleanSegmentedFixture = path.join(FIXTURES_DIR, 'clean-segmented.html');
  await suite.run('Fixture: clean-segmented.html produces zero findings (negative control)', async () => {
    suite.assert(fs.existsSync(cleanSegmentedFixture), 'Fixture file exists');
    const findings = await detectHtml(cleanSegmentedFixture);
    suite.assertNoFindings(findings, 'clean-segmented fixture');
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
