> **Additional context needed**: existing brand colors.

Introduce color as hierarchy, meaning, and atmosphere. Preserve confirmed brand and semantic conventions; do not replace a visual world under the guise of colorizing it.

---

## Visitor mode

- **Persuade + Experience:** color may carry the voice and own large regions when the selected world calls for it.
- **Operate + Read:** color primarily encodes action, selection, status, wayfinding, and reading hierarchy. Rarity gives an accent force.

## Audit before choosing

Read DESIGN.md, tokens, assets, current themes, and representative states. Identify:

- which colors are confirmed brand commitments;
- current surface, text, action, and semantic roles;
- places where grayscale obscures hierarchy or state;
- contrast failures and color-only communication;
- light/dark or data-visualization requirements;
- whether the task asks for more color or a new identity.

If a new identity is required, use [new-work.md](new-work.md). Ask only when a binding brand decision cannot be inferred.

## Choose a strategy

Name the intended emotional temperature, dominant relationship, contrast range, and color dosage before editing. The strategy may be restrained or immersive; it must follow the brief and selected world rather than a fixed percentage rule.

Build roles, not a bag of swatches:

- canvas and elevated surfaces;
- primary and secondary text;
- action, focus, and selection;
- borders and separators;
- success, warning, error, and information;
- data categories or scales when needed.

Use the project's existing color space. For a new web palette, prefer OKLCH because lightness and chroma can be adjusted predictably. Choose hue from product meaning and visual direction, never from a default category association.

## Perceptual OKLCH Token Architecture

OKLCH models human perceptual lightness ($L$), chroma ($C$), and hue ($h$). Unlike HSL or sRGB, identical lightness in OKLCH guarantees consistent perceived luminance across all hues.

### 9-Step Luminance Scale

Every primary color family must follow a calibrated 9-step luminance ramp:

| Step | Target $L$ | Nominal $C$ | Semantic Usage |
|---|---|---|---|
| **50** | 0.97 | 0.02 | Subtlest tint, background pill fill |
| **100** | 0.93 | 0.04 | Highlight surface, selected row hover |
| **200** | 0.86 | 0.07 | Soft badge fill, secondary interactive surface |
| **300** | 0.77 | 0.11 | Focus ring glow, subtle border accent |
| **400** | 0.67 | 0.15 | Vibrant decorative accent, dark mode icon |
| **500** | 0.56 | 0.18 | Core brand anchor, primary action fill |
| **600** | 0.46 | 0.17 | Hover state on light mode, active badge |
| **700** | 0.37 | 0.14 | High-contrast text on light tint, dark mode surface |
| **800** | 0.28 | 0.10 | Deep container surface, dark mode panel |
| **900** | 0.19 | 0.06 | Dark mode base surface |
| **950** | 0.13 | 0.03 | Extreme contrast dark canvas anchor |

### Semantic Token Roles

```css
:root {
  --canvas: oklch(0.985 0.012 var(--brand-hue));
  --surface: oklch(0.965 0.012 var(--brand-hue));
  --border: oklch(0.880 0.012 var(--brand-hue));
  --text-primary: oklch(0.180 0.015 var(--brand-hue));
  --text-muted: oklch(0.460 0.015 var(--brand-hue));
  --primary: var(--color-primary-500);
  --primary-hover: var(--color-primary-600);
}

[data-theme="dark"] {
  --canvas: oklch(0.140 0.012 var(--brand-hue));
  --surface: oklch(0.180 0.012 var(--brand-hue));
  --border: oklch(0.280 0.012 var(--brand-hue));
  --text-primary: oklch(0.960 0.015 var(--brand-hue));
  --text-muted: oklch(0.680 0.015 var(--brand-hue));
  --primary: var(--color-primary-400);
  --primary-hover: var(--color-primary-300);
}
```

## Hue-Tinted Neutral Standards (Eliminating AI Grays)

Generic AI-generated interfaces uniformly rely on flat, dead, washed-out grays (`#888888`, `#71717a`, `#18181b` with zero chroma). This produces cold, lifeless screens.

### Mandatory Neutral Rules

1. **Subtle Hue Chroma ($C \approx 0.010 - 0.015$):** All surface, canvas, border, and secondary text neutrals must carry subtle chroma derived from the primary brand hue.
2. **Warm Brands (Hue 30°–80°):** Neutrals shift gently toward warm slate, stone, and rich parchment.
3. **Cool Brands (Hue 200°–270°):** Neutrals shift gently toward deep obsidian, frost, and twilight zinc.
4. **Guaranteed Contrast:** Every hue-derived neutral pair (`--text-primary` on `--canvas`, `--text-muted` on `--surface`) must be verified to guarantee minimum 4.5:1 WCAG AA contrast. Never sacrifice readability for tint intensity.

## Strict Anti-Slop Gradient & Button Rule

- **Ban Unearned Linear Gradients:** Never apply generic purple-to-blue linear gradients (`linear-gradient(135deg, #6366f1, #a855f7)`) on primary action buttons, container borders, or hero heading text.
- **Earned Lighting:** Gradients are only permitted when modeling physical light sources (e.g. top-edge specular highlight or soft inner shadow).
- **Solid High-Contrast Actions:** Primary buttons should use deliberate solid fills with crisp contrast and tactile state transitions, not floating fuzzy gradients.

## CLI Color Tooling

Use `scripts/color-cli.mjs` for mechanical verification and generation during development:

```bash
# Contrast audit between any two hex, rgb, or oklch colors (WCAG 2.2 AA/AAA + APCA)
node scripts/color-cli.mjs --contrast "#ffffff" "#18181b"

# Generate 9-step OKLCH ramp and harmonic accents for a brand hue
node scripts/color-cli.mjs --palette --hue 250 --scheme complementary

# Emit copy-paste CSS custom properties with guaranteed contrast
node scripts/color-cli.mjs --css --hue 250 --theme both
```

## Apply at system scale

- Let the strongest color own a deliberate region or role instead of scattering tiny accents.
- Keep the primary action easy to find; do not spend its color on decoration.
- Tint neutrals only when the brand hue genuinely creates cohesion. Neutral gray is valid when it serves the world.
- On colored surfaces, derive secondary text from the foreground or surface hue rather than using washed-out generic gray.
- Keep semantic meanings consistent, but respect platform and domain conventions instead of assuming fixed hues.
- For data, use distinct lightness, chroma, shape, label, or pattern so color is not the only code.
- In dark mode, design surface elevation and contrast explicitly; do not invert the light theme mechanically.
- Define primitive values and semantic tokens when the project has a token system. Theme changes should normally remap semantic roles.

Decoration without a relationship to hierarchy, state, content, or the visual world is not a color strategy.

## Contrast and perception

Verify computed foreground/background pairs:

| Content | WCAG AA minimum | APCA minimum ($L_c$) |
|---|---|---|
| body text | 4.5:1 | $|L_c| \ge 60$ |
| large text (>= 24px or 18.5px bold) | 3:1 | $|L_c| \ge 45$ |
| controls, icons, focus indicators | 3:1 | $|L_c| \ge 30$ |

Do not rely on eyesight alone. Check interactive states, overlays, text on images, disabled content, and both themes. Simulate common vision deficiencies. Information conveyed by color also needs text, shape, iconography, or position.

When deriving OKLCH ramps, vary lightness and reduce chroma near white and black. Do not keep high chroma at extreme lightness merely to make the math uniform. Prefer explicit colors over chains of translucent overlays when alpha would make contrast context-dependent.

## Verify

- Every color has a stable role or a world-specific atmospheric purpose.
- Attention lands on the intended action, content, or state.
- The palette works across quiet, dense, interactive, error, and empty states.
- Light and dark themes are each composed, not mechanically inverted.
- Contrast and non-color cues pass in all relevant states.
- The result is recognizably this product, not a generic “colorful” treatment.

When the palette earns its place, hand off to `/impeccable polish` for the final pass.

## Live-mode signature params

When invoked from live mode, every variant declares a `color-amount` parameter. Author CSS against `var(--p-color-amount, 0.5)` so the user can move from neutral to the variant's full color strategy without regeneration.

```json
{"id":"color-amount","kind":"range","min":0,"max":1,"step":0.05,"default":0.5,"label":"Color amount"}
```

Add at most two variant-specific parameters, such as palette, temperature, or tint behavior. Follow [live.md](live.md)'s parameter contract.
