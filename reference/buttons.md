# Tactile & Micro-Interactive Buttons

Buttons are the primary tactile touchpoint between a human user and software. Generic AI buttons uniformly default to lifeless rectangular boxes with delayed linear transitions. A human-crafted button communicates physical mass, elasticity, surface depth, and clear tactile confirmation when pressed.

---

## 1. Physical Mechanics: Squish & Stretch Physics

When an elastic physical switch or membrane key is compressed along its vertical axis by a finger press, the material laterally expands along its horizontal axis (the Poisson effect in elastomeric physics).

### Mandatory Active Physics

All interactive button triggers must apply GPU-accelerated horizontal stretch and vertical compression on `:active`:

```css
.btn {
  /* Composited transitions only: zero layout reflow */
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.18s ease,
              background-color 0.15s ease,
              border-color 0.15s ease;
  will-change: transform;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  /* Physical Poisson volume compression */
  transform: scale(1.03, 0.94);
}
```

### Strict Transition Bans

- **Never Animate Layout Properties:** Never include `padding`, `width`, `height`, `margin`, or `border-width` in transition declarations. This triggers full browser layout reflow calculations and causes stuttering frames.
- **Never Use Linear Motion:** `transition: all 0.3s ease` and linear timing functions are strictly banned. Always use spring curves (`cubic-bezier(0.34, 1.56, 0.64, 1)` or `cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 2. Multi-State Tactile Depth & Lighting

Real physical controls exhibit directional specular highlights where top beveled edges catch ambient overhead light.

### State Depth Hierarchy

| State | Transform | Box-Shadow & Specular Light |
|---|---|---|
| **Resting** | `none` | `0 4px 12px -2px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.22)` |
| **Hover** | `translateY(-1px)` | `0 6px 18px -2px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.35)` |
| **Active** | `scale(1.03, 0.94)` | `0 2px 4px -1px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.12)` |
| **Focus-Visible** | `none` | Dual-ring outline: `outline: 2px solid var(--primary); outline-offset: 2px` |
| **Disabled** | `none` | Zero shadow, `opacity: 0.55; cursor: not-allowed; pointer-events: none` |

---

## 3. Button Geometry System

Choose button geometry intentionally based on interface context and density:

```
.btn-pill       [border-radius: 9999px]      -> Primary consumer CTA, hero actions, mobile touch targets
.btn-rounded    [border-radius: 12px]        -> Modern card actions, modal confirmation buttons
.btn-compact    [border-radius: 8px]         -> Dense data tables, developer tools, filter bars
```

### Sizing Scale

Buttons must adhere to a strict minimum hit target and typography scale:

| Size Class | Min Height | Inline Padding | Font Size | Icon Spacing |
|---|---|---|---|---|
| `.btn-sm` (Compact) | 32px | 14px (`0.85rem`) | 13px (`0.8rem`) | 6px |
| `.btn-md` (Standard) | 40px | 20px (`1.25rem`) | 14.5px (`0.9rem`) | 8px |
| `.btn-lg` (Hero CTA) | 48px | 26px (`1.65rem`) | 17px (`1.05rem`) | 10px |

---

## 4. Semantic Variants & Contrast

Every button variant must satisfy WCAG 2.2 AA contrast standards ($\ge 4.5:1$ for text):

1. **Primary (`.btn-primary`):** Solid brand accent (`var(--primary)`). Canvas/white high-contrast text with top-edge specular highlight. Reserved for the single most important action on a surface.
2. **Secondary (`.btn-secondary`):** Tactile surface fill (`var(--surface)`) with subtle 1px border (`var(--border)`). Lifts slightly on hover; deepens on click.
3. **Subtle / Ghost (`.btn-ghost`):** Transparent resting background. Activates subtle surface fill on hover without shifting layout.
4. **Destructive (`.btn-destructive`):** High-contrast warning/alert color with explicit confirmation states.

---

## 5. Keyboard Accessibility & Touch Targets

- **Focus Ring:** Every interactive button must define `:focus-visible` with a distinct outline offset (`outline: 2px solid var(--primary); outline-offset: 2px`). Never suppress focus rings with `outline: none` without providing an accessible alternative.
- **Minimum Touch Target:** Mobile viewports must enforce a minimum hit box of $44 \times 44\text{px}$ using padding or transparent pseudos.
- **Button Semantics:** Always use native `<button type="button">` or `<a role="button">`. Never build interactive buttons from un-focusable `<div>` elements without ARIA attributes.
