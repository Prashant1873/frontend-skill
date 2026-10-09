/**
 * Multi-Variant Prototype Picker Generator Engine
 *
 * Implements the verbatim specification from PICKER.md for zero-dependency
 * prototype harnesses, floating dark glass picker navigation, keyboard controls,
 * and URL parameter state persistence.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Reads the canonical picker.css stylesheet.
 * @returns {string} Verbatim CSS from picker.css
 */
export function getPickerCss() {
  const cssPath = path.join(__dirname, 'picker.css');
  return fs.readFileSync(cssPath, 'utf8');
}

/**
 * Normalizes an array of variant descriptors into uniform objects.
 * @param {Array<string|{name: string, label?: string, render?: string}>} rawVariants
 * @returns {Array<{name: string, label: string, render: string}>}
 */
export function normalizeVariants(rawVariants) {
  if (!Array.isArray(rawVariants) || rawVariants.length === 0) {
    return [
      { name: 'quiet', label: 'Quiet', render: 'renderQuiet()' },
      { name: 'editorial', label: 'Editorial', render: 'renderEditorial()' },
      { name: 'playful', label: 'Playful', render: 'renderPlayful()' }
    ];
  }

  return rawVariants.map((item, index) => {
    if (typeof item === 'string') {
      const label = item.trim();
      const name = label.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
      return { name, label, render: `renderVariant${index + 1}()` };
    }
    const label = item.label || item.name || `Variant ${index + 1}`;
    const name = (item.name || label).toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    const render = item.render || `renderVariant${index + 1}()`;
    return { name, label, render };
  });
}

/**
 * Generates the HTML markup for the prototype picker navigation bar.
 * @param {Array<string|Object>} variants
 * @param {Object} [options]
 * @param {'bottom'|'top'} [options.position='bottom']
 * @param {boolean} [options.replay=true]
 * @returns {string}
 */
export function generatePickerHtml(variants, options = {}) {
  const norm = normalizeVariants(variants);
  const position = options.position === 'top' ? 'top' : 'bottom';
  const showReplay = options.replay !== false;

  const posAttr = position === 'top' ? ' data-position="top"' : '';

  const buttons = norm.map((v, i) => {
    const activeAttrs = i === 0 ? ' data-active aria-current="true"' : '';
    const safeLabel = escapeHtml(v.label);
    return `  <button class="proto-picker-item"${activeAttrs}>${safeLabel}</button>`;
  }).join('\n');

  let replayBlock = '';
  if (showReplay) {
    replayBlock = `  <span class="proto-picker-divider" aria-hidden="true"></span>\n  <button class="proto-picker-item proto-picker-replay" aria-label="Replay animation (R)">↻</button>`;
  }

  return `<nav class="proto-picker"${posAttr} aria-label="Prototype variants">\n  <span class="proto-picker-highlight" aria-hidden="true"></span>\n${buttons}${replayBlock ? '\n' + replayBlock : ''}\n</nav>`;
}

/**
 * Generates the client-side JavaScript wiring per PICKER.md contract.
 * @param {Array<string|Object>} variants
 * @param {Object} [options]
 * @returns {string}
 */
export function generatePickerClientScript(variants, options = {}) {
  const norm = normalizeVariants(variants);
  const variantRenders = norm.map(v => v.render).join(', ');

  return `
(function() {
  const variants = [${variantRenders}];
  const stage = document.getElementById('stage');
  const picker = document.querySelector('.proto-picker');
  if (!picker || !stage) return;

  const highlight = picker.querySelector('.proto-picker-highlight');
  const items = [...picker.querySelectorAll('.proto-picker-item:not(.proto-picker-replay)')];
  const replay = picker.querySelector('.proto-picker-replay');
  let current = 0;

  function moveHighlight() {
    const el = items[current];
    if (!el || !highlight) return;
    highlight.style.width = el.offsetWidth + 'px';
    highlight.style.transform = 'translateX(' + el.offsetLeft + 'px)';
  }

  function mount(i) {
    stage.innerHTML = '';
    requestAnimationFrame(() => {
      if (typeof variants[i] === 'function') {
        stage.innerHTML = variants[i]();
      } else if (typeof variants[i] === 'string') {
        stage.innerHTML = variants[i];
      }
    });
  }

  function setActive(i) {
    if (i < 0 || i >= items.length) return;
    current = i;
    items.forEach((el, j) => {
      if (j === i) {
        el.setAttribute('data-active', '');
        el.setAttribute('aria-current', 'true');
      } else {
        el.removeAttribute('data-active');
        el.removeAttribute('aria-current');
      }
    });
    moveHighlight();
    try {
      const url = new URL(location);
      url.searchParams.set('v', i + 1);
      history.replaceState(null, '', url);
    } catch (_) {}
    mount(i);
  }

  items.forEach((el, i) => el.addEventListener('click', () => setActive(i)));
  if (replay) {
    replay.addEventListener('click', () => mount(current));
  }
  window.addEventListener('resize', moveHighlight);

  document.addEventListener('keydown', (e) => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName) || e.target?.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= items.length) {
      setActive(num - 1);
    } else if (e.key === 'ArrowRight') {
      setActive((current + 1) % items.length);
    } else if (e.key === 'ArrowLeft') {
      setActive((current - 1 + items.length) % items.length);
    } else if (e.key === 'r' || e.key === 'R') {
      mount(current);
    }
  });

  const initialVariant = (parseInt(new URLSearchParams(location.search).get('v'), 10) || 1) - 1;
  setActive(initialVariant >= 0 && initialVariant < items.length ? initialVariant : 0);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      picker.setAttribute('data-ready', '');
    });
  });
})();
`.trim();
}

/**
 * Scaffolds a complete, self-contained HTML prototype preview document.
 * @param {string} title Feature title
 * @param {Array<string|Object>} variants
 * @param {Object} [options]
 * @returns {string} Standalone HTML document
 */
export function scaffoldPrototypeHtml(title, variants, options = {}) {
  const norm = normalizeVariants(variants);
  const safeTitle = escapeHtml(title || 'Multi-Variant Prototype Preview');
  const pickerCss = getPickerCss();
  const pickerHtml = generatePickerHtml(norm, options);

  // Generate distinct default render functions if none specified
  const renderFunctions = norm.map((v, i) => {
    const fnName = v.render.replace(/\(\)$/, '');
    const variantMoods = [
      { bg: '#090a0f', text: '#e6edf3', accent: '#38bdf8', label: 'Persuade (Kinetic & Bold)', desc: 'Asymmetric editorial rhythm with high-contrast anchor punch.' },
      { bg: '#0d1117', text: '#c9d1d9', accent: '#4ade80', label: 'Operate (High Density Cockpit)', desc: 'Structured grid, compact spacing, and instant information ergonomics.' },
      { bg: '#faf9f6', text: '#1a1a1a', accent: '#d97706', label: 'Read (Editorial Warmth)', desc: 'Humanist serif balance, generous margins, and distraction-free clarity.' },
      { bg: '#0f172a', text: '#f8fafc', accent: '#818cf8', label: 'Experience (Fluid Tactile)', desc: 'Apple spring physics, subtle depth, and organic responsive flow.' },
      { bg: '#18181b', text: '#f4f4f5', accent: '#f43f5e', label: 'Experimental (Raw Asymmetry)', desc: 'Bento multi-span hierarchy with zero cookie-cutter cards.' }
    ];
    const mood = variantMoods[i % variantMoods.length];

    return `
function ${fnName}() {
  return \`
    <div class="variant-stage" style="background: ${mood.bg}; color: ${mood.text};">
      <div class="variant-content">
        <span class="variant-badge" style="color: ${mood.accent}; border-color: ${mood.accent}33;">${escapeHtml(v.label)}</span>
        <h1 class="variant-heading">${escapeHtml(mood.label)}</h1>
        <p class="variant-desc">${escapeHtml(mood.desc)}</p>
        <div class="variant-actions">
          <button class="variant-btn" style="background: ${mood.accent}; color: ${mood.bg === '#faf9f6' ? '#fff' : '#000'};">Explore Variant</button>
          <span class="variant-hint">Press 1-\${items.length} or ←/→ to switch • R to replay</span>
        </div>
      </div>
    </div>
  \`;
}
    `.trim();
  }).join('\n\n');

  const clientScript = generatePickerClientScript(norm, options);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow-x: hidden;
      background: #000;
    }
    #stage {
      width: 100vw;
      min-height: 100vh;
      display: flex;
    }
    .variant-stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 24px 96px;
      animation: proto-fade-in 180ms ease-out;
    }
    @keyframes proto-fade-in {
      from { opacity: 0.4; transform: scale(0.995); }
      to { opacity: 1; transform: scale(1); }
    }
    .variant-content {
      max-width: 640px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .variant-badge {
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid currentColor;
    }
    .variant-heading {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }
    .variant-desc {
      font-size: 1.125rem;
      opacity: 0.8;
      max-width: 480px;
      line-height: 1.5;
    }
    .variant-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
    }
    .variant-btn {
      padding: 12px 28px;
      border-radius: 999px;
      border: none;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
    }
    .variant-hint {
      font-size: 12px;
      opacity: 0.5;
    }

${pickerCss}
  </style>
</head>
<body>
  <div id="stage"></div>

${pickerHtml}

  <script>
${renderFunctions}

${clientScript}
  </script>
</body>
</html>
`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
