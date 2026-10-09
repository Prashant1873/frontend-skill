/**
 * Natural Language Query Router & Green-Field Consent Classifier.
 * Inspects user conversational prompts to detect surgical intents or green-field creation requests.
 */

const SURGICAL_RULES = [
  {
    intent: 'buttons',
    playbook: 'reference/buttons.md',
    regex: /\b(buttons?|btn|squish|tactile|active state|click effect)\b/i,
  },
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
    intent: 'motion',
    playbook: 'reference/animate.md',
    regex: /\b(animat(e|ion)|motion|springs?|transitions?|gestures?)\b/i,
  },
  {
    intent: 'distill',
    playbook: 'reference/distill.md',
    regex: /\b(simplify|declutter|strip borders|reduce chrome|distill)\b/i,
  },
];

const GREEN_FIELD_REGEX = /\b(from scratch|new app|create (an? )?app|build (an? )?app|scaffold)\b/i;

/**
 * Classifies an incoming natural language prompt.
 *
 * @param {string} promptText
 * @returns {{
 *   intent: string,
 *   playbook: string | null,
 *   isGreenField: boolean,
 *   requiresConsent: boolean
 * }}
 */
export function classifyQuery(promptText) {
  if (!promptText || typeof promptText !== 'string') {
    return {
      intent: 'general',
      playbook: 'SKILL.md',
      isGreenField: false,
      requiresConsent: false,
    };
  }

  const clean = promptText.trim();

  // 1. Detect Green-Field Creation Queries
  if (GREEN_FIELD_REGEX.test(clean)) {
    return {
      intent: 'green-field',
      playbook: null,
      isGreenField: true,
      requiresConsent: true,
    };
  }

  // 2. Detect Surgical Sub-Playbook Intents
  for (const rule of SURGICAL_RULES) {
    if (rule.regex.test(clean)) {
      return {
        intent: rule.intent,
        playbook: rule.playbook,
        isGreenField: false,
        requiresConsent: false,
      };
    }
  }

  // 3. Fallback to General Frontend Skill
  return {
    intent: 'general',
    playbook: 'SKILL.md',
    isGreenField: false,
    requiresConsent: false,
  };
}
