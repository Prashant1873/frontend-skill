/**
 * ux-engine.mjs: Cognitive UX Laws Audit & Friction Scanner Engine.
 *
 * Evaluates markup against core behavioral psychology & cognitive ergonomics laws:
 * 1. Hick's Law: Decision time increases logarithmically with choice count (T = b * log2(n + 1)).
 *    Flags competing primary CTAs, high flat navigation density, and unranked action clusters.
 * 2. Fitts's Law: Acquisition time is a function of target distance and width.
 *    Flags sub-44px touch targets, tiny clickables (<24px WCAG / <44px Apple HIG), and crowded hitboxes.
 * 3. Miller's Law: Working memory holds 7 ± 2 items (optimal chunking: 4-5 items).
 *    Flags form input fatigue (>6 unchunked fields), long visual lists without categorization,
 *    and unsegmented KPI grids.
 *
 * Computes Cognitive Friction Index (CFI, 0-100) and line-level remediation diffs.
 */

// Heuristic thresholds
export const UX_THRESHOLDS = Object.freeze({
  MIN_TOUCH_TARGET_PX: 44,       // Apple HIG & WCAG AAA recommendation
  HARD_MIN_TARGET_PX: 24,        // WCAG 2.2 AA SC 2.5.8 Target Size Minimum
  MAX_PRIMARY_CTAS: 1,           // Per container / view
  MAX_FLAT_NAV_ITEMS: 7,         // Miller's upper limit for flat choices
  MAX_UNCHUNKED_FORM_FIELDS: 6,  // Forms without <fieldset> or stepper
  MAX_UNCHUNKED_LIST_ITEMS: 7,   // Lists without headers or categorization
});

/**
 * Parses lines with 1-based indexing for reporting.
 */
function getLineNumber(content, index) {
  if (index < 0) return 1;
  const prefix = content.slice(0, index);
  return prefix.split('\n').length;
}

/**
 * 1. Audit Hick's Law: Decision Density & Choice Hierarchy
 *
 * @param {string} html
 * @param {Object} [options={}]
 * @returns {Array<Object>} Findings
 */
export function auditHicksLaw(html, options = {}) {
  const findings = [];

  // Check 1: Competing Primary CTAs in a single container
  // Look for sections / form / headers with multiple primary buttons
  const containerRegex = /<(?:header|nav|form|section|div)[^>]*>([\s\S]*?)<\/(?:header|nav|form|section|div)>/gi;
  let containerMatch;

  // Global scan for primary buttons
  const primaryButtonRegex = /<(?:button|a)[^>]*class=["'][^"']*\b(?:btn-primary|button-primary|cta-primary|bg-primary|primary-btn)\b[^"']*["'][^>]*>([\s\S]*?)<\/(?:button|a)>/gi;
  const primaryButtons = [];
  let btnMatch;

  while ((btnMatch = primaryButtonRegex.exec(html)) !== null) {
    primaryButtons.push({
      snippet: btnMatch[0],
      text: btnMatch[1].replace(/<[^>]+>/g, '').trim(),
      index: btnMatch.index,
    });
  }

  if (primaryButtons.length > 2) {
    findings.push({
      ruleId: 'HICK-01',
      law: "Hick's Law",
      severity: 'warning',
      title: 'Multiple Competing Primary Actions',
      message: `Detected ${primaryButtons.length} primary CTA elements. Hick's law dictates that competing high-prominence actions increase cognitive decision latency.`,
      line: getLineNumber(html, primaryButtons[1].index),
      snippet: primaryButtons.map((b) => b.snippet.trim()).slice(0, 3).join('\n'),
      remediation: 'Designate exactly 1 primary CTA; demote secondary actions to ghost/outline variants or subtle text buttons.',
      weight: 12,
    });
  }

  // Check 2: Choice Overload in Flat Navigation (<nav> with >7 links without grouping)
  const navRegex = /<nav[^>]*>([\s\S]*?)<\/nav>/gi;
  let navMatch;

  while ((navMatch = navRegex.exec(html)) !== null) {
    const navContent = navMatch[1];
    const linkCount = (navContent.match(/<a\b/gi) || []).length;

    // Check if navigation has subsections (<ul class="sub">, <details>, <optgroup>)
    const hasGrouping = /<(?:details|menu|fieldset)\b|data-group|sub-menu|dropdown/i.test(navContent);

    if (linkCount > UX_THRESHOLDS.MAX_FLAT_NAV_ITEMS && !hasGrouping) {
      findings.push({
        ruleId: 'HICK-02',
        law: "Hick's Law",
        severity: 'error',
        title: 'Flat Navigation Choice Overload',
        message: `Navigation contains ${linkCount} flat links without visual grouping or disclosure. Exceeds working choice capacity.`,
        line: getLineNumber(html, navMatch.index),
        snippet: navMatch[0].slice(0, 180) + '...',
        remediation: 'Group related navigation items into categorized drop-downs, disclosure menus, or distinct priority tiers.',
        weight: 15,
      });
    }
  }

  // Check 3: Action clusters with 3+ identical buttons lacking hierarchy
  const clusterRegex = /<(?:div|menu)[^>]*class=["'][^"']*\b(?:btn-group|button-group|actions|action-cluster)\b[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|menu)>/gi;
  let clusterMatch;

  while ((clusterMatch = clusterRegex.exec(html)) !== null) {
    const clusterHtml = clusterMatch[1];
    const buttons = clusterHtml.match(/<(?:button|a)\b/gi) || [];

    if (buttons.length >= 4) {
      const hasSecondary = /secondary|ghost|outline|subtle|muted/i.test(clusterHtml);
      if (!hasSecondary) {
        findings.push({
          ruleId: 'HICK-03',
          law: "Hick's Law",
          severity: 'warning',
          title: 'Unranked Action Cluster',
          message: `Action cluster contains ${buttons.length} sibling buttons with identical visual weighting, causing decision hesitation.`,
          line: getLineNumber(html, clusterMatch.index),
          snippet: clusterMatch[0].slice(0, 150) + '...',
          remediation: 'Apply clear visual hierarchy: 1 primary button, 1 secondary button, and hide lower-frequency actions in an overflow menu.',
          weight: 10,
        });
      }
    }
  }

  return findings;
}

/**
 * 2. Audit Fitts's Law: Target Acquisition & Touch Geometry
 *
 * @param {string} html
 * @param {Object} [options={}]
 * @returns {Array<Object>} Findings
 */
export function auditFittssLaw(html, options = {}) {
  const findings = [];

  // Check 1: Explicit sub-44px or sub-24px button dimensions
  // Matches <button ... style="...width: 16px; height: 16px;..."> or class="w-4 h-4" or width/height attributes
  const buttonTagRegex = /<(?:button|a|input)[^>]*\b(?:style=["'][^"']*|class=["'][^"']*|width=["'][^"']*|height=["'][^"']*)[^>]*>/gi;
  let tagMatch;

  while ((tagMatch = buttonTagRegex.exec(html)) !== null) {
    const tag = tagMatch[0];

    // Check style="width: 16px; height: 16px;" or similar
    const styleWidthMatch = /width\s*:\s*(\d+)px/i.exec(tag);
    const styleHeightMatch = /height\s*:\s*(\d+)px/i.exec(tag);

    const w = styleWidthMatch ? parseInt(styleWidthMatch[1], 10) : null;
    const h = styleHeightMatch ? parseInt(styleHeightMatch[1], 10) : null;

    // Check if there is padding or touch target expander
    const hasMinTarget = /min-(?:width|height|inline-size|block-size)\s*:\s*44px/i.test(tag);
    const hasHitboxExpand = /hitbox|touch-target|expand-hitbox/i.test(tag);

    if ((w !== null && w < UX_THRESHOLDS.MIN_TOUCH_TARGET_PX) || (h !== null && h < UX_THRESHOLDS.MIN_TOUCH_TARGET_PX)) {
      if (!hasMinTarget && !hasHitboxExpand) {
        const isCritical = (w !== null && w < UX_THRESHOLDS.HARD_MIN_TARGET_PX) || (h !== null && h < UX_THRESHOLDS.HARD_MIN_TARGET_PX);

        findings.push({
          ruleId: 'FITTS-01',
          law: "Fitts's Law",
          severity: isCritical ? 'error' : 'warning',
          title: 'Sub-44px Touch Target Size',
          message: `Interactive target has explicit geometry (${w ?? '?'}x${h ?? '?'}px) under the 44x44px minimum touch target standard (Apple HIG & WCAG AAA).`,
          line: getLineNumber(html, tagMatch.index),
          snippet: tag,
          remediation: `Add "min-inline-size: 44px; min-block-size: 44px;" or use a pseudo-element hit expander (::before { inset: -10px; }).`,
          weight: isCritical ? 20 : 12,
        });
      }
    }

    // Check Tailwind tiny utility classes on interactive elements: w-3, w-4, w-5, h-3, h-4, h-5 without p-3+
    const tinyClassMatch = /\b(?:w-[345]|h-[345]|size-[345])\b/i.test(tag);
    const generousPaddingMatch = /\b(?:p-[3456]|px-[3456]|py-[3456])\b/i.test(tag);

    if (tinyClassMatch && !generousPaddingMatch && !hasHitboxExpand && !hasMinTarget) {
      findings.push({
        ruleId: 'FITTS-02',
        law: "Fitts's Law",
        severity: 'warning',
        title: 'Undersized Icon Hitbox',
        message: 'Interactive icon button uses compact sizing utilities without touch padding, making mobile tap acquisition prone to misses.',
        line: getLineNumber(html, tagMatch.index),
        snippet: tag,
        remediation: 'Provide at least 12px padding (p-3) or establish min-width: 44px, min-height: 44px.',
        weight: 10,
      });
    }
  }

  // Check 2: Bare checkbox / radio inputs without associated label wrappers or min dimensions
  const bareInputRegex = /<input[^>]*type=["'](?:checkbox|radio)["'][^>]*>/gi;
  let inputMatch;

  while ((inputMatch = bareInputRegex.exec(html)) !== null) {
    const inputTag = inputMatch[0];
    const hasLabelWrap = /id=["']([^"']+)["']/i.test(inputTag);
    const isTiny = /width\s*:\s*(?:1[0-4]|8)px/i.test(inputTag);

    if (isTiny) {
      findings.push({
        ruleId: 'FITTS-03',
        law: "Fitts's Law",
        severity: 'warning',
        title: 'Micro Checkbox/Radio Hitbox',
        message: 'Checkbox or radio input explicitly sized below 16px without hit target expansion.',
        line: getLineNumber(html, inputMatch.index),
        snippet: inputTag,
        remediation: 'Wrap input in <label class="flex items-center gap-2 p-2 cursor-pointer"> to expand tap area to text bounds.',
        weight: 8,
      });
    }
  }

  return findings;
}

/**
 * 3. Audit Miller's Law: Chunking & Working Memory Load
 *
 * @param {string} html
 * @param {Object} [options={}]
 * @returns {Array<Object>} Findings
 */
export function auditMillersLaw(html, options = {}) {
  const findings = [];

  // Check 1: Form input fatigue (>6 fields without <fieldset>, <details>, or stepper cards)
  const formRegex = /<form[^>]*>([\s\S]*?)<\/form>/gi;
  let formMatch;

  while ((formMatch = formRegex.exec(html)) !== null) {
    const formContent = formMatch[1];
    const inputs = formContent.match(/<(?:input(?![^>]*type=["']hidden["'])|select|textarea)\b/gi) || [];

    const hasChunking = /<(?:fieldset|details|section)\b|data-step|form-section|form-step/i.test(formContent);

    if (inputs.length > UX_THRESHOLDS.MAX_UNCHUNKED_FORM_FIELDS && !hasChunking) {
      findings.push({
        ruleId: 'MILLER-01',
        law: "Miller's Law",
        severity: 'error',
        title: 'Unchunked Form Cognitive Fatigue',
        message: `Form contains ${inputs.length} consecutive input fields in a single flat view without semantic fieldsets or progressive disclosure.`,
        line: getLineNumber(html, formMatch.index),
        snippet: `<form ...> (${inputs.length} inputs without <fieldset>)`,
        remediation: 'Divide form into logical chunks of 3-5 fields using <fieldset><legend>...</legend></fieldset> or a multi-step stepper.',
        weight: 18,
      });
    }
  }

  // Check 2: Unchunked long lists (>7 items in <ul> or <ol> without headings or visual categories)
  const listRegex = /<(?:ul|ol)[^>]*>([\s\S]*?)<\/(?:ul|ol)>/gi;
  let listMatch;

  while ((listMatch = listRegex.exec(html)) !== null) {
    const listContent = listMatch[1];
    const items = listContent.match(/<li\b/gi) || [];

    // Ignore if pagination, nav, or category dividers are present
    const isNav = /nav|menu|pagination/i.test(listMatch[0]);
    const hasCategoryDividers = /divider|category|header|<h[1-6]\b/i.test(listContent);

    if (items.length > UX_THRESHOLDS.MAX_UNCHUNKED_LIST_ITEMS && !isNav && !hasCategoryDividers) {
      findings.push({
        ruleId: 'MILLER-02',
        law: "Miller's Law",
        severity: 'warning',
        title: 'Unchunked List Information Density',
        message: `List contains ${items.length} unchunked items. Working memory retention degrades after 7 ± 2 unstructured entries.`,
        line: getLineNumber(html, listMatch.index),
        snippet: `<${listMatch[0].slice(1, 40)}...> (${items.length} <li> items)`,
        remediation: 'Introduce category subheadings, visual rhythm breaks, or progressive disclosure for lists longer than 7 items.',
        weight: 10,
      });
    }
  }

  // Check 3: KPI / Stat grid overload (>6 unchunked metrics in single view)
  const statGridRegex = /<(?:div|section)[^>]*class=["'][^"']*\b(?:stats-grid|metrics-grid|kpi-grid)\b[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section)>/gi;
  let statMatch;

  while ((statMatch = statGridRegex.exec(html)) !== null) {
    const statContent = statMatch[1];
    const cards = statContent.match(/class=["'][^"']*\b(?:stat-card|metric-card|kpi-card)\b[^"']*/gi) || [];

    if (cards.length > 6) {
      findings.push({
        ruleId: 'MILLER-03',
        law: "Miller's Law",
        severity: 'warning',
        title: 'Metric Dashboard Cognitive Overload',
        message: `Dashboard grid displays ${cards.length} unorganized metrics simultaneously, creating visual dashboard clutter.`,
        line: getLineNumber(html, statMatch.index),
        snippet: statMatch[0].slice(0, 140) + '...',
        remediation: 'Group metrics into high-level business domains (e.g. Growth, Revenue, Engagement) with tabbed or sectioned views.',
        weight: 8,
      });
    }
  }

  return findings;
}

/**
 * Calculates Cognitive Friction Index (CFI) on a 0-100 scale.
 *
 * @param {Array<Object>} findings
 * @returns {{ score: number, rating: string }}
 */
export function calculateFrictionIndex(findings = []) {
  if (!findings || findings.length === 0) {
    return { score: 0, rating: 'Frictionless (Optimal)' };
  }

  const rawSum = findings.reduce((acc, f) => acc + (f.weight || 10), 0);
  const score = Math.min(100, Math.round(rawSum));

  let rating = 'Low friction';
  if (score > 60) {
    rating = 'Severe friction (High abandonment risk)';
  } else if (score > 35) {
    rating = 'High friction (Attention needed)';
  } else if (score > 15) {
    rating = 'Moderate friction (Acceptable)';
  }

  return { score, rating };
}

/**
 * Generates an actionable remediation diff representation.
 *
 * @param {Object} finding
 * @returns {string} Formatted remediation
 */
export function generateRemediationDiff(finding) {
  const lines = [
    `Rule: [${finding.ruleId}] ${finding.law} - ${finding.title}`,
    `Severity: ${finding.severity.toUpperCase()} (Line ${finding.line || '?'})`,
    `Problem: ${finding.message}`,
    `Remediation:`,
    `  ${finding.remediation}`,
  ];

  if (finding.snippet) {
    lines.push(`Target:`);
    lines.push(`  ${finding.snippet.trim().slice(0, 200)}`);
  }

  return lines.join('\n');
}

/**
 * Universal markup scanner executing all cognitive UX law audits.
 *
 * @param {string} html
 * @param {Object} [options={}]
 * @returns {Object} Complete UX scan report
 */
export function scanMarkup(html, options = {}) {
  const hicks = auditHicksLaw(html, options);
  const fitts = auditFittssLaw(html, options);
  const millers = auditMillersLaw(html, options);

  const findings = [...hicks, ...fitts, ...millers];
  const { score, rating } = calculateFrictionIndex(findings);

  const errors = findings.filter((f) => f.severity === 'error').length;
  const warnings = findings.filter((f) => f.severity === 'warning').length;

  return {
    score,
    rating,
    summary: {
      totalFindings: findings.length,
      errors,
      warnings,
      hicksViolations: hicks.length,
      fittsViolations: fitts.length,
      millersViolations: millers.length,
    },
    findings,
  };
}
