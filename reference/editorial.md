# Human Editorial Architecture: Anti-Eyebrow & Anti-Pill Playbook

> A discipline playbook for eliminating generic AI pill badges and kicker tags in favor of asymmetric editorial typographic balance, optical hierarchy, and architectural section dividers.

---

## 1. The Anti-Pill & Anti-Eyebrow Craft Invariant

AI code generators possess an overwhelming tendency to drop a generic rounded pill badge above every primary headline:
```html
<!-- BAN THIS SLOP: Generic AI Floating Pill Badge -->
<div class="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
  ✨ Introducing Version 2.0
</div>
<h1 class="text-5xl font-bold">The Next Generation Platform</h1>
```

### 🚨 Strict NO List: Monochromatic Tinted Pill Badges (MAX AI Slop)
Never produce capsules combining rounded corners (`rounded-full`, `border-radius: 9999px`) with a light or faint tinted background, darker border, and matching text/icon of the exact same color family:
- ❌ `bg-blue-50 border-blue-200 text-blue-700 rounded-full` (Cookie-cutter light mode slop)
- ❌ `bg-blue-950/40 border-blue-500/30 text-blue-400 rounded-full` (The ubiquitous dark-mode "🔒 Dedicated" pill cliché)
- ❌ `bg-purple-100 border-purple-300 text-purple-800 rounded-full`
- ❌ `bg-emerald-50 border-emerald-200 text-emerald-800 rounded-full`

**Why It Fails:** Monochromatic tinting destroys visual sharpness, feels like an uninspired template, and instantly signals AI boilerplate.

### Strict Craft Invariants:
1. **Strictly Ban Monochromatic Same-Color Pills**: No capsule where bg, border, and text share the same chromatic family.
2. **Never Float Pills Above Headings**: Banned are `.pill`, `.badge`, `.tag`, or `border-radius: 9999px` containers positioned directly above an `<h1>` or `<h2>`.
3. **Never Use Cliché Kicker Vocabulary**: Prohibit generic uppercase strings like `"NEW"`, `"FEATURE"`, `"INTRODUCING"`, `"WELCOME"`, or `"AI-POWERED"`.
4. **No Decorative Border Capsules**: Typography and optical space must communicate hierarchy. Do not encapsulate section labels in border chrome.
5. **Contrast Compliance**: All metadata and kicker labels must strictly achieve WCAG 2.2 AA (≥ 4.5:1) against their backing surface.

---

## 2. Asymmetric Editorial Hierarchy

True editorial typography (as seen in *The New York Times*, *Bloomberg*, *Wired*, and *Stripe Press*) balances weight, scale, and negative space rather than packaging words in colored chips.

### Core Metrics & Ratios:
- **Scale Contrast (≥ 3:1)**: Pair display headlines at `clamp(2.75rem, 6vw, 5rem)` with lead copy at `clamp(1.125rem, 2vw, 1.35rem)`.
- **Optical Tightening**: Display headlines require tight letter-spacing (`-0.03em` to `-0.04em`) and compact line-height (`1.0` to `1.08`) so they read as a singular sculptured block.
- **Negative Space Breathing**: Provide generous vertical clearance (`2rem` to `3.5rem`) between headline clusters and following content.
- **Weight Contrast**: Juxtapose heavy display faces (weights `700`–`800`) with refined neutral lead body copy (`400`).

---

## 3. Innovative Pills & Architectural Block Alternatives

Instead of cookie-cutter monochromatic pills, deploy these human-crafted architectural primitives:

### Pattern A: Split-Chamber Architectural Badge
A two-cell neutral capsule where an elevated dark/light neutral inset houses the icon with a vertical hairline divider, paired with crisp neutral typography:

```html
<div class="split-chamber-badge">
  <span class="chamber-icon">
    <!-- Sharp SVG icon, NOT raw emoji -->
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  </span>
  <span class="chamber-label">Dedicated Hardware</span>
</div>
```
```css
.split-chamber-badge {
  display: inline-flex;
  align-items: center;
  background-color: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 9999px;
  padding: 2px;
  font-size: 0.75rem;
  color: var(--text-primary);
}
.chamber-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  background-color: oklch(1 0 0 / 0.08);
  color: var(--amber);
  margin-right: 6px;
}
.chamber-label {
  padding-right: 10px;
  font-weight: 500;
  letter-spacing: 0.02em;
}
```

### Pattern B: Inset Tactile Micro-Block
A subtle 4px/6px chamfered geometric block grounded in canvas/surface neutrals with a solitary luminous gemstone indicator dot:

```html
<div class="tactile-micro-block">
  <span class="gem-dot"></span>
  <span class="block-text">Production Cluster</span>
</div>
```
```css
.tactile-micro-block {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.8125rem;
  color: var(--text-primary);
}
.gem-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--teal);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Pattern C: Specular Hairline Glass Pill
Translucent neutral frosted glass bound by an ultra-fine 1px specular luminous rim with clean neutral typography:

```html
<div class="specular-glass-pill">
  <span>Architecture [01]</span>
</div>
```
```css
.specular-glass-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 9999px;
  background: oklch(1 0 0 / 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid oklch(1 0 0 / 0.15);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--text-primary);
}
```

### Pattern D: Asymmetric Editorial Index Marker
Pure typographic hierarchy using inline monospace indexes or category kickers framed by a 24px horizontal hairline divider:

```html
<div class="editorial-marker">
  <span class="marker-index">[ 01 ]</span>
  <span class="marker-rule"></span>
  <span class="marker-title">SYSTEMS HERITAGE</span>
</div>
```
```css
.editorial-marker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}
.marker-rule {
  width: 24px;
  height: 1px;
  background-color: var(--border);
}
```

---

## 4. Human Editorial Layout Architecture

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

## 5. Before-and-After Transformations

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
