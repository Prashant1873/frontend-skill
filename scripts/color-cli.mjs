#!/usr/bin/env node
/**
 * color-cli.mjs: Command-line interface for the Perceptual Color Engine.
 *
 * Commands:
 *   node scripts/color-cli.mjs --contrast <colorA> <colorB>
 *     Audits contrast between two colors (hex, rgb, or oklch) against WCAG 2.2 and APCA.
 *
 *   node scripts/color-cli.mjs --palette --hue <deg> [--scheme <analogous|complementary|triadic>]
 *     Generates a full 9-step OKLCH palette, hue-tinted neutrals, and semantic scales.
 *
 *   node scripts/color-cli.mjs --css [--hue <deg>] [--theme dark|light|both]
 *     Emits ready-to-copy CSS custom properties with guaranteed contrast.
 */

import {
  parseColor,
  calculateContrast,
  generateLuminanceRamp,
  generateHueNeutrals,
  generateHarmonicPalette,
  rgbToHex,
} from './lib/color-engine.mjs';

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : fallback;
}

function printUsage() {
  console.log(`
Usage:
  node scripts/color-cli.mjs --contrast <color1> <color2>
  node scripts/color-cli.mjs --palette --hue <degrees> [--scheme <type>]
  node scripts/color-cli.mjs --css [--hue <degrees>] [--theme dark|light|both]

Schemes:
  monochromatic, analogous, complementary, split-complementary, triadic
`);
}

function runContrast(c1, c2) {
  if (!c1 || !c2) {
    console.error('Error: --contrast requires two color arguments. Example: --contrast "#ffffff" "#18181b"');
    process.exit(1);
  }

  const result = calculateContrast(c1, c2);
  const rgb1 = parseColor(c1);
  const rgb2 = parseColor(c2);
  const hex1 = rgbToHex(...rgb1);
  const hex2 = rgbToHex(...rgb2);

  console.log(`\n========================================================================`);
  console.log(`                   PERCEPTUAL CONTRAST AUDIT REPORT                     `);
  console.log(`========================================================================`);
  console.log(`Color 1:          ${c1} (${hex1})`);
  console.log(`Color 2:          ${c2} (${hex2})`);
  console.log(`Contrast Ratio:   ${result.ratio}:1`);
  console.log(`APCA Score (Lc):  ${result.apcaScore}`);
  console.log(`------------------------------------------------------------------------`);
  console.log(`WCAG 2.2 AA (Normal Text >= 4.5:1):   ${result.wcagAA ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`WCAG 2.2 AA (Large/UI >= 3.0:1):      ${result.wcagAALarge ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`WCAG 2.2 AAA (Normal Text >= 7.0:1):  ${result.wcagAAA ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`APCA Body Readability (|Lc| >= 60):   ${result.apcaPassBody ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`========================================================================\n`);

  if (!result.wcagAA) {
    process.exit(1);
  }
}

function runPalette(hue, scheme) {
  const h = Number(hue || 240);
  const palette = generateHarmonicPalette(h, scheme || 'monochromatic');

  console.log(`\n========================================================================`);
  console.log(`                 HARMONIC OKLCH COLOR PALETTE                           `);
  console.log(`========================================================================`);
  console.log(`Base Hue:     ${palette.baseHue}°`);
  console.log(`Scheme Type:  ${palette.schemeType}`);
  console.log(`Active Hues:  ${palette.hues.join('°, ')}°`);

  console.log(`\n▶ Primary Luminance Ramp (50 to 950):`);
  for (const step of palette.primaryRamp) {
    console.log(`  ${String(step.step).padEnd(4)} | ${step.hex.padEnd(8)} | ${step.oklch}`);
  }

  console.log(`\n▶ Hue-Derived Neutrals (Light Mode):`);
  console.log(`  Canvas:       ${palette.neutrals.light.canvas.hex}`);
  console.log(`  Surface:      ${palette.neutrals.light.surface.hex}`);
  console.log(`  Border:       ${palette.neutrals.light.border.hex}`);
  console.log(`  Muted Text:   ${palette.neutrals.light.textMuted.hex} (Ratio: ${palette.neutrals.light.textMuted.ratio}:1)`);
  console.log(`  Primary Text: ${palette.neutrals.light.textPrimary.hex} (Ratio: ${palette.neutrals.light.textPrimary.ratio}:1)`);

  console.log(`\n▶ Hue-Derived Neutrals (Dark Mode):`);
  console.log(`  Canvas:       ${palette.neutrals.dark.canvas.hex}`);
  console.log(`  Surface:      ${palette.neutrals.dark.surface.hex}`);
  console.log(`  Border:       ${palette.neutrals.dark.border.hex}`);
  console.log(`  Muted Text:   ${palette.neutrals.dark.textMuted.hex} (Ratio: ${palette.neutrals.dark.textMuted.ratio}:1)`);
  console.log(`  Primary Text: ${palette.neutrals.dark.textPrimary.hex} (Ratio: ${palette.neutrals.dark.textPrimary.ratio}:1)`);

  console.log(`\n▶ Semantic Accents:`);
  console.log(`  Success:      ${palette.semantics.success.hex} (${palette.semantics.success.oklch})`);
  console.log(`  Warning:      ${palette.semantics.warning.hex} (${palette.semantics.warning.oklch})`);
  console.log(`  Error:        ${palette.semantics.error.hex} (${palette.semantics.error.oklch})`);
  console.log(`  Info:         ${palette.semantics.info.hex} (${palette.semantics.info.oklch})\n`);
}

function runCss(hue, theme) {
  const h = Number(hue || 240);
  const ramp = generateLuminanceRamp(h, 0.18);
  const neutrals = generateHueNeutrals(h);
  const requestedTheme = String(theme || 'both').toLowerCase();

  console.log(`/* ========================================================================== */`);
  console.log(`/* Generated OKLCH Design Tokens (Hue: ${h}°)                                   */`);
  console.log(`/* ========================================================================== */\n`);

  if (requestedTheme === 'light' || requestedTheme === 'both') {
    console.log(`:root {`);
    console.log(`  /* Light Theme Surface & Canvas */`);
    console.log(`  --canvas: ${neutrals.light.canvas.hex};`);
    console.log(`  --surface: ${neutrals.light.surface.hex};`);
    console.log(`  --border: ${neutrals.light.border.hex};`);
    console.log(`  --text-primary: ${neutrals.light.textPrimary.hex};`);
    console.log(`  --text-muted: ${neutrals.light.textMuted.hex};`);
    console.log(`\n  /* Brand Scale */`);
    for (const step of ramp) {
      console.log(`  --color-primary-${step.step}: ${step.hex};`);
    }
    console.log(`  --primary: var(--color-primary-500);`);
    console.log(`  --primary-hover: var(--color-primary-600);`);
    console.log(`}\n`);
  }

  if (requestedTheme === 'dark' || requestedTheme === 'both') {
    const selector = requestedTheme === 'dark' ? ':root' : '[data-theme="dark"]';
    console.log(`${selector} {`);
    console.log(`  /* Dark Theme Surface & Canvas (Hue-Tinted) */`);
    console.log(`  --canvas: ${neutrals.dark.canvas.hex};`);
    console.log(`  --surface: ${neutrals.dark.surface.hex};`);
    console.log(`  --border: ${neutrals.dark.border.hex};`);
    console.log(`  --text-primary: ${neutrals.dark.textPrimary.hex};`);
    console.log(`  --text-muted: ${neutrals.dark.textMuted.hex};`);
    console.log(`\n  /* Brand Scale (Adjusted for Dark Mode Accent) */`);
    console.log(`  --primary: var(--color-primary-400);`);
    console.log(`  --primary-hover: var(--color-primary-300);`);
    console.log(`}\n`);
  }
}

function main() {
  if (process.argv.includes('--contrast')) {
    const idx = process.argv.indexOf('--contrast');
    const c1 = process.argv[idx + 1];
    const c2 = process.argv[idx + 2];
    runContrast(c1, c2);
    return;
  }

  if (process.argv.includes('--palette')) {
    const hue = arg('hue', 240);
    const scheme = arg('scheme', 'monochromatic');
    runPalette(hue, scheme);
    return;
  }

  if (process.argv.includes('--css')) {
    const hue = arg('hue', 240);
    const theme = arg('theme', 'both');
    runCss(hue, theme);
    return;
  }

  printUsage();
}

main();
