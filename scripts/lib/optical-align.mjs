/**
 * Optical Centering Engine & Concentric Border Radius Calculator
 *
 * Implements mathematical geometry for parallel concentric corner radii,
 * sub-pixel optical vertical alignment for icons and typography cap-heights,
 * and anti-chrome hairline border depth tokens.
 */

/**
 * Calculates mathematically parallel concentric inner corner radius:
 * Formula: r_inner = max(0, r_outer - padding)
 *
 * Prevents corner-pinching and visual dissonance caused by mismatched nested curves.
 * @param {number} outerRadius Outer container corner radius (px)
 * @param {number} padding Inset padding between outer container and inner child (px)
 * @returns {number} Inner corner radius in px
 */
export function computeConcentricRadius(outerRadius, padding) {
  const outer = Math.max(0, Number(outerRadius ?? 0));
  const pad = Math.max(0, Number(padding ?? 0));
  const inner = Math.max(0, outer - pad);
  return Number(inner.toFixed(2));
}

/**
 * Calculates required padding to achieve concentric relationship between outer and inner radius.
 * @param {number} outerRadius
 * @param {number} innerRadius
 * @returns {number}
 */
export function computeConcentricPadding(outerRadius, innerRadius) {
  const outer = Math.max(0, Number(outerRadius ?? 0));
  const inner = Math.max(0, Number(innerRadius ?? 0));
  const pad = Math.max(0, outer - inner);
  return Number(pad.toFixed(2));
}

/**
 * Calculates sub-pixel optical vertical adjustment for SVG icons paired with text labels.
 *
 * Replaces naive geometric midpoint alignment with optical center-of-mass balancing
 * relative to the typography's cap-height line.
 *
 * @param {Object} params
 * @param {number} params.iconSize Physical dimension of icon in px (e.g. 18)
 * @param {number} params.fontSize Typography font-size in px (e.g. 14)
 * @param {number} [params.capHeightRatio=0.70] Font cap-height to em ratio (typically 0.68 - 0.72)
 * @param {number} [params.visualWeight=0.5] Optical balancing weight factor
 * @returns {{ offsetPx: number, transform: string }} Subpixel optical offset
 */
export function computeOpticalIconOffset({
  iconSize = 18,
  fontSize = 14,
  capHeightRatio = 0.70,
  visualWeight = 0.5
} = {}) {
  const s = Math.max(1, Number(iconSize));
  const f = Math.max(1, Number(fontSize));
  const chr = Math.max(0.5, Math.min(0.9, Number(capHeightRatio)));
  const weight = Math.max(0, Math.min(1.0, Number(visualWeight)));

  // In standard em-boxes, empty ascender whitespace causes icons to look vertically
  // misaligned relative to uppercase / numeral visual mass.
  // We calculate the delta between the em-box center and the cap-height center:
  const capHeight = f * chr;
  const capCenter = capHeight / 2;
  const emCenter = f / 2;
  const visualShift = (emCenter - capCenter) * weight;

  // Subtle downward or upward compensation rounded to subpixel precision (0.25px or 0.5px)
  const offsetPx = Number((-visualShift).toFixed(2));

  return {
    offsetPx,
    transform: `translateY(${offsetPx}px)`
  };
}

/**
 * Computes baseline optical shift compensating for line-height and ascender/descender imbalance.
 * @param {Object} params
 * @param {number} params.fontSize
 * @param {number} [params.lineHeight=1.25]
 * @param {number} [params.capHeightRatio=0.70]
 * @returns {number} Optical baseline adjustment in px
 */
export function computeOpticalTextAdjustment({
  fontSize = 14,
  lineHeight = 1.25,
  capHeightRatio = 0.70
} = {}) {
  const f = Math.max(1, Number(fontSize));
  const lh = Math.max(1, Number(lineHeight));
  const chr = Math.max(0.5, Math.min(0.9, Number(capHeightRatio)));

  const boxHeight = f * lh;
  const capHeight = f * chr;
  const baselineDelta = ((boxHeight - capHeight) / 2) - ((boxHeight - f) / 2);

  return Number(baselineDelta.toFixed(2));
}

/**
 * Emits CSS custom properties enforcing mathematical concentricity.
 * @param {Object} [params]
 * @param {number} [params.outerRadius=14]
 * @param {number} [params.padding=4]
 * @param {string} [params.prefix='concentric']
 * @returns {{ outerRadius: number, padding: number, innerRadius: number, tokens: Object, cssText: string }}
 */
export function getConcentricCssTokens({
  outerRadius = 14,
  padding = 4,
  prefix = 'concentric'
} = {}) {
  const outer = Math.max(0, Number(outerRadius));
  const pad = Math.max(0, Number(padding));
  const inner = computeConcentricRadius(outer, pad);

  const tokens = {
    [`--${prefix}-radius-outer`]: `${outer}px`,
    [`--${prefix}-padding`]: `${pad}px`,
    [`--${prefix}-radius-inner`]: `${inner}px`
  };

  const cssText = Object.entries(tokens)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');

  return {
    outerRadius: outer,
    padding: pad,
    innerRadius: inner,
    tokens,
    cssText
  };
}
