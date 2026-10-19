/**
 * Natural Language Query Router & Green-Field Consent Classifier (Router 2.0).
 * Inspects user conversational prompts to detect surgical sub-playbook intents,
 * explicit `frontend <subcommand>` triggers, or green-field creation requests.
 */

export const EXPLICIT_COMMAND_MAP = Object.freeze({
  // ── Primary 18 High-Frequency Commands ──
  design: { intent: 'design', playbook: 'reference/new-work.md', domain: 'aesthetic' },
  polish: { intent: 'polish', playbook: 'reference/polish.md', domain: 'craft' },
  critique: { intent: 'critique', playbook: 'reference/critique.md', domain: 'review' },
  audit: { intent: 'audit', playbook: 'reference/audit.md', domain: 'technical' },
  clarify: { intent: 'clarify', playbook: 'reference/clarify.md', domain: 'ux-copy' },
  distill: { intent: 'distill', playbook: 'reference/distill.md', domain: 'simplicity' },
  bolder: { intent: 'bolder', playbook: 'reference/bolder.md', domain: 'styling' },
  quieter: { intent: 'quieter', playbook: 'reference/quieter.md', domain: 'styling' },
  harden: { intent: 'harden', playbook: 'reference/harden.md', domain: 'resilience' },
  engineer: { intent: 'engineer', playbook: 'reference/craft-floor.md', domain: 'component' },
  apple: { intent: 'apple', playbook: 'reference/animate.md', domain: 'motion' },
  ux: { intent: 'ux', playbook: 'reference/craft-floor.md', domain: 'ergonomics' },
  adapt: { intent: 'adapt', playbook: 'reference/adapt.md', domain: 'responsive' },
  delight: { intent: 'delight', playbook: 'reference/delight.md', domain: 'micro-ux' },
  visualize: { intent: 'visualize', playbook: 'reference/visualize.md', domain: 'data' },
  tokens: { intent: 'tokens', playbook: 'reference/craft-floor.md', domain: 'compiler' },
  prototype: { intent: 'prototype', playbook: 'PICKER.md', domain: 'prototyping' },
  doctor: { intent: 'doctor', playbook: 'reference/doctor.md', domain: 'health' },

  // ── Specialized Domain Commands ──
  buttons: { intent: 'buttons', playbook: 'reference/buttons.md', domain: 'craft' },
  editorial: { intent: 'editorial', playbook: 'reference/editorial.md', domain: 'aesthetic' },
  bento: { intent: 'bento', playbook: 'reference/bento.md', domain: 'aesthetic' },
  colorize: { intent: 'colors', playbook: 'reference/colorize.md', domain: 'aesthetic' },
  typeset: { intent: 'typography', playbook: 'reference/typeset.md', domain: 'aesthetic' },
  shape: { intent: 'shape', playbook: 'reference/shape.md', domain: 'aesthetic' },
  overdrive: { intent: 'overdrive', playbook: 'reference/overdrive.md', domain: 'aesthetic' },
  ios: { intent: 'ios', playbook: 'reference/ios.md', domain: 'platform' },
  android: { intent: 'android', playbook: 'reference/android.md', domain: 'platform' },
  operate: { intent: 'operate', playbook: 'reference/operate.md', domain: 'density' },
  extract: { intent: 'extract', playbook: 'reference/extract.md', domain: 'system' },
  document: { intent: 'document', playbook: 'reference/document.md', domain: 'system' },
  onboard: { intent: 'onboard', playbook: 'reference/onboard.md', domain: 'system' },
  sandbox: { intent: 'sandbox', playbook: 'reference/craft-floor.md', domain: 'system' },
  'pick-lib': { intent: 'pick-lib', playbook: 'PICKER.md', domain: 'system' },
  help: { intent: 'help', playbook: 'reference/router.md', domain: 'discovery' },
  new: { intent: 'design', playbook: 'reference/new-work.md', domain: 'aesthetic' },
  scaffold: { intent: 'design', playbook: 'reference/new-work.md', domain: 'aesthetic' },
  platform: { intent: 'design', playbook: 'reference/new-work.md', domain: 'aesthetic' },
  report: { intent: 'report', playbook: 'reference/report.md', domain: 'verification' },
  test: { intent: 'report', playbook: 'reference/report.md', domain: 'verification' },
  'test-all': { intent: 'report', playbook: 'reference/report.md', domain: 'verification' },
  'test-report': { intent: 'report', playbook: 'reference/report.md', domain: 'verification' },
  eval: { intent: 'report', playbook: 'reference/report.md', domain: 'verification' },
});

export const SURGICAL_RULES = [
  // 0. Discovery & Help (Requires command/catalog intent; avoids matching 'help me ...')
  {
    intent: 'help',
    playbook: 'reference/router.md',
    regex: /\b(help menu|help catalog|command list|list commands?|available (commands?|skills?|sub-?skills?)|what (commands|can you do)|show help)\b|^help$/i,
  },

  // 1. Diagnostics, Verification & Health
  {
    intent: 'report',
    playbook: 'reference/report.md',
    regex: /\b(run all tests|test report|full test|run every test|all tests possible|audit and critique report|generate (a )?report|verification report|test and audit|comprehensive test)\b/i,
  },
  {
    intent: 'doctor',
    playbook: 'reference/doctor.md',
    regex: /\b(doctor|staleness|health scan|drift check)\b/i,
  },
  {
    intent: 'audit',
    playbook: 'reference/audit.md',
    regex: /\b(technical audit|wcag (audit|compliance)|a11y audit|accessibility audit|audit (page|ui|app|code))\b/i,
  },
  {
    intent: 'ux',
    playbook: 'reference/craft-floor.md',
    regex: /\b(ux scan|hick'?s law|fitts'?s law|miller'?s law|cognitive friction|cfi score)\b/i,
  },
  {
    intent: 'critique',
    playbook: 'reference/critique.md',
    regex: /\b(critique|review design|heuristic evaluation|visual audit)\b/i,
  },

  // 2. Simplification & Styling Modifiers (Action Verbs take priority)
  {
    intent: 'distill',
    playbook: 'reference/distill.md',
    regex: /\b(simplify|declutter|strip (nested )?cards?|strip borders?|reduce chrome|distill)\b/i,
  },
  {
    intent: 'bolder',
    playbook: 'reference/bolder.md',
    regex: /\b(bolder|more punch|visual punch|punchy|more contrast|louder)\b/i,
  },
  {
    intent: 'quieter',
    playbook: 'reference/quieter.md',
    regex: /\b(quieter|tone down|subtler|less contrast|calm(er)?|soften)\b/i,
  },
  {
    intent: 'clarify',
    playbook: 'reference/clarify.md',
    regex: /\b(clarify|ux copy|microcopy|sharpen copy|error messages?|empty states?)\b/i,
  },
  {
    intent: 'harden',
    playbook: 'reference/harden.md',
    regex: /\b(harden|edge cases?|long strings?|keyboard traps?|overflow resilience)\b/i,
  },

  // 3. Responsive & Native Platforms
  {
    intent: 'adapt',
    playbook: 'reference/adapt.md',
    regex: /\b(adapt|responsiv(e|ity)|mobile layout|container queries|fluid viewport|small screens?|breakpoints?)\b/i,
  },
  {
    intent: 'ios',
    playbook: 'reference/ios.md',
    regex: /\b(ios|apple hig|sf pro|safe area|bottom sheets?)\b/i,
  },
  {
    intent: 'android',
    playbook: 'reference/android.md',
    regex: /\b(android|material you|material 3|system bars?)\b/i,
  },

  // 4. Data & High Density
  {
    intent: 'visualize',
    playbook: 'reference/visualize.md',
    regex: /\b(visualiz(e|ation)|charts?|data visualization|sparklines?|metrics grid|(?:metrics|analytics)\s+dashboards?)\b/i,
  },
  {
    intent: 'operate',
    playbook: 'reference/operate.md',
    regex: /\b(cockpit|dev tools?|dense UI|high density|dense dashboard)\b/i,
  },

  // 5. System, Documentation, Ingestion & Tokens
  {
    intent: 'document',
    playbook: 'reference/document.md',
    regex: /\b(document(ing)?|design system docs?|generate design\.md|style guide)\b/i,
  },
  {
    intent: 'extract',
    playbook: 'reference/extract.md',
    regex: /\b(extract (tokens?|colors?|fonts?|styles?)|harvest tokens?)\b/i,
  },
  {
    intent: 'tokens',
    playbook: 'reference/craft-floor.md',
    regex: /\b(compile tokens?|token dictionary|export tokens?|tailwind v[34]|dtcg|token compiler)\b/i,
  },
  {
    intent: 'onboard',
    playbook: 'reference/onboard.md',
    regex: /\b(onboard(ing)?|bootstrap design system)\b/i,
  },
  {
    intent: 'prototype',
    playbook: 'PICKER.md',
    regex: /\b(prototypes?|picker|variant switcher|multi-variant)\b/i,
  },

  // 6. Micro-Interactions, Motion & Delight
  {
    intent: 'delight',
    playbook: 'reference/delight.md',
    regex: /\b(delight|micro-?interactions?|haptics?|celebrat(e|ion)|confetti|easter eggs?)\b/i,
  },
  {
    intent: 'apple',
    playbook: 'reference/animate.md',
    regex: /\b(apple motion|wwdc|interruptible springs?|fluid motion|1:1 pointer|velocity projection)\b/i,
  },
  {
    intent: 'motion',
    playbook: 'reference/animate.md',
    regex: /\b(animat(e|ion)|motion|springs?|transitions?|gestures?|segmented|tabs?|stretch-and-squish|viscoelastic|rubber-band|poisson)\b/i,
  },
  {
    intent: 'buttons',
    playbook: 'reference/buttons.md',
    regex: /\b(buttons?|btn|squish|tactile|active state|click effect|concentric|optical|centering|icons? alignment|switches?|toggles?)\b/i,
  },

  // 7. Styling & Aesthetic Adjustments
  {
    intent: 'overdrive',
    playbook: 'reference/overdrive.md',
    regex: /\b(overdrive|experimental design|brutalist kinetic|hyper-variance)\b/i,
  },
  {
    intent: 'bolder',
    playbook: 'reference/bolder.md',
    regex: /\b(bolder|more punch|visual punch|punchy|more contrast|louder)\b/i,
  },
  {
    intent: 'quieter',
    playbook: 'reference/quieter.md',
    regex: /\b(quieter|tone down|subtler|less contrast|calm(er)?|soften)\b/i,
  },
  {
    intent: 'distill',
    playbook: 'reference/distill.md',
    regex: /\b(simplify|declutter|strip (nested )?cards?|strip borders?|reduce chrome|distill)\b/i,
  },
  {
    intent: 'polish',
    playbook: 'reference/polish.md',
    regex: /\b(polish|sub-?pixel|spacing rhythm|alignment pass|visual finishing)\b/i,
  },

  // 8. Visual Details, Hierarchy & Layout
  {
    intent: 'editorial',
    playbook: 'reference/editorial.md',
    regex: /\b(eyebrows?|pills?|badges?|kickers?|editorial|headlines?)\b/i,
  },
  {
    intent: 'bento',
    playbook: 'reference/bento.md',
    regex: /\b(bento|grids?|columns?|3-card|asymmetric|cards? layout)\b/i,
  },
  {
    intent: 'colors',
    playbook: 'reference/colorize.md',
    regex: /\b(colors?|palettes?|contrast|oklch|themes?|dark mode)\b/i,
  },
  {
    intent: 'typography',
    playbook: 'reference/typeset.md',
    regex: /\b(fonts?|typography|typeset|type pairing|fallbacks?)\b/i,
  },
  {
    intent: 'shape',
    playbook: 'reference/shape.md',
    regex: /\b(geometric masks?|corner curvature|container silhouette|shapes?)\b/i,
  },
  {
    intent: 'engineer',
    playbook: 'reference/craft-floor.md',
    regex: /\b(engineer|component architecture|colocation|state tiering)\b/i,
  },
];

const GREEN_FIELD_REGEX = /\b(from scratch|new app|create (an? )?(?:app|platform|website|web app)|build (an? )?(?:app|platform|website|web app)|make (an? )?(?:app|platform|website|web app)|new platform|new design|scaffold)\b/i;

/**
 * Classifies an incoming natural language prompt or explicit command.
 *
 * @param {string} promptText
 * @returns {{
 *   intent: string,
 *   playbook: string | null,
 *   domain?: string,
 *   isGreenField: boolean,
 *   requiresConsent: boolean,
 *   autoEngageFullCraft?: boolean,
 *   isExplicit: boolean
 * }}
 */
export function classifyQuery(promptText) {
  if (!promptText || typeof promptText !== 'string') {
    return {
      intent: 'general',
      playbook: 'SKILL.md',
      isGreenField: false,
      requiresConsent: false,
      autoEngageFullCraft: false,
      isExplicit: false,
    };
  }

  const clean = promptText.trim();

  // 1. Detect Explicit `frontend <subcommand>` Syntax
  const explicitMatch = clean.match(/^frontend\s+([a-z0-9-]+)(?:\s+.*)?$/i);
  if (explicitMatch) {
    const cmd = explicitMatch[1].toLowerCase();
    const target = EXPLICIT_COMMAND_MAP[cmd];
    if (target) {
      return {
        intent: target.intent,
        playbook: target.playbook,
        domain: target.domain,
        isGreenField: false,
        requiresConsent: false,
        autoEngageFullCraft: false,
        isExplicit: true,
      };
    }
  }

  // 2. Detect Green-Field Creation Queries (Auto-Engage Full-Craft Engine)
  if (GREEN_FIELD_REGEX.test(clean)) {
    return {
      intent: 'design',
      playbook: 'reference/new-work.md',
      domain: 'aesthetic',
      isGreenField: true,
      requiresConsent: false,
      autoEngageFullCraft: true,
      isExplicit: false,
    };
  }

  // 3. Detect Surgical Sub-Playbook Intents (Prefix-Free Natural Language)
  for (const rule of SURGICAL_RULES) {
    if (rule.regex.test(clean)) {
      return {
        intent: rule.intent,
        playbook: rule.playbook,
        isGreenField: false,
        requiresConsent: false,
        isExplicit: false,
      };
    }
  }

  // 4. Fallback to General Frontend Skill
  return {
    intent: 'general',
    playbook: 'SKILL.md',
    isGreenField: false,
    requiresConsent: false,
    isExplicit: false,
  };
}

/**
 * Returns the catalog of all available sub-skill commands and clusters.
 *
 * @returns {{
 *   primary: Array<{ command: string, domain: string, playbook: string }>,
 *   clusters: Record<string, string[]>
 * }}
 */
export function getSubskillCatalog() {
  const primaryCommands = [
    'design', 'polish', 'critique', 'audit', 'clarify', 'distill',
    'bolder', 'quieter', 'harden', 'engineer', 'apple', 'ux',
    'adapt', 'delight', 'visualize', 'tokens', 'prototype', 'doctor',
  ];

  const primary = primaryCommands.map((cmd) => ({
    command: cmd,
    domain: EXPLICIT_COMMAND_MAP[cmd].domain,
    playbook: EXPLICIT_COMMAND_MAP[cmd].playbook,
  }));

  const clusters = {
    'Aesthetic & Editorial': ['overdrive', 'editorial', 'bento', 'colorize', 'typeset', 'shape'],
    'UX & Ergonomics': ['operate', 'clarify', 'harden', 'ux'],
    'Platform & Adaptation': ['adapt', 'ios', 'android'],
    'System & Tooling': ['tokens', 'extract', 'document', 'onboard', 'sandbox', 'pick-lib', 'doctor', 'report'],
  };

  return { primary, clusters };
}
