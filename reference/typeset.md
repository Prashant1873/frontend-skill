Typography carries information, hierarchy, and voice. Improve it inside the established visual world; do not replace the identity unless the user asked to.

---

## Visitor mode

- **Persuade + Experience:** display type may carry the voice. Use decisive contrast and responsive scale when the composition benefits.
- **Operate + Read:** stability, scanability, and measure come first. A single well-tuned family and fixed role scale are often right.
- **Native:** follow [ios.md](ios.md) or [android.md](android.md), including platform scaling and accessibility behavior.

If typography replacement would create a new identity, route through [new-work.md](new-work.md) and update DESIGN.md. Otherwise preserve confirmed families and improve their use.

## Two isolated assessments

When a sub-agent tool is available and permitted, run these independently; otherwise run them yourself in this order. Do not let detector findings anchor the design assessment.

1. **Typographic assessment:** inspect representative pages and styles. Answer every question below with a file, selector, or computed value:
   - **Authority and fit:** Which faces, weights, and roles are established? Do they fit the product and selected world, or are they unexamined defaults? Is every family necessary?
   - **Hierarchy:** Can heading, body, label, metadata, and data roles be distinguished at a glance? Are adjacent sizes or weights too close to carry different jobs?
   - **Scale and consistency:** Is there a deliberate role scale, or a collection of arbitrary values? Do repeated roles stay identical across screens and states?
   - **Reading:** Does body copy stay within a comfortable 45–75 character measure? Are line height, paragraph rhythm, contrast, and tracking tuned to the actual face, width, language, and surface?
   - **Stress:** What happens with long headings, localization expansion, zoom, narrow containers, missing weights, and font fallback?
   - **Delivery:** Are only used assets loaded? Do fallback metrics, loading strategy, and variable-font settings avoid invisible text and disruptive reflow?
2. **Mechanical scan:** run:

```bash
node scripts/detect.mjs --json --scope type [target files or dirs]
```

Also inspect dynamic or arbitrary font values the detector cannot interpret. Synthesize both assessments before editing, noting what each caught alone. A clean scan is a floor, not proof of good typography.

## Curated Typography Archetypes

Never default to generic unexamined AI fonts (Inter, Roboto, Arial) for primary brand voice or headlines. Select intentional faces categorized by product archetype from `scripts/data/curated-fonts.json`:

1. **Modern SaaS & Tech Flagships:** `Plus Jakarta Sans`, `Geist`, `Söhne`, `Mona Sans`, `Figma Sans`, `General Sans`, `Instrument Sans`. *(Inter is strictly relegated to micro-labels & data tables; never as display voice).*
2. **Editorial, Literary & Luxury:** `PP Editorial New`, `Canela`, `Fraunces`, `Recoleta`, `The Seasons`, `Charter`, `Instrument Serif`.
3. **Product & Consumer Lifestyle:** `Circular`, `Airbnb Cereal`, `Shopify Sans`, `Poppins`, `Quicksand`, `Jost`, `DM Sans`, `Manrope`, `Work Sans`.
4. **Creative, Brutalist & Expressive Display:** `Space Grotesk`, `Cabinet Grotesk`, `PP Neue Montreal`, `Agrandir Grand`, `Everett`, `Horizon`, `Shrikhand`, `Basis Grotesque`.
5. **Swiss International & Enterprise Authority:** `Neue Haas Grotesk`, `Suisse Int'l`, `Aperçu`, `Graphik`, `Maison Neue`, `IBM Plex Sans`, `Public Sans`, `Source Sans 3`.

To inspect the full catalog or retrieve paired stacks with copy-paste CSS:
```bash
node scripts/font-match.mjs --list-curated
node scripts/font-match.mjs --pair "PP Editorial New"
```

## Pairing Heuristics & Rules

- **Maximum 2 Families:** Limit every interface to at most two distinct font families (Display/Headline + Workhorse Body).
- **No Same-Category Clashes:** Never pair two similar geometric sans faces (e.g. Poppins + Proxima Nova). Pair high-contrast display with neutral workhorse (e.g. Editorial Serif + Modern SaaS Sans, or Expressive Display + Swiss Sans).
- **Zero-CLS Metric Fallbacks:** Always declare `@font-face` metric overrides on local fallback fonts to eliminate Cumulative Layout Shift:

```css
@font-face {
  font-family: 'Plus Jakarta Sans Fallback';
  src: local('Arial');
  size-adjust: 102%;
  ascent-override: 98%;
  descent-override: 26%;
  line-gap-override: 0%;
}

:root {
  --font-heading: 'Plus Jakarta Sans', 'Plus Jakarta Sans Fallback', system-ui, sans-serif;
}
```

## Set the system

Before editing, state:

- the roles the interface needs;
- the intended contrast between those roles;
- the reading measure and density;
- which existing faces and weights are authoritative;
- any performance, localization, or accessibility constraints.

Use the fewest roles and families that make the hierarchy unmistakable. Combine size, weight, space, and tone deliberately instead of asking size alone to do all the work. Role names and tokens should describe purpose rather than values.

## Apply

- Keep body copy comfortably readable and zoomable. Use 1rem / 16px as the ordinary web body floor unless a dense role, platform convention, or user setting justifies otherwise.
- Keep prose in the 45–75ch range. Tune line height inversely with measure: wider lines generally need more leading.
- Compensate light text on dark surfaces on all three perceptual axes: slightly more line height, a touch more tracking, and one step more weight when the face needs it.
- Tune line height to the face, width, language, and contrast, not a universal ratio.
- Keep repeated roles consistent across screens and states.
- Use numeric, tabular, code, and label features when their content benefits.
- Load only used font assets and weights. Provide metric-compatible fallbacks and avoid blocking text.
- Let marketing display type respond to available space when useful; keep dense product and reading surfaces spatially predictable.
- Preserve browser zoom, user font settings, Dynamic Type, and platform text scaling.
- Use paragraph spacing or first-line indentation as the primary paragraph rhythm; combining both usually double-marks the boundary.

Do not make type decorative at the expense of comprehension, or introduce a second family without a clear role it alone can perform.

## Verify

- Primary, secondary, body, and metadata roles are recognizable without reading the copy.
- Long text remains comfortable across relevant widths and languages.
- The typography belongs to the product and its established world.
- Loading does not create disruptive reflow or invisible text.
- Zoom, text scaling, focus, contrast, and reduced viewport paths remain usable.
- The final mechanical scan has no unexplained findings.

Answer each item with rendered or source evidence, then rerun the scan. Do not substitute a bare “yes” for verification.

When the hierarchy holds, hand off to `/impeccable polish`.

## Live-mode signature params

Every variant declares a coarse `scale` parameter and authors its type ramp against `var(--p-scale, 1)`.

```json
{"id":"scale","kind":"range","min":0.85,"max":1.3,"step":0.05,"default":1,"label":"Scale"}
```

Add at most one pairing or weight parameter when it represents a real system choice. Follow [live.md](live.md)'s parameter contract.
