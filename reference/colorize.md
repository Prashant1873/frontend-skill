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

### Dual-Mode Architecture: Light vs. Dark Mode Distinction

AI-generated interfaces habitually suffer from **unilateral single-mode bias** — either focusing purely on glowing dark mode (neglecting light mode or shipping it unstyled), or building light mode and applying a mechanical, muddy color inversion for dark mode. 

Light and dark modes operate under **diametrically opposed physical lighting models**:

| Architectural Dimension | ☀️ Light Mode (Pigment & Shadow) | 🌙 Dark Mode (Emissive & Luminance Stepping) |
|---|---|---|
| **Depth Engine** | Diffuse directional shadows (`box-shadow: 0 4px 16px oklch(0 0 0 / 0.06)`) + subtle borders. | **Luminance stepping**: cards step *up* in lightness ($L \approx 0.13 \rightarrow 0.18 \rightarrow 0.24$). Shadows are invisible on dark. |
| **Canvas Luminance** | Clean, warm-tinted paper ($L \approx 0.985, C \approx 0.010$). | Deep hue-tinted obsidian ($L \approx 0.130, C \approx 0.012$). Never flat pitch black (`#000000`). |
| **Card Surface** | Pure white or soft tint ($L \approx 0.965 - 1.000$). | Elevated tint ($L \approx 0.180 - 0.200$). |
| **Container Delimitation** | Soft borders or purely spatial shadow boundaries. | Hairline luminous borders (`1px solid oklch(1 0 0 / 0.08 - 0.12)`); prevents dark cards merging into background. |
| **Primary Actions** | Saturated, deeper pigment ($L \approx 0.450 - 0.550, C \approx 0.18$) for crisp text contrast. | Shifted *up* in lightness ($L \approx 0.650 - 0.720, C \approx 0.14$) with dark text, or solid $L \approx 0.55$ with white text. |
| **Text Glare Mitigation** | Deep tinted ink ($L \approx 0.160 - 0.190$). Avoid stark `#000000` text on pure white. | Softened luminous text ($L \approx 0.920 - 0.960$). Avoid blinding stark `#FFFFFF` glare on body passages. |

### Dual-Theme Token Recipe (Guaranteed Parity)

```css
:root {
  /* ☀️ Light Mode: Pigment & Soft Shadow Model */
  --canvas: oklch(0.985 0.010 var(--brand-hue));
  --surface: oklch(0.965 0.012 var(--brand-hue));
  --surface-elevated: oklch(1.000 0.000 0);
  --border: oklch(0.880 0.012 var(--brand-hue));
  --border-subtle: oklch(0.920 0.008 var(--brand-hue));
  
  --text-primary: oklch(0.180 0.015 var(--brand-hue));
  --text-secondary: oklch(0.380 0.015 var(--brand-hue));
  --text-muted: oklch(0.540 0.012 var(--brand-hue));
  
  --primary: oklch(0.520 0.180 var(--brand-hue));
  --primary-hover: oklch(0.460 0.180 var(--brand-hue));
  --primary-contrast: oklch(0.990 0.000 0);

  /* Shadows active in light mode */
  --shadow-sm: 0 1px 2px oklch(0.18 0.015 var(--brand-hue) / 0.05);
  --shadow-md: 0 4px 12px -1px oklch(0.18 0.015 var(--brand-hue) / 0.08);
  --shadow-lg: 0 12px 28px -4px oklch(0.18 0.015 var(--brand-hue) / 0.12);
}

[data-theme="dark"] {
  /* 🌙 Dark Mode: Luminance Stepping & Hairline Luminous Edge Model */
  --canvas: oklch(0.130 0.012 var(--brand-hue));
  --surface: oklch(0.180 0.014 var(--brand-hue));
  --surface-elevated: oklch(0.240 0.016 var(--brand-hue));
  --border: oklch(0.280 0.014 var(--brand-hue));
  --border-subtle: oklch(1.000 0.000 0 / 0.08); /* Hairline specular boundary */
  
  --text-primary: oklch(0.950 0.010 var(--brand-hue));
  --text-secondary: oklch(0.760 0.012 var(--brand-hue));
  --text-muted: oklch(0.600 0.012 var(--brand-hue));
  
  --primary: oklch(0.660 0.150 var(--brand-hue));
  --primary-hover: oklch(0.720 0.140 var(--brand-hue));
  --primary-contrast: oklch(0.140 0.015 var(--brand-hue));

  /* Shadows collapse; depth achieved via surface luminance */
  --shadow-sm: 0 0 0 1px var(--border-subtle);
  --shadow-md: 0 0 0 1px var(--border-subtle), 0 8px 24px -4px oklch(0 0 0 / 0.40);
  --shadow-lg: 0 0 0 1px var(--border-subtle), 0 16px 36px -6px oklch(0 0 0 / 0.60);
}
```

## Hue-Tinted Neutral Standards (Eliminating AI Grays)

Generic AI-generated interfaces uniformly rely on flat, dead, washed-out grays (`#888888`, `#71717a`, `#18181b` with zero chroma). This produces cold, lifeless screens.

### Mandatory Neutral Rules

1. **Subtle Hue Chroma ($C \approx 0.010 - 0.015$):** All surface, canvas, border, and secondary text neutrals must carry subtle chroma derived from the primary brand hue.
2. **Warm Brands (Hue 30°–80°):** Neutrals shift gently toward warm slate, stone, and rich parchment.
3. **Cool Brands (Hue 200°–270°):** Neutrals shift gently toward deep obsidian, frost, and twilight zinc.
4. **Guaranteed Contrast:** Every hue-derived neutral pair (`--text-primary` on `--canvas`, `--text-muted` on `--surface`) must be verified to guarantee minimum 4.5:1 WCAG AA contrast. Never sacrifice readability for tint intensity.

## Strict Anti-Slop Color Invariants

### 🚫 Generic AI Color Tropes (Flagged by Detector)
Never produce the telltale generic colors that AI models reflexively generate:
1. **Unearned Purple/Violet/Indigo Gradients:** `linear-gradient(135deg, #6366f1, #a855f7)`, `from-purple-500 to-indigo-500`, or `from-purple-600 to-blue-500` on buttons, cards, and borders.
2. **Generic Electric Blue & Cyan Pairs:** `from-blue-500 to-indigo-500`, `from-cyan-400 to-blue-600`, or `linear-gradient(..., #3b82f6, #8b5cf6)`.
3. **Electric Blue Headings:** Saturated generic blues (`text-blue-500`, `text-sky-400`, `#3b82f6`) floating without intentional brand identity.
4. **Unearned Cyan Glow on Dark:** High-chroma neon cyan (`#00f0ff`, `#06b6d4`) glowing indiscriminately over dark containers.

### 🛡️ Whitelisted Characterful Brand Palettes (Colors AI Rarely Picks)
Ground interfaces in characterful, distinctive palettes with authentic personality. The detector explicitly whitelists and rewards these intentional color choices:

| Palette Family | Key Tones & Hex | OKLCH Anchor | Aesthetic Voice & Best Fit |
|---|---|---|---|
| **Amber / Honey** | `#f59e0b`, `#d97706`, `#b45309` | `oklch(0.78 0.16 75)` | Warm golden marigold, tactile warmth. Editorial, artisanal fintech, modern commerce. |
| **Teal / Deep Spruce** | `#0d9488`, `#0f766e`, `#115e59` | `oklch(0.55 0.12 195)` | Calm botanical depth, organic architectural tone. Climate tech, healthcare, high-end editorial. |
| **Turquoise / Aegean** | `#14b8a6`, `#2dd4bf`, `#0891b2` | `oklch(0.72 0.13 180)` | Sunlit Mediterranean seafoam. Vibrant yet grounded. Maritime, lifestyle, creative studio. |
| **Coral / Terracotta** | `#f97316`, `#ea580c`, `#e11d48` | `oklch(0.68 0.18 35)` | Sun-baked earth, persimmon, living coral. Hardware, ceramics, culinary, architecture. |
| **Pitch Black / Obsidian** | `#000000`, `#050505`, `#08080a` | `oklch(0.12 0.008 240)` | High-contrast OLED depth with luminance stepping. Luxury goods, pro audio, developer tools. |
| **Navy Blue / Midnight** | `#0f172a`, `#172554`, `#1e3a8a` | `oklch(0.28 0.09 255)` | Deep nautical midnight. Authoritative, intellectual, architectural. Institutional finance, law, enterprise infra. |
| **Velvet Red / Burgundy** | `#4a0404`, `#7f1d1d`, `#881337` | `oklch(0.42 0.18 15)` | Luxurious crimson wine and dark velvet red. Deep pigment prestige. Wine & dining, haute horlogerie, culture. |
| **Royal Blue** | `#1d4ed8`, `#1e40af`, `#002366` | `oklch(0.48 0.22 265)` | Majestic, authoritative cobalt blue with rich pigment density. Aerospace, civic institutions, flagship enterprise. |
| **Imperial Plum** | `#581c87`, `#3b0764`, `#4a044e` | `oklch(0.35 0.16 320)` | Deep velvet wine plum. Majestic dignity distinct from generic neon violet. High fantasy, luxury gaming, heritage. |
| **Royal Emerald** | `#064e3b`, `#047857`, `#022c22` | `oklch(0.45 0.15 155)` | Deep imperial jewel green and forest jade. Legacy wealth management, botanical science, private banking. |
| **Chartreuse / Acid Lime** | `#84cc16`, `#a3e635`, `#65a30d` | `oklch(0.82 0.19 125)` | Avant-garde, electrifying wasabi/acid lime. Streetwear, music tech, experimental design studios. |
| **Ochre / Dijon Mustard** | `#ca8a04`, `#a16207`, `#854d0e` | `oklch(0.68 0.14 85)` | Earthy, artisanal French mustard and golden ochre. Publishing, museum catalogs, craft heritage. |
| **Espresso / Umber** | `#2d1f18`, `#382319`, `#422006` | `oklch(0.25 0.05 45)` | Roasted coffee, raw sepia, and warm umber darks. Leather craft, architecture, bespoke hospitality. |
| **Mauve / Dusty Rose** | `#9d7589`, `#835d72`, `#70485c` | `oklch(0.62 0.08 340)` | Understated thistle, muted heather, and dusty rose quartz. Calm tech, skincare, literary journals. |
| **Slate Copper / Patina** | `#b45309`, `#9a3412`, `#7c2d12` | `oklch(0.55 0.11 40)` | Burnished metallic copper and warm architectural patina. Industrial design, acoustics, bespoke metals. |

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
