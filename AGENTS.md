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

### 🎯 Surgical Intent Sub-Skill Routing (ROUTER-01)
When the user's prompt is surgical or focused, do NOT overhaul the entire project. Activate ONLY the targeted sub-module playbook per [`reference/router.md`](reference/router.md):
- Buttons & micro-interactions -> [`reference/buttons.md`](reference/buttons.md)
- Editorial headings & anti-pill -> [`reference/editorial.md`](reference/editorial.md)
- Bento & asymmetric grids -> [`reference/bento.md`](reference/bento.md)
- Color & contrast -> [`reference/colorize.md`](reference/colorize.md)
- Typography & pairings -> [`reference/typeset.md`](reference/typeset.md)
- Motion & spring physics -> [`reference/animate.md`](reference/animate.md)
- Simplification & chrome reduction -> [`reference/distill.md`](reference/distill.md)

### ✋ Green-Field Consent Protocol (ROUTER-02)
When the prompt requests building a new app or screen from scratch (`from scratch`, `new app`, `scaffold`), do NOT silently impose opinionated design architecture. Prompt the user for consent before scaffolding code:
> *"I can build this using the Human-Craft UI Engine (curated typography, OKLCH perceptual colors, tactile spring buttons, asymmetric editorial layouts). Would you like to proceed with this design system, or do you prefer minimal vanilla defaults?"*

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
