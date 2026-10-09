# Universal Agent Directives: Frontend Engineering & Design Taste

These instructions govern all AI coding agents (Google Antigravity, OpenAI Codex, OpenCode, Cursor, Claude Code) working in this repository.

## 🚨 Mandatory Frontend Skill Auto-Activation

Whenever the user's prompt involves any of the following:
- Web applications, landing pages, websites, or responsive screens
- UI components, widgets, modals, navigation bars, forms, or cards
- HTML, CSS, SCSS, JavaScript, TypeScript, JSX, TSX
- Frontend frameworks: React, Next.js, Vue, Nuxt, Svelte, SvelteKit, Astro, Solid
- Styling systems: Tailwind CSS, Vanilla CSS, CSS Modules, Styled Components
- UI animations, transitions, gestures, dark mode, or accessibility

**YOU MUST IMMEDIATELY ACTIVATE AND FOLLOW [`SKILL.md`](SKILL.md).**

---

## 🛑 Strict Anti-Slop Design Invariants

Never produce generic "AI Slop" defaults:
1. **No Generic Font Defaults**: Do NOT blindly default to Inter or Roboto unless explicitly commanded. Choose intentional, characterful typography tailored to product mood (e.g. Plus Jakarta Sans, Outfit, Space Grotesk, Instrument Serif, Syne).
2. **No Unearned Floating Gradients**: Ban generic purple-to-blue linear gradients on primary buttons and container borders.
3. **No Nested Border Chrome**: Eliminate border cards inside border cards. Use subtle surface depth, background tint differences, or generous negative space instead.
4. **No Linear Motion**: Never use `transition: all 0.3s ease` or linear timing functions. Always apply Apple fluid spring physics (`reference/animate.md`).
5. **No Broken Contrast or Unstyled Focus**: Maintain WCAG 2.2 AA contrast ratios and distinct, accessible keyboard focus rings (`:focus-visible`).

---

## 📋 Compulsory Execution Contract

Before completing any frontend deliverable:
1. **Establish Design Read & Dials**: Determine `DESIGN_VARIANCE`, `MOTION_INTENSITY`, and `VISUAL_DENSITY` per project intent.
2. **Apply Craft Floor Standards**: Verify layout against [`reference/craft-floor.md`](reference/craft-floor.md).
3. **Run Mechanical Slop Verification**: Execute the antipattern detector over changed targets:
   ```bash
   node scripts/detector/detect-antipatterns.mjs --target <changed files>
   ```
   Resolve all flagged antipatterns before reporting completion.
