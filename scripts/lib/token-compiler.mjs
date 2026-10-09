/**
 * token-compiler.mjs: Universal Design Token Compiler & Multi-Target Exporter.
 *
 * Compiles Frontend Skill design taste systems:
 * - OKLCH perceptual colors & semantic ramps (color-engine.mjs)
 * - Curated typography archetypes & font stacks (curated-fonts.json)
 * - Analytical harmonic oscillator spring curves (spring-physics.mjs)
 * - Spacing, radius, and elevation geometry
 *
 * Multi-Target Exporters:
 * - CSS Variables (:root & [data-theme="dark"])
 * - Tailwind CSS v3 Preset (JavaScript config object)
 * - Tailwind CSS v4 Theme (@theme CSS block)
 * - W3C DTCG / Figma Tokens JSON ($value, $type)
 * - SCSS Variables map ($color-*, $font-*, $spring-*)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateHarmonicPalette,
  generateHueNeutrals,
  generateLuminanceRamp,
  oklchToRgb,
  rgbToHex,
} from './color-engine.mjs';
import { SPRING_PRESETS, createAppleSpring } from './spring-physics.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_CATALOG_PATH = path.join(__dirname, '..', 'data', 'curated-fonts.json');

// Spacing scale (4px / 8px harmonic grid)
export const SPACING_TOKENS = Object.freeze({
  '0': '0px',
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  '3': '0.75rem',  // 12px
  '4': '1rem',     // 16px
  '5': '1.25rem',  // 20px
  '6': '1.5rem',   // 24px
  '8': '2rem',     // 32px
  '10': '2.5rem',  // 40px
  '12': '3rem',    // 48px
  '16': '4rem',    // 64px
  '20': '5rem',    // 80px
  '24': '6rem',    // 96px
});

// Radius scale
export const RADIUS_TOKENS = Object.freeze({
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
});

// Elevation & Shadows
export const SHADOW_TOKENS = Object.freeze({
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
});

// Font size scale
export const FONT_SIZE_TOKENS = Object.freeze({
  xs: { size: '0.75rem', lineHeight: '1rem' },
  sm: { size: '0.875rem', lineHeight: '1.25rem' },
  base: { size: '1rem', lineHeight: '1.5rem' },
  lg: { size: '1.125rem', lineHeight: '1.75rem' },
  xl: { size: '1.25rem', lineHeight: '1.75rem' },
  '2xl': { size: '1.5rem', lineHeight: '2rem' },
  '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
  '4xl': { size: '2.25rem', lineHeight: '2.5rem' },
  '5xl': { size: '3rem', lineHeight: '1.15' },
});

// Font weight tokens
export const FONT_WEIGHT_TOKENS = Object.freeze({
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
});

// Spring CSS cubic-bezier timing approximations
export const SPRING_CSS_APPROXIMATIONS = Object.freeze({
  default: 'cubic-bezier(0.25, 1, 0.5, 1)',
  snappy: 'cubic-bezier(0.15, 1, 0.3, 1)',
  bouncy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  sheet: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
  toggle: 'cubic-bezier(0.18, 1, 0.22, 1)',
});

// Archetype aliases
const ARCHETYPE_ALIASES = Object.freeze({
  saas: 'modern-saas',
  technical: 'modern-saas',
  'modern-saas': 'modern-saas',
  editorial: 'editorial-luxury',
  luxury: 'editorial-luxury',
  'editorial-luxury': 'editorial-luxury',
  consumer: 'consumer-lifestyle',
  humanist: 'consumer-lifestyle',
  lifestyle: 'consumer-lifestyle',
  'consumer-lifestyle': 'consumer-lifestyle',
  expressive: 'expressive-display',
  creative: 'expressive-display',
  brutalist: 'expressive-display',
  'expressive-display': 'expressive-display',
  swiss: 'swiss-authority',
  enterprise: 'swiss-authority',
  'swiss-authority': 'swiss-authority',
});

/**
 * Loads typography archetypes catalog.
 */
function loadFontsCatalog() {
  try {
    const raw = fs.readFileSync(FONTS_CATALOG_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {
      archetypes: {
        'modern-saas': {
          name: 'Modern SaaS & Flagship',
          defaultHeading: 'Plus Jakarta Sans',
          defaultBody: 'Geist',
          fallbackBase: 'Arial',
        },
      },
    };
  }
}

/**
 * Resolves archetype name from alias.
 */
export function resolveArchetypeKey(name) {
  if (!name) return 'modern-saas';
  const norm = String(name).trim().toLowerCase();
  return ARCHETYPE_ALIASES[norm] || norm;
}

/**
 * Builds the canonical design token dictionary.
 *
 * @param {Object} [options={}]
 * @param {number} [options.baseHue=240] Base brand hue [0, 360]
 * @param {string} [options.schemeType='monochromatic'] Harmonic scheme
 * @param {string} [options.archetype='modern-saas'] Typography archetype
 * @param {number} [options.baseChroma=0.18] Base primary chroma
 * @returns {Object} Complete design token dictionary
 */
export function buildTokenDictionary(options = {}) {
  const baseHue = Number.isFinite(options.baseHue) ? Number(options.baseHue) : 240;
  const schemeType = options.schemeType || 'monochromatic';
  const archetypeKey = resolveArchetypeKey(options.archetype || 'modern-saas');
  const baseChroma = Number.isFinite(options.baseChroma) ? Number(options.baseChroma) : 0.18;

  // 1. Color Palette & Neutrals
  const palette = generateHarmonicPalette(baseHue, schemeType);
  const primaryRamp = generateLuminanceRamp(baseHue, baseChroma);
  const neutrals = generateHueNeutrals(baseHue);

  const colors = {
    primary: {},
    canvas: {
      light: { oklch: `oklch(${neutrals.light.canvas.l} ${neutrals.light.canvas.c} ${neutrals.light.canvas.h})`, hex: neutrals.light.canvas.hex },
      dark: { oklch: `oklch(${neutrals.dark.canvas.l} ${neutrals.dark.canvas.c} ${neutrals.dark.canvas.h})`, hex: neutrals.dark.canvas.hex },
    },
    surface: {
      light: { oklch: `oklch(${neutrals.light.surface.l} ${neutrals.light.surface.c} ${neutrals.light.surface.h})`, hex: neutrals.light.surface.hex },
      dark: { oklch: `oklch(${neutrals.dark.surface.l} ${neutrals.dark.surface.c} ${neutrals.dark.surface.h})`, hex: neutrals.dark.surface.hex },
    },
    border: {
      light: { oklch: `oklch(${neutrals.light.border.l} ${neutrals.light.border.c} ${neutrals.light.border.h})`, hex: neutrals.light.border.hex },
      dark: { oklch: `oklch(${neutrals.dark.border.l} ${neutrals.dark.border.c} ${neutrals.dark.border.h})`, hex: neutrals.dark.border.hex },
    },
    textMuted: {
      light: { oklch: `oklch(${neutrals.light.textMuted.l} ${neutrals.light.textMuted.c} ${neutrals.light.textMuted.h})`, hex: neutrals.light.textMuted.hex },
      dark: { oklch: `oklch(${neutrals.dark.textMuted.l} ${neutrals.dark.textMuted.c} ${neutrals.dark.textMuted.h})`, hex: neutrals.dark.textMuted.hex },
    },
    textPrimary: {
      light: { oklch: `oklch(${neutrals.light.textPrimary.l} ${neutrals.light.textPrimary.c} ${neutrals.light.textPrimary.h})`, hex: neutrals.light.textPrimary.hex },
      dark: { oklch: `oklch(${neutrals.dark.textPrimary.l} ${neutrals.dark.textPrimary.c} ${neutrals.dark.textPrimary.h})`, hex: neutrals.dark.textPrimary.hex },
    },
    semantic: {
      success: { oklch: palette.semantics.success.oklch, hex: palette.semantics.success.hex },
      warning: { oklch: palette.semantics.warning.oklch, hex: palette.semantics.warning.hex },
      error: { oklch: palette.semantics.error.oklch, hex: palette.semantics.error.hex },
      info: { oklch: palette.semantics.info.oklch, hex: palette.semantics.info.hex },
    },
  };

  for (const step of primaryRamp) {
    colors.primary[step.step] = {
      oklch: step.oklch,
      hex: step.hex,
      l: step.l,
      c: step.c,
      h: step.h,
    };
  }

  // 2. Typography
  const fontsCatalog = loadFontsCatalog();
  const arch = fontsCatalog.archetypes?.[archetypeKey] || fontsCatalog.archetypes?.['modern-saas'] || {
    name: 'Modern SaaS',
    defaultHeading: 'Plus Jakarta Sans',
    defaultBody: 'Geist',
    fallbackBase: 'Arial',
  };

  const typography = {
    archetype: {
      key: archetypeKey,
      name: arch.name,
      description: arch.description || '',
    },
    fontFamily: {
      heading: `"${arch.defaultHeading}", ${arch.fallbackBase || 'sans-serif'}, sans-serif`,
      body: `"${arch.defaultBody}", ${arch.fallbackBase || 'sans-serif'}, sans-serif`,
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    fontSize: FONT_SIZE_TOKENS,
    fontWeight: FONT_WEIGHT_TOKENS,
    lineHeight: {
      tight: '1.2',
      snug: '1.35',
      normal: '1.5',
      relaxed: '1.625',
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0em',
      wide: '0.04em',
    },
  };

  // 3. Motion Springs
  const motion = {
    springs: {},
  };

  for (const [key, preset] of Object.entries(SPRING_PRESETS)) {
    const solver = createAppleSpring(preset);
    const settle = solver.settleDuration(100, 0, 0);
    motion.springs[key] = {
      response: preset.response,
      dampingRatio: preset.dampingRatio,
      stiffness: Number(solver.params.stiffness.toFixed(2)),
      damping: Number(solver.params.damping.toFixed(2)),
      settleDuration: `${Math.round(settle * 1000)}ms`,
      cssTiming: SPRING_CSS_APPROXIMATIONS[key] || 'cubic-bezier(0.25, 1, 0.5, 1)',
    };
  }

  return {
    meta: {
      generator: 'Frontend Skill Universal Design Token Compiler',
      version: '1.0.0',
      baseHue,
      schemeType,
      archetype: archetypeKey,
      generatedAt: new Date().toISOString(),
    },
    color: colors,
    typography,
    motion,
    spacing: SPACING_TOKENS,
    radius: RADIUS_TOKENS,
    shadow: SHADOW_TOKENS,
  };
}

/**
 * Exporter: CSS Custom Properties (:root & [data-theme="dark"])
 *
 * @param {Object} tokens
 * @returns {string} CSS content
 */
export function exportCssVariables(tokens) {
  const lines = [
    '/** Universal Design Tokens (CSS Variables) */',
    '/** Generated by Frontend Skill Universal Design Token Compiler */',
    '',
    ':root {',
    '  /* Colors: OKLCH Primary Ramp */',
  ];

  for (const [step, val] of Object.entries(tokens.color.primary)) {
    lines.push(`  --color-primary-${step}: ${val.oklch};`);
    lines.push(`  --color-primary-${step}-hex: ${val.hex};`);
  }

  lines.push('');
  lines.push('  /* Light Theme Neutrals */');
  lines.push(`  --color-canvas: ${tokens.color.canvas.light.oklch};`);
  lines.push(`  --color-surface: ${tokens.color.surface.light.oklch};`);
  lines.push(`  --color-border: ${tokens.color.border.light.oklch};`);
  lines.push(`  --color-text-muted: ${tokens.color.textMuted.light.oklch};`);
  lines.push(`  --color-text-primary: ${tokens.color.textPrimary.light.oklch};`);

  lines.push('');
  lines.push('  /* Semantics */');
  lines.push(`  --color-success: ${tokens.color.semantic.success.oklch};`);
  lines.push(`  --color-warning: ${tokens.color.semantic.warning.oklch};`);
  lines.push(`  --color-error: ${tokens.color.semantic.error.oklch};`);
  lines.push(`  --color-info: ${tokens.color.semantic.info.oklch};`);

  lines.push('');
  lines.push('  /* Typography */');
  lines.push(`  --font-heading: ${tokens.typography.fontFamily.heading};`);
  lines.push(`  --font-body: ${tokens.typography.fontFamily.body};`);
  lines.push(`  --font-mono: ${tokens.typography.fontFamily.mono};`);

  for (const [key, font] of Object.entries(tokens.typography.fontSize)) {
    lines.push(`  --font-size-${key}: ${font.size};`);
    lines.push(`  --line-height-${key}: ${font.lineHeight};`);
  }

  lines.push('');
  lines.push('  /* Spring Curves & Physics */');
  for (const [name, spring] of Object.entries(tokens.motion.springs)) {
    lines.push(`  --spring-${name}-response: ${spring.response}s;`);
    lines.push(`  --spring-${name}-damping: ${spring.dampingRatio};`);
    lines.push(`  --spring-${name}-timing: ${spring.cssTiming};`);
    lines.push(`  --spring-${name}-duration: ${spring.settleDuration};`);
  }

  lines.push('');
  lines.push('  /* Spacing */');
  for (const [step, val] of Object.entries(tokens.spacing)) {
    lines.push(`  --space-${step}: ${val};`);
  }

  lines.push('');
  lines.push('  /* Border Radius */');
  for (const [name, val] of Object.entries(tokens.radius)) {
    lines.push(`  --radius-${name}: ${val};`);
  }

  lines.push('');
  lines.push('  /* Elevation & Shadows */');
  for (const [name, val] of Object.entries(tokens.shadow)) {
    lines.push(`  --shadow-${name}: ${val};`);
  }

  lines.push('}');
  lines.push('');

  lines.push('[data-theme="dark"], .dark {');
  lines.push('  /* Dark Theme Neutrals */');
  lines.push(`  --color-canvas: ${tokens.color.canvas.dark.oklch};`);
  lines.push(`  --color-surface: ${tokens.color.surface.dark.oklch};`);
  lines.push(`  --color-border: ${tokens.color.border.dark.oklch};`);
  lines.push(`  --color-text-muted: ${tokens.color.textMuted.dark.oklch};`);
  lines.push(`  --color-text-primary: ${tokens.color.textPrimary.dark.oklch};`);
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

/**
 * Exporter: Tailwind CSS Preset
 *
 * @param {Object} tokens
 * @param {Object} [options={}]
 * @param {'v3'|'v4'} [options.version='v3']
 * @returns {string} Tailwind preset or theme CSS
 */
export function exportTailwindPreset(tokens, options = {}) {
  const version = options.version === 'v4' ? 'v4' : 'v3';

  if (version === 'v4') {
    // Tailwind v4 @theme directive syntax
    const lines = [
      '/** Universal Design Tokens (Tailwind CSS v4 @theme) */',
      '@theme {',
      '  /* Colors */',
    ];

    for (const [step, val] of Object.entries(tokens.color.primary)) {
      lines.push(`  --color-primary-${step}: ${val.oklch};`);
    }

    lines.push('  --color-canvas: var(--color-canvas);');
    lines.push('  --color-surface: var(--color-surface);');
    lines.push('  --color-border: var(--color-border);');
    lines.push('  --color-text-muted: var(--color-text-muted);');
    lines.push('  --color-text-primary: var(--color-text-primary);');
    lines.push(`  --color-success: ${tokens.color.semantic.success.oklch};`);
    lines.push(`  --color-warning: ${tokens.color.semantic.warning.oklch};`);
    lines.push(`  --color-error: ${tokens.color.semantic.error.oklch};`);
    lines.push(`  --color-info: ${tokens.color.semantic.info.oklch};`);

    lines.push('');
    lines.push('  /* Typography */');
    lines.push(`  --font-heading: ${tokens.typography.fontFamily.heading};`);
    lines.push(`  --font-body: ${tokens.typography.fontFamily.body};`);
    lines.push(`  --font-mono: ${tokens.typography.fontFamily.mono};`);

    lines.push('');
    lines.push('  /* Radius */');
    for (const [name, val] of Object.entries(tokens.radius)) {
      lines.push(`  --radius-${name}: ${val};`);
    }

    lines.push('');
    lines.push('  /* Spring Easing */');
    for (const [name, spring] of Object.entries(tokens.motion.springs)) {
      lines.push(`  --ease-spring-${name}: ${spring.cssTiming};`);
    }

    lines.push('}');
    lines.push('');
    return lines.join('\n');
  }

  // Tailwind v3 JS preset
  const primaryColors = {};
  for (const [step, val] of Object.entries(tokens.color.primary)) {
    primaryColors[step] = val.oklch;
  }

  const timingFunctions = {};
  for (const [name, spring] of Object.entries(tokens.motion.springs)) {
    timingFunctions[`spring-${name}`] = spring.cssTiming;
  }

  const config = {
    theme: {
      extend: {
        colors: {
          primary: primaryColors,
          canvas: 'var(--color-canvas)',
          surface: 'var(--color-surface)',
          border: 'var(--color-border)',
          'text-muted': 'var(--color-text-muted)',
          'text-primary': 'var(--color-text-primary)',
          success: tokens.color.semantic.success.oklch,
          warning: tokens.color.semantic.warning.oklch,
          error: tokens.color.semantic.error.oklch,
          info: tokens.color.semantic.info.oklch,
        },
        fontFamily: {
          heading: tokens.typography.fontFamily.heading.split(',').map((s) => s.trim().replace(/^"|"$/g, '')),
          body: tokens.typography.fontFamily.body.split(',').map((s) => s.trim().replace(/^"|"$/g, '')),
          mono: tokens.typography.fontFamily.mono.split(',').map((s) => s.trim().replace(/^"|"$/g, '')),
        },
        borderRadius: tokens.radius,
        spacing: tokens.spacing,
        boxShadow: tokens.shadow,
        transitionTimingFunction: timingFunctions,
      },
    },
  };

  return [
    '/** Universal Design Tokens (Tailwind CSS v3 Preset) */',
    '/** @type {import(\'tailwindcss\').Config} */',
    `module.exports = ${JSON.stringify(config, null, 2)};`,
    '',
  ].join('\n');
}

/**
 * Exporter: W3C Design Tokens Community Group (DTCG) / Figma Tokens JSON
 *
 * @param {Object} tokens
 * @returns {string} JSON string
 */
export function exportDtcgJson(tokens) {
  const dtcg = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    color: {
      primary: {},
      canvas: {
        light: { $value: tokens.color.canvas.light.oklch, $type: 'color', hex: tokens.color.canvas.light.hex },
        dark: { $value: tokens.color.canvas.dark.oklch, $type: 'color', hex: tokens.color.canvas.dark.hex },
      },
      surface: {
        light: { $value: tokens.color.surface.light.oklch, $type: 'color', hex: tokens.color.surface.light.hex },
        dark: { $value: tokens.color.surface.dark.oklch, $type: 'color', hex: tokens.color.surface.dark.hex },
      },
      border: {
        light: { $value: tokens.color.border.light.oklch, $type: 'color', hex: tokens.color.border.light.hex },
        dark: { $value: tokens.color.border.dark.oklch, $type: 'color', hex: tokens.color.border.dark.hex },
      },
      textMuted: {
        light: { $value: tokens.color.textMuted.light.oklch, $type: 'color', hex: tokens.color.textMuted.light.hex },
        dark: { $value: tokens.color.textMuted.dark.oklch, $type: 'color', hex: tokens.color.textMuted.dark.hex },
      },
      textPrimary: {
        light: { $value: tokens.color.textPrimary.light.oklch, $type: 'color', hex: tokens.color.textPrimary.light.hex },
        dark: { $value: tokens.color.textPrimary.dark.oklch, $type: 'color', hex: tokens.color.textPrimary.dark.hex },
      },
      semantic: {
        success: { $value: tokens.color.semantic.success.oklch, $type: 'color', hex: tokens.color.semantic.success.hex },
        warning: { $value: tokens.color.semantic.warning.oklch, $type: 'color', hex: tokens.color.semantic.warning.hex },
        error: { $value: tokens.color.semantic.error.oklch, $type: 'color', hex: tokens.color.semantic.error.hex },
        info: { $value: tokens.color.semantic.info.oklch, $type: 'color', hex: tokens.color.semantic.info.hex },
      },
    },
    typography: {
      fontFamily: {
        heading: { $value: tokens.typography.fontFamily.heading, $type: 'fontFamily' },
        body: { $value: tokens.typography.fontFamily.body, $type: 'fontFamily' },
        mono: { $value: tokens.typography.fontFamily.mono, $type: 'fontFamily' },
      },
      fontSize: {},
      fontWeight: {},
    },
    motion: {
      spring: {},
    },
    spacing: {},
    borderRadius: {},
    shadow: {},
  };

  for (const [step, val] of Object.entries(tokens.color.primary)) {
    dtcg.color.primary[step] = {
      $value: val.oklch,
      $type: 'color',
      hex: val.hex,
    };
  }

  for (const [key, font] of Object.entries(tokens.typography.fontSize)) {
    dtcg.typography.fontSize[key] = {
      $value: font.size,
      $type: 'dimension',
      lineHeight: font.lineHeight,
    };
  }

  for (const [key, weight] of Object.entries(tokens.typography.fontWeight)) {
    dtcg.typography.fontWeight[key] = {
      $value: weight,
      $type: 'fontWeight',
    };
  }

  for (const [name, spring] of Object.entries(tokens.motion.springs)) {
    dtcg.motion.spring[name] = {
      response: { $value: `${spring.response}s`, $type: 'duration' },
      dampingRatio: { $value: spring.dampingRatio, $type: 'number' },
      stiffness: { $value: spring.stiffness, $type: 'number' },
      damping: { $value: spring.damping, $type: 'number' },
      settleDuration: { $value: spring.settleDuration, $type: 'duration' },
      cssTiming: { $value: spring.cssTiming, $type: 'cubicBezier' },
    };
  }

  for (const [step, val] of Object.entries(tokens.spacing)) {
    dtcg.spacing[step] = {
      $value: val,
      $type: 'dimension',
    };
  }

  for (const [name, val] of Object.entries(tokens.radius)) {
    dtcg.borderRadius[name] = {
      $value: val,
      $type: 'dimension',
    };
  }

  for (const [name, val] of Object.entries(tokens.shadow)) {
    dtcg.shadow[name] = {
      $value: val,
      $type: 'shadow',
    };
  }

  return JSON.stringify(dtcg, null, 2);
}

/**
 * Exporter: SCSS Variables Map
 *
 * @param {Object} tokens
 * @returns {string} SCSS content
 */
export function exportScssVariables(tokens) {
  const lines = [
    '// Universal Design Tokens (SCSS Variables)',
    '// Generated by Frontend Skill Universal Design Token Compiler',
    '',
    '// Colors: Primary Ramp',
  ];

  for (const [step, val] of Object.entries(tokens.color.primary)) {
    lines.push(`$color-primary-${step}: ${val.oklch};`);
    lines.push(`$color-primary-${step}-hex: ${val.hex};`);
  }

  lines.push('');
  lines.push('// Colors: Neutrals');
  lines.push(`$color-canvas-light: ${tokens.color.canvas.light.oklch};`);
  lines.push(`$color-surface-light: ${tokens.color.surface.light.oklch};`);
  lines.push(`$color-border-light: ${tokens.color.border.light.oklch};`);
  lines.push(`$color-text-muted-light: ${tokens.color.textMuted.light.oklch};`);
  lines.push(`$color-text-primary-light: ${tokens.color.textPrimary.light.oklch};`);

  lines.push(`$color-canvas-dark: ${tokens.color.canvas.dark.oklch};`);
  lines.push(`$color-surface-dark: ${tokens.color.surface.dark.oklch};`);
  lines.push(`$color-border-dark: ${tokens.color.border.dark.oklch};`);
  lines.push(`$color-text-muted-dark: ${tokens.color.textMuted.dark.oklch};`);
  lines.push(`$color-text-primary-dark: ${tokens.color.textPrimary.dark.oklch};`);

  lines.push('');
  lines.push('// Colors: Semantics');
  lines.push(`$color-success: ${tokens.color.semantic.success.oklch};`);
  lines.push(`$color-warning: ${tokens.color.semantic.warning.oklch};`);
  lines.push(`$color-error: ${tokens.color.semantic.error.oklch};`);
  lines.push(`$color-info: ${tokens.color.semantic.info.oklch};`);

  lines.push('');
  lines.push('// Typography');
  lines.push(`$font-heading: ${tokens.typography.fontFamily.heading};`);
  lines.push(`$font-body: ${tokens.typography.fontFamily.body};`);
  lines.push(`$font-mono: ${tokens.typography.fontFamily.mono};`);

  for (const [key, font] of Object.entries(tokens.typography.fontSize)) {
    lines.push(`$font-size-${key}: ${font.size};`);
    lines.push(`$line-height-${key}: ${font.lineHeight};`);
  }

  lines.push('');
  lines.push('// Spring Motion');
  for (const [name, spring] of Object.entries(tokens.motion.springs)) {
    lines.push(`$spring-${name}-response: ${spring.response}s;`);
    lines.push(`$spring-${name}-damping: ${spring.dampingRatio};`);
    lines.push(`$spring-${name}-timing: ${spring.cssTiming};`);
    lines.push(`$spring-${name}-duration: ${spring.settleDuration};`);
  }

  lines.push('');
  lines.push('// Radius');
  for (const [name, val] of Object.entries(tokens.radius)) {
    lines.push(`$radius-${name}: ${val};`);
  }

  lines.push('');
  lines.push('// Spacing');
  for (const [step, val] of Object.entries(tokens.spacing)) {
    lines.push(`$space-${step}: ${val};`);
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Universal compile helper generating all artifacts.
 *
 * @param {Object} [options={}]
 * @returns {Object} { dictionary, css, tailwind3, tailwind4, dtcg, scss }
 */
export function compileTokens(options = {}) {
  const dictionary = buildTokenDictionary(options);
  return {
    dictionary,
    css: exportCssVariables(dictionary),
    tailwind3: exportTailwindPreset(dictionary, { version: 'v3' }),
    tailwind4: exportTailwindPreset(dictionary, { version: 'v4' }),
    dtcg: exportDtcgJson(dictionary),
    scss: exportScssVariables(dictionary),
  };
}
