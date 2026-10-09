/**
 * component-sanitizer.mjs: Pure Node ESM sanitization and token adaptation engine.
 * Strips executable scripts, inline event handlers, and unsafe protocols from external UI snippets,
 * while mapping hardcoded colors, radii, and fonts to design system tokens.
 */

/**
 * Sanitizes HTML markup by stripping scripts, dangerous tags, inline event handlers,
 * and unsafe protocol links.
 *
 * @param {string} html - Raw HTML markup
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';

  let clean = html;

  // 1. Remove script, noscript, iframe, object, embed, applet, form action injection tags
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<embed\b[^>]*>/gi, '');
  clean = clean.replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '');

  // Strip standalone self-closing script or iframe tags
  clean = clean.replace(/<script\b[^>]*\/>/gi, '');
  clean = clean.replace(/<iframe\b[^>]*\/>/gi, '');

  // 2. Strip inline event handlers: on* attributes (onclick, onload, onerror, onmouseover, etc.)
  clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Strip dangerous protocol URIs in href, src, or formaction
  clean = clean.replace(
    /\s+(href|src|formaction)\s*=\s*(["'])\s*(javascript:|vbscript:|data:(?!image\/(png|jpeg|webp|gif|svg\+xml)))[^"']*\2/gi,
    ' $1="#"'
  );

  // 4. Enforce rel="noopener noreferrer" on target="_blank" links
  clean = clean.replace(/<a\b([^>]*\btarget\s*=\s*["']_blank["'][^>]*)>/gi, (match, attrs) => {
    if (!/rel\s*=\s*["'][^"']*noopener/i.test(attrs)) {
      return `<a ${attrs.trim()} rel="noopener noreferrer">`;
    }
    return match;
  });

  return clean.trim();
}

/**
 * Adapts hardcoded CSS declarations to standard design tokens.
 *
 * @param {string} css - Raw CSS stylesheet or block
 * @returns {string} Token-adapted CSS
 */
export function adaptCssTokens(css) {
  if (!css || typeof css !== 'string') return '';

  let adapted = css;

  // 1. Adapt hardcoded neutral background colors
  adapted = adapted.replace(
    /(background(?:-color)?\s*:\s*)(#ffffff|#fff|rgba?\(\s*255\s*,\s*255\s*,\s*255(?:\s*,\s*1)?\s*\))/gi,
    '$1var(--surface)'
  );
  adapted = adapted.replace(
    /(background(?:-color)?\s*:\s*)(#09090b|#0c0a09|#0f172a|#111827|#000000|#000)/gi,
    '$1var(--canvas)'
  );
  adapted = adapted.replace(
    /(background(?:-color)?\s*:\s*)(#18181b|#1e293b|#27272a|#1c1917|#262626|#f4f4f5|#f8fafc)/gi,
    '$1var(--surface)'
  );

  // 2. Adapt text colors
  adapted = adapted.replace(
    /(color\s*:\s*)(#ffffff|#fff|#09090b|#000000|#000|#18181b|#111827)/gi,
    '$1var(--text-primary)'
  );
  adapted = adapted.replace(
    /(color\s*:\s*)(#71717a|#a1a1aa|#64748b|#6b7280|#9ca3af|#888888|#52525b)/gi,
    '$1var(--text-muted)'
  );

  // 3. Adapt border colors
  adapted = adapted.replace(
    /(border(?:-color)?\s*:\s*[^;]*)(#e4e4e7|#e2e8f0|#27272a|#334155|#3f3f46|#d4d4d8|#e5e7eb|rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.1[0-9]*\))/gi,
    (match, prefix, color) => match.replace(color, 'var(--border)')
  );

  // 4. Adapt primary brand accents
  adapted = adapted.replace(
    /(background(?:-color)?\s*:\s*)(#3b82f6|#6366f1|#2563eb|#4f46e5|#0284c7|#0ea5e9|#7c3aed|#8b5cf6)/gi,
    '$1var(--primary)'
  );

  // 5. Adapt font families
  adapted = adapted.replace(
    /(font-family\s*:\s*)(?:["']?Inter["']?|["']?Roboto["']?|["']?Arial["']?|system-ui|sans-serif)(?:[^;]*)/gi,
    '$1var(--font-sans), system-ui, sans-serif'
  );

  // 6. Adapt border radii
  adapted = adapted.replace(/border-radius\s*:\s*(?:4px|6px|8px);/gi, 'border-radius: var(--radius-md, 8px);');
  adapted = adapted.replace(/border-radius\s*:\s*(?:12px|16px);/gi, 'border-radius: var(--radius-lg, 12px);');
  adapted = adapted.replace(/border-radius\s*:\s*(?:9999px|50%);/gi, 'border-radius: var(--radius-full, 9999px);');

  return adapted.trim();
}

/**
 * Splits raw HTML markup and inline <style> blocks into separate HTML and CSS fields.
 *
 * @param {string} rawSnippet - Combined HTML/CSS snippet
 * @returns {{ html: string, css: string }} Extracted HTML and CSS
 */
export function extractHtmlAndCss(rawSnippet) {
  if (!rawSnippet || typeof rawSnippet !== 'string') {
    return { html: '', css: '' };
  }

  const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  const cssBlocks = [];

  while ((match = styleRegex.exec(rawSnippet)) !== null) {
    if (match[1]) {
      cssBlocks.push(match[1].trim());
    }
  }

  const htmlWithoutStyle = rawSnippet.replace(styleRegex, '').trim();
  const cssCombined = cssBlocks.join('\n\n').trim();

  return {
    html: sanitizeHtml(htmlWithoutStyle),
    css: adaptCssTokens(cssCombined),
  };
}
