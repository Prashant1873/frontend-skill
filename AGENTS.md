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

### 🚀 Green-Field Full-Craft Auto-Activation (ROUTER-02)
When the prompt requests building or designing a new platform, app, dashboard, website, or screen from scratch (`from scratch`, `new platform`, `create platform`, `build platform`, `make a platform`, `new app`, `create app`, `build app`, `scaffold`, `new design`):
**IMMEDIATELY ENGAGE THE HUMAN-CRAFT UI ENGINE TO THE FULLEST.** Never stall with hesitation prompts or downgrade to generic vanilla slop. From the very first line of code, scaffold with:
1. **Curated Typography**: Select characterful typography (e.g. Geist, Plus Jakarta Sans, Space Grotesk, Mona Sans, Instrument Sans/Serif, Fraunces) with zero-CLS metric fallbacks. Monospace strictly reserved for tabular code/data.
2. **OKLCH Dual-Mode Parity**: Establish `:root` and `[data-theme="dark"]` tokens with physical lighting parity (diffuse directional shadows for light mode; stepped surface luminance $L \approx 0.13 \rightarrow 0.18 \rightarrow 0.24$ with hairline luminous borders for dark mode).
3. **Tactile Spring Physics**: Apply Apple fluid physics (`cubic-bezier(0.32, 0.72, 0, 1)`, tactile squish, scale down on `:active`, rubber-banding). Never linear or `transition: all 0.3s ease`.
4. **Asymmetric Editorial & Bento Grids**: Break cookie-cutter 3-column cards with visual anchors, asymmetric spans, and clean negative space.
5. **Zero Emojis in UI**: Never use raw emojis for icons, badges, buttons, or graphics. Always embed sharp SVG icons (Lucide, Radix, Phosphor, Heroicons).
6. **Mandatory Production Favicon**: Always include `<link rel="icon" type="image/svg+xml" href="...">` matching product branding.
7. **Anti-Slop Craft Floor**: No nested border cards, no floating purple-blue gradients, 44px touch targets, `:focus-visible` accessible rings, 400ms Doherty responsiveness.

---

## 🛑 Strict Anti-Slop Design Invariants

Never produce generic "AI Slop" defaults:
1. **No Generic Font Defaults**: Do NOT blindly default to Inter or Roboto unless explicitly commanded. Choose intentional, characterful typography tailored to product mood (e.g. Plus Jakarta Sans, Outfit, Space Grotesk, Instrument Serif, Syne).
2. **No Unearned Floating Gradients**: Ban generic purple-to-blue linear gradients on primary buttons and container borders.
3. **No Nested Border Chrome**: Eliminate border cards inside border cards. Use subtle surface depth, background tint differences, or generous negative space instead.
4. **No Linear Motion**: Never use `transition: all 0.3s ease` or linear timing functions. Always apply Apple fluid spring physics (`reference/animate.md`).
5. **No Broken Contrast or Unstyled Focus**: Maintain WCAG 2.2 AA contrast ratios and distinct, accessible keyboard focus rings (`:focus-visible`).
6. **No Unilateral Single-Mode Bias**: Never design exclusively for dark or light mode while neglecting the other. Light mode requires diffuse directional shadows (`box-shadow`), while dark mode requires surface luminance stepping and luminous hairline borders (shadows are invisible on dark). Every deliverable must establish both `:root` and `[data-theme="dark"]` token parity with WCAG 2.2 AA contrast verified in both states (`reference/colorize.md`).
7. **No Emojis in UI**: Never use raw emojis (🚀, 💡, 🔥, ✨, 📈, etc.) as icons, button labels, badge markers, or feature card graphics. Emojis render inconsistently across operating systems, break professional aesthetic tone, and signal generic AI slop. Always use dedicated, resolution-independent SVG icons (e.g. Lucide, Radix, Heroicons, Phosphor).
8. **Always Include Favicons**: Every web deliverable, page, or application scaffold must declare a dedicated favicon (`<link rel="icon" type="image/svg+xml" href="...">` or data URI SVG/PNG) matching the product identity. A missing favicon (`404 /favicon.ico` or default browser globe placeholder) indicates an incomplete, unpolished deliverable.
9. **No Monochromatic Pill Slop (MAX AI Slop)**: Strictly ban capsules with rounded corners (`rounded-full`, `border-radius: 9999px`) combining a faint tinted background, darker border, and matching text/icon of the exact same color family (e.g. `bg-blue-50 border-blue-200 text-blue-700` or dark-mode `bg-blue-950/40 border-blue-500/30 text-blue-400` "🔒 Dedicated" tags). Always replace with innovative architectural alternatives: split-chamber badges, tactile inset micro-blocks, specular hairline glass pills, or asymmetric editorial markers (`reference/editorial.md`).
10. **Distinctive Brand Palettes vs Generic AI Tropes**: Ban reflex generic electric blue headings (`text-blue-500`) and cyan-on-dark neon glow. Ground platforms in distinctive, whitelisted characterful palettes (amber, teal, turquoise, coral, pitch black, navy blue, velvet red, royal colors, chartreuse, ochre, espresso, mauve, slate copper) (`reference/colorize.md`).

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
