# Asymmetric Bento Grid Systems & Fluid Layout Playbook

> A discipline playbook for eliminating monotonous, uniform 3-card columns in favor of responsive, rhythmic Bento layouts, multi-span visual anchors, and layered surface depth.

---

## 1. The Anti-Uniform-Grid Craft Invariant

Generic AI web generation defaults to the predictable 3-card row:
```html
<!-- BAN THIS SLOP: Lifeless Uniform 3-Card Template -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="rounded-lg border p-6">Feature One</div>
  <div class="rounded-lg border p-6">Feature Two</div>
  <div class="rounded-lg border p-6">Feature Three</div>
</div>
```

### Strict Craft Invariants:
1. **Never Equalize Distinct Feature Weights**: Primary product capabilities must not share identical width and height with secondary stat counters or minor notes.
2. **Never Produce Card-in-Card Chrome**: Ban nesting border containers inside existing border cards. Differentiate sub-features using background tint shifts (`var(--surface-subtle)`) or negative space.
3. **Always Anchor With Asymmetric Rhythms**: Every feature section must provide at least one dominant anchor cell (spanning 2 columns or 2 rows).
4. **Mandatory Responsive Collapse**: Grids must never overflow horizontally on mobile screens or collapse into crushed, unreadable vertical slivers.

---

## 2. Core Bento Spatial Rhythms

Bento arrangements balance varied information compartments into a cohesive, structured canvas:

### The 2:1 Rhythm (Showcase + Stat Counter)
- **Primary Showcase (Span 2)**: Commands 66% of the row width; houses interactive previews, diagrams, or primary workflows.
- **Supporting Counter (Span 1)**: Commands 33% of the row width; displays monospaced metrics, status badges, or quick highlights.

### The 1:2 Rhythm (Narrative + Visual Proof)
- **Narrative Intro (Span 1)**: Editorial thesis with lead paragraph.
- **Visual Proof (Span 2)**: Interactive code sandbox or live interface snippet.

### The Anchor Hero (2 Cols × 2 Rows)
- **Anchor Cell**: `grid-column: span 2; grid-row: span 2;` — dominates visual weight and grounds the user's attention.
- **Satellite Cells**: Stacked single-unit cells (`span 1; row 1`) flanking the primary anchor.

---

## 3. Surface Architecture & Layered Depth

Instead of relying on harsh black borders or purple gradients, Bento cards utilize tactile surface layers:

```css
.bento-card {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.08));
  border-radius: var(--radius-lg, 16px);
  padding: clamp(1.25rem, 2.5vw, 2rem);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}

.bento-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px -4px rgba(0, 0, 0, 0.1), 0 2px 6px 0 rgba(0, 0, 0, 0.06);
}
```

---

## 4. Responsive Breakpoint Adaptation

Bento grids must adapt fluidly across three primary viewport tiers:

1. **Desktop Tier (≥ 1024px)**:
   - 3-column or 4-column tracks (`repeat(3, minmax(0, 1fr))`).
   - Active multi-column spans (`.bento-span-2`, `.bento-span-3`) and multi-row spans (`.bento-row-2`).
2. **Tablet Tier (768px – 1023px)**:
   - 2-column tracks (`repeat(2, minmax(0, 1fr))`).
   - `.bento-span-2` spans full width across both columns; `.bento-row-2` normalizes to auto height.
3. **Mobile Tier (< 768px)**:
   - 1-column vertical stream (`1fr`).
   - All spans normalize to single column with preserved touch margins.

---

## 5. Cross-Playbook References

- Micro-interactions and buttons: [buttons.md](buttons.md)
- Editorial typography and headings: [editorial.md](editorial.md)
- Craft floor standards: [craft-floor.md](craft-floor.md)
