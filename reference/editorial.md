# Human Editorial Architecture: Anti-Eyebrow & Anti-Pill Playbook

> A discipline playbook for eliminating generic AI pill badges and kicker tags in favor of asymmetric editorial typographic balance, optical hierarchy, and architectural section dividers.

---

## 1. The Anti-Pill & Anti-Eyebrow Craft Invariant

AI code generators possess an overwhelming tendency to drop a rounded pill badge above every primary headline:
```html
<!-- BAN THIS SLOP: Generic AI Floating Pill Badge -->
<div class="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
  ✨ Introducing Version 2.0
</div>
<h1 class="text-5xl font-bold">The Next Generation Platform</h1>
```

### Strict Craft Invariants:
1. **Never Float Pills Above Headings**: Banned are `.pill`, `.badge`, `.tag`, or `border-radius: 9999px` containers positioned directly above an `<h1>` or `<h2>`.
2. **Never Use Cliché Kicker Vocabulary**: Prohibit generic uppercase strings like `"NEW"`, `"FEATURE"`, `"INTRODUCING"`, `"WELCOME"`, or `"AI-POWERED"`.
3. **No Decorative Border Capsules**: Typography and optical space must communicate hierarchy. Do not encapsulate section labels in border chrome.
4. **Contrast Compliance**: All metadata and kicker labels must strictly achieve WCAG 2.2 AA (≥ 4.5:1) against their backing surface.

---

## 2. Asymmetric Editorial Hierarchy

True editorial typography (as seen in *The New York Times*, *Bloomberg*, *Wired*, and *Stripe Press*) balances weight, scale, and negative space rather than packaging words in colored chips.

### Core Metrics & Ratios:
- **Scale Contrast (≥ 3:1)**: Pair display headlines at `clamp(2.75rem, 6vw, 5rem)` with lead copy at `clamp(1.125rem, 2vw, 1.35rem)`.
- **Optical Tightening**: Display headlines require tight letter-spacing (`-0.03em` to `-0.04em`) and compact line-height (`1.0` to `1.08`) so they read as a singular sculptured block.
- **Negative Space Breathing**: Provide generous vertical clearance (`2rem` to `3.5rem`) between headline clusters and following content.
- **Weight Contrast**: Juxtapose heavy display faces (weights `700`–`800`) with refined neutral lead body copy (`400`).

---

## 3. Human Replacement Patterns

Replace lazy floating pills with one of three human-crafted editorial primitives:

### Pattern A: Integrated Inline Meta Index
Integrate metadata directly into the typographic line using monospace or tabular numerals and subtle optical delimiters:

```html
<div class="editorial-header">
  <p class="editorial-meta">
    <span class="editorial-meta-index">01</span>
    <span class="editorial-meta-divider">/</span>
    <span class="editorial-meta-tag">Systems Architecture</span>
  </p>
  <h1 class="editorial-display">Autonomous Agent Infrastructure</h1>
  <p class="editorial-lead">Direct execution models with verified state boundaries.</p>
</div>
```

### Pattern B: Asymmetric Column Offset
Establish an asymmetrical multi-column grid where category and series metadata occupy a dedicated sidebar column while the headline commands the layout:

```html
<header class="editorial-asymmetric">
  <div class="editorial-kicker-col">
    <span class="editorial-kicker-text">Volume 04 · Research</span>
  </div>
  <div class="editorial-content-col">
    <h1 class="editorial-display">Perceptual Foundations</h1>
    <p class="editorial-lead">Why human editorial rhythm outclasses generic AI capsules.</p>
  </div>
</header>
```

### Pattern C: Architectural Hairline Divider
Frame section transitions with crisp 1px hairline rules and optical breathing room:

```html
<div class="editorial-divided">
  <div class="editorial-top-bar">
    <span class="editorial-section-id">Section 03</span>
    <span class="editorial-timestamp">October 2026</span>
  </div>
  <h2 class="editorial-section-title">Mechanical Slop Detection</h2>
  <div class="editorial-hairline"></div>
</div>
```

---

## 4. Before-and-After Transformations

### Transformation 1: Landing Page Hero
- **Before (AI Slop)**: Centered container with a pill chip reading `"🔥 PRODUCT LAUNCH"` above a generic sans-serif `<h1>`.
- **After (Human Craft)**: Left-aligned asymmetric layout with monospace series indicator (`// 01 ARCHITECTURE`), display title with `-0.035em` tracking, and an editorial lead paragraph.

### Transformation 2: Feature Section Header
- **Before (AI Slop)**: Floating rounded border card labeled `"POWERFUL TOOLS"` with purple gradient background.
- **After (Human Craft)**: Architectural top bar with 1px hairline border, subtle chapter indexing, and a clean section title.

---

## 5. Cross-Playbook References

- Typography pairings: [craft-floor.md](craft-floor.md)
- Micro-interactions and buttons: [buttons.md](buttons.md)
- Motion dynamics: [animate.md](animate.md)
