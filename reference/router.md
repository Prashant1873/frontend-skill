# Granular Natural Language Module Router & Green-Field Consent Playbook (Router 2.0)

> A discipline playbook for surgical sub-playbook routing on focused queries, explicit subcommand dispatch, interactive help discovery, and mandatory user consent protocols on green-field application builds.

---

## 1. The Surgical Routing Principle

When users ask for assistance with a specific frontend element (e.g. *"Fix the button click animation"* or *"Adjust color contrast on this card"*), AI agents must never perform an unsolicited whole-project redesign.

### Core Directives:
1. **Targeted Sub-Playbook Activation**: Isolate the exact sub-system referenced in the user's prompt and consult only its dedicated reference playbook.
2. **Strict Scope Fence**: Do not modify fonts, spacing, or grids if the user only requested button or color adjustments.
3. **Transparent Execution**: Inform the user which targeted playbook governs the modification:
   > *"Applying `reference/buttons.md` for tactile spring micro-interactions."*
4. **Three Trigger Modalities**: Support prefix-free natural phrasing, explicit `frontend <subcommand>` syntax, and interactive catalog lookup (`frontend help`).

---

## 2. Intent Classification & Routing Matrix

### Primary Command Matrix (18 High-Frequency Workflows)

| User Intent | Prompt Clues & Keywords | Target Playbook | Scope Boundary |
|---|---|---|---|
| **Design Brief** (`design`) | `design brief`, `aesthetic direction`, `design read`, `set dials` | [new-work.md](new-work.md) | Analyze brief, set 3 Dials (Variance, Motion, Density), select archetype. |
| **Visual Polish** (`polish`) | `polish`, `sub-pixel`, `spacing rhythm`, `alignment pass`, `visual finishing` | [polish.md](polish.md) | Fine-tune micro-spacings, border continuity, optical balance. |
| **Heuristic Critique** (`critique`) | `critique`, `review design`, `heuristic evaluation`, `visual audit` | [critique.md](critique.md) | Score hierarchy, contrast, affordances, and cognitive friction. |
| **Technical Audit** (`audit`) | `technical audit`, `wcag audit`, `a11y audit`, `accessibility audit` | [audit.md](audit.md) | 5-pillar technical audit (WCAG AA, perf, theming, responsive). |
| **UX Copy** (`clarify`) | `clarify`, `ux copy`, `microcopy`, `sharpen copy`, `error messages`, `empty states` | [clarify.md](clarify.md) | Refine phrasing, empty states, input placeholders, button verbs. |
| **Simplification** (`distill`) | `simplify`, `declutter`, `strip cards`, `strip borders`, `reduce chrome`, `distill` | [distill.md](distill.md) | Remove card-in-card chrome, flatten nested surfaces, open negative space. |
| **Visual Punch** (`bolder`) | `bolder`, `more punch`, `visual punch`, `punchy`, `more contrast`, `louder` | [bolder.md](bolder.md) | Elevate typographic scale contrast, bold anchor accents. |
| **Visual Restraint** (`quieter`) | `quieter`, `tone down`, `subtler`, `less contrast`, `calmer`, `soften` | [quieter.md](quieter.md) | Restrain neon accents, mute secondary layers, calm busy views. |
| **Resilience** (`harden`) | `harden`, `edge cases`, `long strings`, `keyboard traps`, `overflow resilience` | [harden.md](harden.md) | Handle string truncation, slow network skeletons, error boundaries. |
| **Architecture** (`engineer`) | `engineer`, `component architecture`, `colocation`, `state tiering` | [craft-floor.md](craft-floor.md) | Component directory colocation, state hierarchy, TypeScript props. |
| **Fluid Physics** (`apple`) | `apple motion`, `wwdc`, `interruptible springs`, `1:1 pointer`, `velocity projection` | [animate.md](animate.md) | WWDC interruptible spring parameters (`damping: 1.0 / 0.8`), zero latency. |
| **UX Laws** (`ux`) | `ux scan`, `hick's law`, `fitts's law`, `miller's law`, `cognitive friction`, `cfi` | [craft-floor.md](craft-floor.md) | Evaluate cognitive ergonomics, chunking, and minimum touch targets. |
| **Responsive** (`adapt`) | `adapt`, `responsive`, `mobile layout`, `container queries`, `fluid viewport` | [adapt.md](adapt.md) | Fluid viewports, container queries, mobile touch adaptation. |
| **Micro-Delight** (`delight`) | `delight`, `micro-interactions`, `haptics`, `celebrate`, `confetti`, `easter eggs` | [delight.md](delight.md) | Tactile confirmations, celebration micro-moments, subtle polish. |
| **Data Viz** (`visualize`) | `visualize`, `charts`, `data visualization`, `sparklines`, `metrics grid` | [visualize.md](visualize.md) | Data charts, sparklines, metric summaries, tabular density. |
| **Token Compiler** (`tokens`) | `tokens`, `compile tokens`, `token dictionary`, `export tokens`, `tailwind` | [craft-floor.md](craft-floor.md) | Compile tokens to CSS custom properties, Tailwind v3/v4, SCSS, DTCG. |
| **Variant Switcher** (`prototype`) | `prototype`, `picker`, `variant switcher`, `multi-variant` | [../PICKER.md](../PICKER.md) | Build 3–5 diverging prototypes behind floating test harness. |
| **Health Check** (`doctor`) | `doctor`, `staleness`, `health scan`, `drift check` | [doctor.md](doctor.md) | Audit design token coverage, detector ignores, and artifact staleness. |
| **Full Test & Report** (`report`) | `run all tests`, `test report`, `full test suite`, `run every test`, `all tests possible`, `audit and critique report` | [report.md](report.md) | Executes all 20 test suites, antipattern detectors, cognitive UX laws, and generates `FRONTEND_REPORT.md`. |

---

### Specialized Domain Clusters

| Domain Cluster | Commands & Trigger Keywords | Target Playbook | Scope Boundary |
|---|---|---|---|
| **Buttons & Click Physics** | `button`, `btn`, `squish`, `press`, `tap`, `click`, `active state`, `concentric`, `optical` | [buttons.md](buttons.md) | Modify button geometry, concentric radii, optical icon offsets, and specular highlights. |
| **Editorial & Anti-Pill** | `pill`, `badge`, `eyebrow`, `heading`, `kicker`, `editorial` | [editorial.md](editorial.md) | Replace pill chips with asymmetric scale or hairline dividers. |
| **Bento & Multi-Span Grids** | `bento`, `grid`, `layout`, `columns`, `3-card`, `multi-span` | [bento.md](bento.md) | Break equal-width columns using 2:1 or anchor hero spans. |
| **Color & Perceptual Contrast** | `color`, `palette`, `contrast`, `oklch`, `theme`, `dark mode` | [colorize.md](colorize.md) | Enforce WCAG 2.2 AA / APCA contrast and harmonic stepping. |
| **Typography & Font Pairing** | `font`, `typography`, `typeset`, `pairing`, `fallbacks` | [typeset.md](typeset.md) | Pair characterful archetype fonts with metric fallbacks. |
| **Motion & Spring Gestures** | `animation`, `motion`, `transition`, `spring`, `fluid`, `segmented`, `tabs`, `viscoelastic` | [animate.md](animate.md) | Apply interruptible Apple fluid spring curves and viscoelastic WAAPI segmented indicator physics. |
| **Container Silhouette** | `shape`, `geometric masks`, `corner curvature`, `silhouette` | [shape.md](shape.md) | Geometric borders, card silhouettes, and tailored container forms. |
| **Experimental Creative** | `overdrive`, `experimental design`, `brutalist kinetic`, `hyper-variance` | [overdrive.md](overdrive.md) | Push design variance to 10 with asymmetric brutalist kineticism. |
| **iOS HIG Platform** | `ios`, `apple hig`, `sf pro`, `safe area`, `bottom sheets` | [ios.md](ios.md) | iOS platform design patterns, native navigation, and SF Pro scaling. |
| **Android Material Platform** | `android`, `material you`, `material 3`, `system bars` | [android.md](android.md) | Material 3 tonal palettes, navigation bars, and Android tokens. |
| **Cockpit & Density** | `operate`, `cockpit`, `dev tools`, `dense UI`, `high density` | [operate.md](operate.md) | High-information cockpit layouts, compact tables, operational consoles. |
| **Token Extraction** | `extract`, `extract tokens`, `harvest colors`, `harvest fonts` | [extract.md](extract.md) | Extract design tokens from live URLs or raw markup into token records. |
| **Design Documentation** | `document`, `design system docs`, `generate design.md`, `style guide` | [document.md](document.md) | Generate or update DESIGN.md documentation and token records. |
| **Repo Onboarding** | `onboard`, `onboarding`, `bootstrap design system` | [onboard.md](onboard.md) | Scan existing repo, detect framework, bootstrap design tokens. |
| **Interactive Help** | `help`, `commands`, `list commands`, `available skills` | [router.md](router.md) | Display sub-skill directory and usage catalog. |

---

## 3. Green-Field Full-Craft Auto-Activation Protocol (ROUTER-02)

When a user commands building a new platform, web application, dashboard, landing page, or screen from scratch (`build app from scratch`, `new platform`, `create platform`, `build platform`, `make an app`, `create new app`, `scaffold UI`, `new design`), agents must **IMMEDIATELY & AUTOMATICALLY DEPLOY THE HUMAN-CRAFT UI ENGINE TO THE FULLEST**.

### Zero-Hesitation Execution:
Never stall the user with hesitation questions or ask whether they prefer minimal vanilla defaults. From the very first line of code, orchestrate the full craft contract:

1. **Aesthetic Direction & Intent**: Formulate Design Read (`page kind`, `vibe`, `aesthetic family`) and set Dials (`DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 6`, `VISUAL_DENSITY: 4`).
2. **Curated Typography**: Select characterful typography (e.g. Geist, Plus Jakarta Sans, Space Grotesk, Mona Sans, Instrument Sans/Serif, Fraunces) with zero-CLS metric fallbacks. Restrict monospace strictly to tabular code/data.
3. **OKLCH Dual-Mode Parity**: Establish `:root` and `[data-theme="dark"]` tokens with physical lighting parity (diffuse directional shadows in light mode; stepped surface luminance $L \approx 0.13 \rightarrow 0.18 \rightarrow 0.24$ with hairline luminous borders in dark mode).
4. **Tactile Spring Physics**: Apply Apple fluid physics (`cubic-bezier(0.32, 0.72, 0, 1)`, tactile squish, scale down on `:active`, rubber-banding). Never linear or `transition: all 0.3s ease`.
5. **Asymmetric Editorial & Bento Grids**: Break cookie-cutter 3-column cards with visual anchors, asymmetric spans, and clean negative space.
6. **Zero Emojis in UI**: Never use raw emojis for icons, badges, buttons, or graphics. Always embed sharp SVG icons (Lucide, Radix, Phosphor, Heroicons).
7. **Mandatory Production Favicon**: Always include `<link rel="icon" type="image/svg+xml" href="...">` matching product branding.
8. **Anti-Slop Craft Floor**: No nested border cards, no floating purple-blue gradients, 44px touch targets, `:focus-visible` accessible rings, 400ms Doherty responsiveness.

### Opt-Out Exception:
If and only if the user explicitly requests plain unstyled HTML (`"plain html"`, `"no css"`, `"unstyled"`, or `"frontend minimal"`), use standard platform defaults without tokens. Otherwise, full human-craft is the mandatory default standard.

---

## 4. Cross-Playbook References

- Craft floor guidelines: [craft-floor.md](craft-floor.md)
- Fluid spring physics: [animate.md](animate.md)
- Tactile button mechanics: [buttons.md](buttons.md)
- Complete design workflows: [new-work.md](new-work.md)
