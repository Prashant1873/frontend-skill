/**
 * font-fallbacks.mjs: Curated typography manager and zero-CLS metric fallback engine.
 *
 * Provides:
 * - Curated font lookup by family, slug, or design archetype.
 * - Zero-CLS CSS @font-face fallback generation using metric overrides
 *   (size-adjust, ascent-override, descent-override, line-gap-override).
 * - CDN embedding snippet generation (Google Fonts, Fontshare, or local).
 * - Personality archetype pairing recommendations.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const CURATED_CATALOG_PATH = path.join(__dirname, '..', 'data', 'curated-fonts.json');

let cachedCatalog = null;

/**
 * Load and parse the curated fonts manifest.
 * @returns {{ schema: number, description: string, archetypes: Record<string, any>, fonts: Array<any> }}
 */
export function loadCuratedCatalog(filePath = CURATED_CATALOG_PATH) {
  if (cachedCatalog) return cachedCatalog;
  if (!fs.existsSync(filePath)) {
    throw new Error(`Curated fonts catalog not found at ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  cachedCatalog = JSON.parse(raw);
  return cachedCatalog;
}

/**
 * Retrieve all fonts belonging to a given archetype slug.
 * @param {string} archetype - e.g. 'modern-saas', 'editorial-luxury'
 * @returns {Array<any>}
 */
export function getFontsByArchetype(archetype) {
  const catalog = loadCuratedCatalog();
  const normalized = String(archetype || '').toLowerCase().trim();
  return catalog.fonts.filter((f) => f.archetype === normalized);
}

/**
 * Fuzzy/exact lookup for a font entry by family name or slug.
 * @param {string} nameOrSlug
 * @returns {any | null}
 */
export function findFont(nameOrSlug) {
  if (!nameOrSlug) return null;
  const catalog = loadCuratedCatalog();
  const target = String(nameOrSlug).toLowerCase().trim().replace(/['"]/g, '');
  const targetSlug = target.replace(/[^a-z0-9]+/g, '-');

  // Exact match
  for (const f of catalog.fonts) {
    if (f.family.toLowerCase() === target || f.slug === targetSlug) {
      return f;
    }
  }

  // Partial substring match
  for (const f of catalog.fonts) {
    if (f.family.toLowerCase().includes(target) || f.slug.includes(targetSlug)) {
      return f;
    }
  }

  return null;
}

/**
 * Generate zero-CLS @font-face CSS rule with metric overrides for system fallbacks.
 * @param {any} fontEntry - Font catalog entry
 * @returns {string} CSS @font-face rule block
 */
export function generateFallbackCss(fontEntry) {
  if (!fontEntry) return '';
  const fallback = fontEntry.fallback || {
    base: 'Arial',
    sizeAdjust: '100%',
    ascentOverride: '96%',
    descentOverride: '24%',
    lineGapOverride: '0%'
  };

  const baseFont = fallback.base || 'Arial';
  const fallbackName = `${fontEntry.family} Fallback`;

  return [
    `/* Zero-CLS Metric-Compatible Fallback for ${fontEntry.family} */`,
    `@font-face {`,
    `  font-family: '${fallbackName}';`,
    `  src: local('${baseFont}');`,
    `  size-adjust: ${fallback.sizeAdjust || '100%'};`,
    `  ascent-override: ${fallback.ascentOverride || '96%'};`,
    `  descent-override: ${fallback.descentOverride || '24%'};`,
    `  line-gap-override: ${fallback.lineGapOverride || '0%'};`,
    `}`
  ].join('\n');
}

/**
 * Generate font family CSS declaration stack including metric fallback and system generic.
 * @param {any} fontEntry
 * @returns {string} e.g. "'Plus Jakarta Sans', 'Plus Jakarta Sans Fallback', system-ui, sans-serif"
 */
export function generateFontStackCss(fontEntry) {
  if (!fontEntry) return 'system-ui, sans-serif';
  const fallbackName = `'${fontEntry.family} Fallback'`;
  const generic = fontEntry.archetype === 'editorial-luxury' ? 'Georgia, serif' : 'system-ui, sans-serif';
  return `'${fontEntry.family}', ${fallbackName}, ${generic}`;
}

/**
 * Generate embedding snippet (HTML <link> or CSS @import).
 * @param {any} fontEntry
 * @param {{ mode?: 'html' | 'css' }} options
 * @returns {string}
 */
export function generateEmbedSnippet(fontEntry, { mode = 'css' } = {}) {
  if (!fontEntry) return '';
  if (fontEntry.cdn) {
    if (mode === 'html') {
      return `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="${fontEntry.cdn}">`;
    }
    return `@import url('${fontEntry.cdn}');`;
  }

  if (fontEntry.openAlternative) {
    const alt = findFont(fontEntry.openAlternative);
    if (alt && alt.cdn) {
      const comment = `/* '${fontEntry.family}' is a licensed foundry face. Using open CDN partner '${alt.family}' */`;
      if (mode === 'html') {
        return `${comment}\n<link rel="stylesheet" href="${alt.cdn}">`;
      }
      return `${comment}\n@import url('${alt.cdn}');`;
    }
  }

  return `/* '${fontEntry.family}' uses local system or self-hosted font binary */`;
}

/**
 * Recommend pairing partner for a font entry based on design archetype heuristics.
 * @param {any} fontEntry
 * @returns {{ heading: any, body: any, reason: string }}
 */
export function recommendPairing(fontEntry) {
  const catalog = loadCuratedCatalog();
  const f = typeof fontEntry === 'string' ? findFont(fontEntry) : fontEntry;
  if (!f) throw new Error(`Unknown font: ${fontEntry}`);

  let heading = f;
  let body = null;
  let reason = '';

  if (f.archetype === 'editorial-luxury') {
    // High-craft serif heading pairs with clean modern-saas body
    heading = f;
    body = findFont('Geist') || findFont('Plus Jakarta Sans') || findFont('General Sans');
    reason = 'High-contrast editorial serif display paired with ultra-clean modernist body for optimal reading hierarchy.';
  } else if (f.archetype === 'expressive-display') {
    // Brutalist/expressive display pairs with neutral swiss or saas body
    heading = f;
    body = findFont('General Sans') || findFont('Cabinet Grotesk') || findFont('IBM Plex Sans');
    reason = 'Dynamic, expressive display headline anchored by a stable, high-legibility geometric sans for content.';
  } else if (f.archetype === 'consumer-lifestyle') {
    heading = f;
    body = findFont('DM Sans') || findFont('Manrope') || findFont('Plus Jakarta Sans');
    reason = 'Friendly, rounded consumer headline paired with open-aperture humanist sans for maximum engagement.';
  } else if (f.archetype === 'swiss-authority') {
    heading = f;
    body = findFont('IBM Plex Sans') || findFont('Public Sans') || findFont('Source Sans 3');
    reason = 'Objective Swiss modernist authority with robust typographic measure and micro-data clarity.';
  } else {
    // modern-saas
    heading = f;
    body = findFont('Geist') || findFont('Instrument Sans') || findFont('General Sans');
    reason = 'High-precision developer SaaS neo-grotesque hierarchy with exceptional dark-mode contrast.';
  }

  return { heading, body, reason };
}
