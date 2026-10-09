# Granular Natural Language Module Router & Green-Field Consent Playbook

> A discipline playbook for surgical sub-playbook routing on focused queries and mandatory user consent protocols on green-field application builds.

---

## 1. The Surgical Routing Principle

When users ask for assistance with a specific frontend element (e.g. *"Fix the button click animation"* or *"Adjust color contrast on this card"*), AI agents must never perform an unsolicited whole-project redesign.

### Core Directives:
1. **Targeted Sub-Playbook Activation**: Isolate the exact sub-system referenced in the user's prompt and consult only its dedicated reference playbook.
2. **Strict Scope Fence**: Do not modify fonts, spacing, or grids if the user only requested button or color adjustments.
3. **Transparent Execution**: Inform the user which targeted playbook governs the modification:
   > *"Applying `reference/buttons.md` for tactile spring micro-interactions."*

---

## 2. Intent Classification & Routing Matrix

| User Intent | Prompt Clues & Keywords | Target Playbook | Scope Boundary |
|---|---|---|---|
| **Buttons & Click Physics** | `button`, `btn`, `squish`, `press`, `tap`, `click`, `active state` | [buttons.md](buttons.md) | Modify only button geometry, transitions, and specular highlights. |
| **Editorial & Anti-Pill** | `pill`, `badge`, `eyebrow`, `heading`, `kicker`, `editorial` | [editorial.md](editorial.md) | Replace pill chips with asymmetric scale or hairline dividers. |
| **Bento & Multi-Span Grids** | `bento`, `grid`, `layout`, `columns`, `3-card`, `multi-span` | [bento.md](bento.md) | Break equal-width columns using 2:1 or anchor hero spans. |
| **Color & Perceptual Contrast** | `color`, `palette`, `contrast`, `oklch`, `theme`, `dark mode` | [colorize.md](colorize.md) | Enforce WCAG 2.2 AA / APCA contrast and harmonic stepping. |
| **Typography & Font Pairing** | `font`, `typography`, `typeset`, `pairing`, `fallbacks` | [typeset.md](typeset.md) | Pair characterful archetype fonts with metric fallbacks. |
| **Motion & Spring Gestures** | `animation`, `motion`, `transition`, `spring`, `fluid` | [animate.md](animate.md) | Apply interruptible Apple fluid spring curves. |
| **Simplification & Chrome** | `simplify`, `declutter`, `strip borders`, `distill` | [distill.md](distill.md) | Remove card-in-card chrome and expand negative space. |

---

## 3. The Green-Field Consent Protocol

When a user commands building a new application or screen from scratch (`build app from scratch`, `create new app`, `scaffold UI`), agents must not silently impose an exhaustive opinionated design system without confirmation.

### Mandatory Consent Gate:
Prompt the user before generating code:
```markdown
I can build this using the **Human-Craft UI Engine**:
- **Curated Characterful Typography**: Tailored font archetypes (Syne, Outfit, Plus Jakarta Sans) — no generic Inter/Roboto defaults.
- **Perceptual OKLCH Colors**: Mathematically guaranteed WCAG 2.2 AA / APCA contrast.
- **Tactile Micro-Interactive Buttons**: GPU-accelerated squish-and-stretch :active spring physics.
- **Asymmetric Bento & Editorial Grids**: Fluid multi-span layout rhythms without uniform card templates.

Would you like to proceed with the full Human-Craft design system, or do you prefer minimal vanilla defaults?
```

### Protocol Branches:
- **Proceed**: Activate the full frontend craft contract and execute sequentially.
- **Minimal Defaults**: Use standard platform HTML5/CSS primitives without specialized tokens.

---

## 4. Cross-Playbook References

- Craft floor guidelines: [craft-floor.md](craft-floor.md)
- Fluid spring physics: [animate.md](animate.md)
- Tactile button mechanics: [buttons.md](buttons.md)
