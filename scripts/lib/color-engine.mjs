/**
 * color-engine.mjs: Pure Node.js ESM Perceptual Color Engine.
 *
 * Implements:
 * - OKLCH <-> sRGB bidirectional color space transformations (CSS Color 4).
 * - Relative luminance and WCAG 2.2 AA / AAA contrast ratio calculations.
 * - APCA (Accessible Perceptual Contrast Algorithm) lightness contrast estimation.
 * - Dynamic contrast guarantee (iterative lightness adjustment).
 * - Hue-tinted neutral derivation (eliminating dead AI grays).
 * - 9-step luminance ramps and harmonic palette generation (analogous, complementary, triadic, etc.).
 */

// ---- Color Space Math (OKLCH <-> sRGB) -------------------------------------

/**
 * Linearize an sRGB channel value [0, 255] to [0, 1].
 */
export function sRgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Gamma-encode a linear channel value [0, 1] to sRGB [0, 255].
 */
export function linearToSRgb(v) {
  const clamped = Math.max(0, Math.min(1, v));
  const enc = clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, enc * 255)));
}

/**
 * Convert OKLCH to sRGB [r, g, b].
 * @param {number} l - Lightness [0, 1]
 * @param {number} c - Chroma [0, ~0.4]
 * @param {number} h - Hue [0, 360] in degrees
 * @returns {[number, number, number]} RGB values in [0, 255]
 */
export function oklchToRgb(l, c, h) {
  const rad = (Number(h || 0) * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);

  // Oklab to LMS cone response
  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b;

  const lCone = lPrime * lPrime * lPrime;
  const mCone = mPrime * mPrime * mPrime;
  const sCone = sPrime * sPrime * sPrime;

  // LMS to linear sRGB
  const rLin = +4.0767416621 * lCone - 3.3077115913 * mCone + 0.2309699292 * sCone;
  const gLin = -1.2684380046 * lCone + 2.6097574011 * mCone - 0.3413193965 * sCone;
  const bLin = -0.0041960863 * lCone - 0.7034186147 * mCone + 1.707614701 * sCone;

  return [linearToSRgb(rLin), linearToSRgb(gLin), linearToSRgb(bLin)];
}

/**
 * Convert sRGB [r, g, b] (0-255) to OKLCH { l, c, h }.
 */
export function rgbToOklch(r, g, b) {
  const rLin = sRgbToLinear(r);
  const gLin = sRgbToLinear(g);
  const bLin = sRgbToLinear(b);

  // Linear sRGB to LMS
  const lCone = Math.cbrt(0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin);
  const mCone = Math.cbrt(0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin);
  const sCone = Math.cbrt(0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin);

  // LMS to Oklab
  const l = 0.2104542553 * lCone + 0.793617785 * mCone - 0.0040720468 * sCone;
  const a = 1.9779984951 * lCone - 2.428592205 * mCone + 0.4505937099 * sCone;
  const bOklab = 0.0259040371 * lCone + 0.7827717662 * mCone - 0.808675766 * sCone;

  const c = Math.sqrt(a * a + bOklab * bOklab);
  let h = (Math.atan2(bOklab, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return {
    l: Math.round(Math.max(0, Math.min(1, l)) * 1000) / 1000,
    c: Math.round(c * 1000) / 1000,
    h: Math.round(h * 10) / 10,
  };
}

/**
 * Parse hex string to RGB [r, g, b].
 */
export function hexToRgb(hex) {
  let clean = String(hex || '').trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((char) => char + char).join('');
  }
  if (clean.length !== 6) {
    throw new Error(`Invalid hex color: #${clean}`);
  }
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Convert RGB [r, g, b] to hex string.
 */
export function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Parse hex, rgb, or oklch format to RGB [r, g, b].
 */
export function parseColor(color) {
  if (Array.isArray(color) && color.length === 3) return color;
  if (typeof color === 'object' && color.l != null && color.c != null && color.h != null) {
    return oklchToRgb(color.l, color.c, color.h);
  }
  const s = String(color || '').trim();
  if (s.startsWith('#')) return hexToRgb(s);

  // oklch(l c h)
  const oklchMatch = s.match(/oklch\(\s*([\d.%]+)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*\)/i);
  if (oklchMatch) {
    const lRaw = oklchMatch[1];
    const l = lRaw.endsWith('%') ? parseFloat(lRaw) / 100 : parseFloat(lRaw);
    const c = parseFloat(oklchMatch[2]);
    const h = parseFloat(oklchMatch[3]);
    return oklchToRgb(l, c, h);
  }

  // rgb(r, g, b)
  const rgbMatch = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    return [parseInt(rgbMatch[1], 10), parseInt(rgbMatch[2], 10), parseInt(rgbMatch[3], 10)];
  }

  throw new Error(`Unsupported color format: ${color}`);
}

// ---- Contrast Science (WCAG 2.2 & APCA) ------------------------------------

/**
 * Compute WCAG 2.2 relative luminance Y of an RGB [r, g, b] color.
 */
export function relativeLuminance(rgb) {
  const [r, g, b] = parseColor(rgb);
  const rLin = sRgbToLinear(r);
  const gLin = sRgbToLinear(g);
  const bLin = sRgbToLinear(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Calculate WCAG 2.2 contrast ratio and APCA score between two colors.
 */
export function calculateContrast(colorA, colorB) {
  const rgbA = parseColor(colorA);
  const rgbB = parseColor(colorB);

  const yA = relativeLuminance(rgbA);
  const yB = relativeLuminance(rgbB);

  const l1 = Math.max(yA, yB);
  const l2 = Math.min(yA, yB);
  const ratio = Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;

  // APCA (Accessible Perceptual Contrast Algorithm) empirical estimation
  // Uses power law: Y^0.56 with soft clamp
  const apcaScore = estimateApca(yA, yB);

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAALarge: ratio >= 3.0,
    wcagAAA: ratio >= 7.0,
    wcagAAALarge: ratio >= 4.5,
    apcaScore,
    apcaPassBody: Math.abs(apcaScore) >= 60,
    apcaPassLarge: Math.abs(apcaScore) >= 45,
  };
}

/**
 * Empirical APCA Lightness Contrast (Lc) estimation.
 */
function estimateApca(txtY, bgY) {
  const blkThrs = 0.022;
  const blkClmp = 1.414;

  let yTxt = txtY > blkThrs ? txtY : txtY + Math.pow(blkThrs - txtY, blkClmp);
  let yBg = bgY > blkThrs ? bgY : bgY + Math.pow(blkThrs - bgY, blkClmp);

  if (Math.abs(yBg - yTxt) < 0.0005) return 0;

  let sapc = 0;
  if (yBg > yTxt) {
    // Dark text on light background
    sapc = (Math.pow(yBg, 0.56) - Math.pow(yTxt, 0.57)) * 1.14;
  } else {
    // Light text on dark background
    sapc = (Math.pow(yBg, 0.65) - Math.pow(yTxt, 0.62)) * 1.14;
  }

  const output = sapc < 0.1 ? sapc * 100 : (sapc - 0.027) * 100;
  return Math.round(output);
}

/**
 * Adjust foreground OKLCH lightness until minimum contrast against background is achieved.
 */
export function guaranteeContrast(foregroundOklch, backgroundOklch, minRatio = 4.5) {
  let fg = typeof foregroundOklch === 'object' ? { ...foregroundOklch } : rgbToOklch(...parseColor(foregroundOklch));
  const bg = typeof backgroundOklch === 'object' ? { ...backgroundOklch } : rgbToOklch(...parseColor(backgroundOklch));

  const bgRgb = oklchToRgb(bg.l, bg.c, bg.h);
  const bgLum = relativeLuminance(bgRgb);

  // Direction: if bg is dark, push fg lighter; if bg is light, push fg darker
  const pushLighter = bgLum < 0.4;
  const step = pushLighter ? 0.02 : -0.02;

  let attempts = 0;
  while (attempts < 45) {
    const currentRgb = oklchToRgb(fg.l, fg.c, fg.h);
    const contrast = calculateContrast(currentRgb, bgRgb);
    if (contrast.ratio >= minRatio) {
      return {
        l: Math.round(fg.l * 1000) / 1000,
        c: Math.round(fg.c * 1000) / 1000,
        h: fg.h,
        hex: rgbToHex(...currentRgb),
        ratio: contrast.ratio,
      };
    }

    fg.l = Math.max(0.02, Math.min(0.98, fg.l + step));
    // Taper chroma near white or black to prevent gamut distortion
    if (fg.l > 0.85 || fg.l < 0.15) {
      fg.c = Math.max(0.01, fg.c * 0.92);
    }
    attempts++;
  }

  // Final fallback to pure black or pure white if threshold unreachable
  const finalL = pushLighter ? 0.98 : 0.05;
  const finalRgb = oklchToRgb(finalL, 0.005, fg.h);
  return {
    l: finalL,
    c: 0.005,
    h: fg.h,
    hex: rgbToHex(...finalRgb),
    ratio: calculateContrast(finalRgb, bgRgb).ratio,
  };
}

// ---- Palette & Neutral Derivation -----------------------------------------

/**
 * Generate a 9-step luminance ramp (50 to 950) in OKLCH for a given hue.
 */
export function generateLuminanceRamp(hue, baseChroma = 0.18) {
  const steps = [
    { step: 50, l: 0.97, cMult: 0.15 },
    { step: 100, l: 0.93, cMult: 0.25 },
    { step: 200, l: 0.86, cMult: 0.45 },
    { step: 300, l: 0.76, cMult: 0.70 },
    { step: 400, l: 0.66, cMult: 0.90 },
    { step: 500, l: 0.56, cMult: 1.00 }, // Base brand color
    { step: 600, l: 0.46, cMult: 0.95 },
    { step: 700, l: 0.36, cMult: 0.85 },
    { step: 800, l: 0.26, cMult: 0.65 },
    { step: 900, l: 0.16, cMult: 0.40 },
    { step: 950, l: 0.10, cMult: 0.20 },
  ];

  return steps.map(({ step, l, cMult }) => {
    const c = Math.round(baseChroma * cMult * 1000) / 1000;
    const rgb = oklchToRgb(l, c, hue);
    return {
      step,
      l,
      c,
      h: hue,
      oklch: `oklch(${l} ${c} ${hue})`,
      hex: rgbToHex(...rgb),
    };
  });
}

/**
 * Derive surface, border, and text neutrals tinted with brand hue chroma.
 * Prevents dead, desaturated AI grays.
 */
export function generateHueNeutrals(brandHue) {
  const h = Number(brandHue || 240);
  const neutralChroma = 0.012; // Subtle harmonious tint

  // Light theme tokens
  const lightCanvas = { l: 0.985, c: neutralChroma, h };
  const lightSurface = { l: 0.96, c: neutralChroma * 1.1, h };
  const lightBorder = { l: 0.88, c: neutralChroma * 1.3, h };
  const lightTextMuted = guaranteeContrast({ l: 0.45, c: neutralChroma * 1.5, h }, lightCanvas, 4.5);
  const lightTextPrimary = guaranteeContrast({ l: 0.12, c: neutralChroma, h }, lightCanvas, 7.0);

  // Dark theme tokens
  const darkCanvas = { l: 0.12, c: neutralChroma * 1.2, h };
  const darkSurface = { l: 0.17, c: neutralChroma * 1.3, h };
  const darkBorder = { l: 0.25, c: neutralChroma * 1.5, h };
  const darkTextMuted = guaranteeContrast({ l: 0.70, c: neutralChroma * 1.5, h }, darkCanvas, 4.5);
  const darkTextPrimary = guaranteeContrast({ l: 0.96, c: neutralChroma, h }, darkCanvas, 7.0);

  return {
    hue: h,
    light: {
      canvas: { ...lightCanvas, hex: rgbToHex(...oklchToRgb(lightCanvas.l, lightCanvas.c, lightCanvas.h)) },
      surface: { ...lightSurface, hex: rgbToHex(...oklchToRgb(lightSurface.l, lightSurface.c, lightSurface.h)) },
      border: { ...lightBorder, hex: rgbToHex(...oklchToRgb(lightBorder.l, lightBorder.c, lightBorder.h)) },
      textMuted: lightTextMuted,
      textPrimary: lightTextPrimary,
    },
    dark: {
      canvas: { ...darkCanvas, hex: rgbToHex(...oklchToRgb(darkCanvas.l, darkCanvas.c, darkCanvas.h)) },
      surface: { ...darkSurface, hex: rgbToHex(...oklchToRgb(darkSurface.l, darkSurface.c, darkSurface.h)) },
      border: { ...darkBorder, hex: rgbToHex(...oklchToRgb(darkBorder.l, darkBorder.c, darkBorder.h)) },
      textMuted: darkTextMuted,
      textPrimary: darkTextPrimary,
    },
  };
}

/**
 * Generate harmonic palette scheme and semantic tokens.
 */
export function generateHarmonicPalette(baseHue, schemeType = 'monochromatic') {
  const h = Number(baseHue || 240);
  const normalize = (deg) => Math.round(((deg % 360) + 360) % 360);

  let hues = [h];
  const type = String(schemeType || '').toLowerCase();

  switch (type) {
    case 'analogous':
      hues = [normalize(h - 30), h, normalize(h + 30)];
      break;
    case 'complementary':
      hues = [h, normalize(h + 180)];
      break;
    case 'split-complementary':
      hues = [h, normalize(h + 150), normalize(h + 210)];
      break;
    case 'triadic':
      hues = [h, normalize(h + 120), normalize(h + 240)];
      break;
    default:
      // monochromatic
      hues = [h];
      break;
  }

  const primaryRamp = generateLuminanceRamp(h, 0.18);
  const neutrals = generateHueNeutrals(h);

  // Semantic color scales
  const semantics = {
    success: generateLuminanceRamp(142, 0.16)[5], // Green
    warning: generateLuminanceRamp(85, 0.16)[5],  // Amber/Gold
    error: generateLuminanceRamp(25, 0.18)[5],    // Crimson/Red
    info: generateLuminanceRamp(220, 0.16)[5],    // Blue
  };

  return {
    baseHue: h,
    schemeType: type || 'monochromatic',
    hues,
    primaryRamp,
    neutrals,
    semantics,
  };
}
