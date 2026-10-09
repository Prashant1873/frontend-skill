---
name: frontend-skill
description: Master engineering and visual design skill for web and native user interfaces. Automatically activate whenever building, designing, modifying, styling, polishing, animating, or reviewing any frontend code, web application, landing page, UI component, page, or design system across HTML, CSS, JavaScript, TypeScript, React, Next.js, Vue, Svelte, Astro, Tailwind, or native platforms. Enforces anti-slop craft standards, Apple fluid spring physics, typography scales, WCAG 2.2 AA accessibility, 13 cognitive UX laws, and automated AST antipattern verification.
---

# Unified Frontend Skill (Design Taste, Engineering, Polish & UX)

Master engineering and design skill for frontend interfaces: aesthetic direction, anti-slop typography, component architecture, Apple fluid springs, cognitive UX laws, curated libraries, prototyping, and technical polish.

---

## 🚀 Quick Run Guide & Commands Matrix

Invoke workflows via natural phrasing or direct subcommands:

| Command / Trigger | Primary Scope | What It Does |
|---|---|---|
| `frontend design [brief]` | Aesthetic & Direction | Analyzes brief, outputs Design Read, sets Dials (Variance, Motion, Density), selects aesthetic family. |
| `frontend polish [target]` | Visual Finishing | Final craft pass: micro-alignment, spacing rhythm, optical balance, hover states, border continuity. |
| `frontend critique [target]` | UX / Visual Critique | Evaluates against design heuristics (hierarchy, contrast, typography, affordances) with scored feedback. |
| `frontend audit [target]` | Technical Audit | Scans WCAG 2.2 AA accessibility, responsive adaptation, performance, and layout shifts. |
| `frontend clarify [target]` | UX Copy & Clarity | Sharpens copy, error messages, empty states, labels, and cognitive ergonomics. |
| `frontend distill [target]` | Simplification | Strips visual noise, redundant chrome, nested cards, and unearned embellishments. |
| `frontend bolder [target]` | Visual Punch | Amplifies safe/bland layouts with distinctive typography, bold contrast, and anchor moments. |
| `frontend quieter [target]` | Restraint | Calms overstimulated, busy, hyper-animated, or neon-heavy interfaces. |
| `frontend harden [target]` | Edge Cases | Hardens UI against long strings, slow networks, zero-states, and keyboard traps. |
| `frontend engineer [feature]` | Component Build | Production component architecture: colocation, composition, strict state tiering. |
| `frontend apple [component]` | Fluid Motion | Applies Apple HIG fluid motion: 1:1 pointer tracking, interruptible springs, velocity handoff. |
| `frontend ux [flow]` | Cognitive UX Laws | Evaluates flow against Hick's, Fitts's, Jakob's, Miller's, Doherty 400ms threshold, Peak-End rule. |
| `frontend pick-lib <task>` | Dependency Lookup | Curated recommendation for toasts, dialogs, charts, OTP inputs, dnd, virtualization, or state. |
| `frontend prototype <feature>` | Multi-Variant Picker | Builds 3-5 distinct visual variants behind an interactive switcher ([PICKER.md](PICKER.md)). |

---

## ⚡ Master Autonomous Pipeline: `frontend` / `frontend full`

When invoked without a subcommand (`frontend`, `frontend-skill`, `frontend full`), execute all subskills across the target platform using a **Chunkwise Implementation Plan** written to `FRONTEND_PLAN.md` before editing files:

```markdown
# Frontend Implementation Plan: [Platform / Feature Name]

## Target Mode: [Persuade | Operate | Read | Experience]
## Design Read: "<One-line read of audience, vibe, and aesthetic family>"
## Active Dials: Variance: [1-10] | Motion: [1-10] | Density: [1-10]

### Chunk 1: Recon & Strategy (ux-laws, taste-skill, pick-ui-library)
- [ ] Task 1.1: Stack inspection & token audit (colors, typography, radii)
- [ ] Task 1.2: UX laws friction scan (Hick's, Jakob's, Miller's)
- [ ] Task 1.3: Lock in curated library dependencies (pick-ui-library)

### Chunk 2: Direction & Scaffolding (prototype, distill)
- [ ] Task 2.1: Strip existing slop / nested cards (distill)
- [ ] Task 2.2: Establish 3 diverging layout axes (prototype)

### Chunk 3: Production Engineering (frontend-ui-engineering)
- [ ] Task 3.1: Component colocation & composable architecture
- [ ] Task 3.2: State management tiering (local -> URL -> server -> store)

### Chunk 4: Fluid Physics & Gestures (apple-design)
- [ ] Task 4.1: Eliminate pointer lag (active states on pointer-down)
- [ ] Task 4.2: Add interruptible springs (damping 1.0 default, 0.8 momentum)
- [ ] Task 4.3: 1:1 pointer capture & velocity projection

### Chunk 5: Hardening & A11y (audit, harden)
- [ ] Task 5.1: WCAG 2.2 AA keyboard focus rings & semantic roles
- [ ] Task 5.2: Edge case resilience: overflow, error states, skeletons

### Chunk 6: Impeccable Polish (polish, craft-floor)
- [ ] Task 6.1: Sub-pixel alignment, spacing rhythm & typography scale
- [ ] Task 6.2: Final pre-flight anti-slop check
```

**Execution Rules:**
1. Work sequentially through Chunks 1 to 6; never perform monolithic edits.
2. Verify each chunk before advancing to the next.
3. Every code change must tie directly to an active chunk task.

---

## Section 1: Anti-Slop Design Taste & Brief Inference

### 1.1 The Design Read
Before generating layout, declare:
> *"Reading this as: <page kind: Persuade|Operate|Read|Experience> for <audience>, with a <vibe> language, leaning toward <aesthetic family>."*

### 1.2 The Three Dials
- **`DESIGN_VARIANCE` (1-10)**: 1 = strict corporate symmetry, 10 = kinetic asymmetry. Default: `8`.
- **`MOTION_INTENSITY` (1-10)**: 1 = instant/static, 10 = continuous physical animation. Default: `6`.
- **`VISUAL_DENSITY` (1-10)**: 1 = spacious gallery, 10 = high-density cockpit. Default: `4`.

### 1.3 Anti-Default Invariants
- ❌ NO AI-purple gradient meshes behind hero sections.
- ❌ NO three identical feature cards with generic rounded icons.
- ❌ NO arbitrary glassmorphism on backgrounds lacking depth.
- ❌ NO pure gray (`#71717A`) on pure black (`#000000`) without intentional color tinting.
- ❌ NO generic Inter + slate-900 combinations when brand character demands personality.

### 1.4 Granular Sub-Playbook Routing & Green-Field Consent (ROUTER-01, ROUTER-02)
- **Surgical Intent Routing**: When user requests target specific elements (buttons, headings, grids, colors, typography), route strictly to that sub-playbook per [reference/router.md](reference/router.md) without modifying unrelated subsystems:
  - Buttons & click physics -> [reference/buttons.md](reference/buttons.md)
  - Editorial headings & anti-pill -> [reference/editorial.md](reference/editorial.md)
  - Bento & asymmetric grids -> [reference/bento.md](reference/bento.md)
  - Color & contrast -> [reference/colorize.md](reference/colorize.md)
  - Typography & pairings -> [reference/typeset.md](reference/typeset.md)
  - Motion & fluid springs -> [reference/animate.md](reference/animate.md)
  - Simplification & chrome reduction -> [reference/distill.md](reference/distill.md)
- **Green-Field Consent Protocol**: Prompts asking to create an app from scratch (`build app from scratch`, `new app`) must trigger an explicit confirmation prompt before activating the full Human-Craft design system.

---

## Section 2: Impeccable Craft & Quality Invariants

- **Inspect before edit**: Query existing CSS tokens, variables, and typography scales first.
- **Bounded passes**: Fix identified findings in one disciplined batch; avoid infinite micro-loops.
- **Refinement preserves; redesign replaces**: Never blend half-hearted redesign into existing brand assets.
- See [reference/craft-floor.md](reference/craft-floor.md) and [reference/new-work.md](reference/new-work.md) for complete playbooks.

---

## Section 3: Production UI Engineering & Accessibility

### 3.1 Architecture & Colocation
- Colocate component presentation, unit tests, state hooks, and types within the component folder.
- Favor composition over configuration (`<Card.Header>`, `<Card.Body>`) instead of bloated boolean props.

### 3.2 State Management Hierarchy
1. **Local state (`useState`, `useReducer`)**: Component-only UI state (accordion open, dropdown toggle).
2. **Lifted state**: Shared between immediate sibling components.
3. **URL state (`searchParams`)**: Filters, pagination, active tabs, shareable view states.
4. **Server cache (TanStack Query, SWR)**: Remote API data, caching, and mutation invalidation.
5. **Global client store (Zustand)**: Cross-cutting app state (auth session, global cart).

### 3.3 WCAG 2.2 AA Mandates
- **Keyboard navigation**: Full traversal via `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`.
- **Focus visibility**: High-contrast outlines on all interactive elements (`focus-visible:ring-2`).
- **Semantic elements**: Always `<button>` for actions, `<a>` for navigation; never `<div onClick>`.
- **Contrast**: Minimum 4.5:1 for body text, 3:1 for large text (18pt+) and active icons.
- **Form associations**: Explicit programmatic `<label>` associations via `htmlFor` / `id`.

---

## Section 4: Apple Fluid Interface Motion & Spring Physics

### 4.1 Fluid Motion Invariants
- **Interruptibility**: All animations must be cancelable and reversible mid-flight from current presentation value. Never freeze user input during transitions.
- **Spring Parameters**:
  - `damping: 1.0` (Critically damped): Default for interface settling (menus, dialogs, drawers). Zero overshoot.
  - `damping: 0.8` (Underdamped momentum): Used only following physical fling or swipe momentum.
  - `response: 0.3s - 0.5s`: Snappy, responsive settling duration.
- **Direct Manipulation**: Maintain 1:1 finger/cursor tracking via `setPointerCapture` and project release velocity.

```ts
import { animate } from 'motion';

// Interface settle (critically damped, zero bounce)
animate(element, { y: 0 }, { type: 'spring', bounce: 0, duration: 0.35 });

// Flick gesture release (momentum handoff)
animate(element, { y: target }, { type: 'spring', bounce: 0.15, duration: 0.4, velocity: releaseVelocity });
```

---

## Section 5: UX Psychology & Laws of Design

1. **Hick's Law**: Decision time grows with choices. Split long flows into progressive steps.
2. **Fitts's Law**: Target acquisition time depends on size and distance. Enforce minimum 44x44px touch targets.
3. **Jakob's Law**: Users expect interfaces to function like familiar patterns. Avoid alien navigation mechanics.
4. **Law of Proximity**: Related elements belong together. Group related controls with spatial rhythm before adding borders.
5. **Miller's Law**: Working memory capacity is 5–7 chunks. Structure forms into bite-sized segments.
6. **Doherty Threshold (400ms)**: Provide visual response within 400ms. Show skeletons or optimistic UI on slow operations.
7. **Von Restorff Effect**: The distinctive item commands attention. Emphasize the primary CTA; restrain secondary chrome.
8. **Peak-End Rule**: Experiences are judged by peak moments and resolution. Complete workflows with clear confirmation states.
9. **Zeigarnik Effect**: Incomplete tasks retain recall. Provide progress indicators for multi-step tasks.
10. **Law of Prägnanz**: Minds reduce ambiguity to clean order. Keep container geometry simple and predictable.
11. **Serial Position Effect**: First and last items receive highest recall. Place key links at navigation anchors.
12. **Aesthetic-Usability Effect**: Polished, beautiful interfaces are perceived as more reliable and forgiving.
13. **Tesler's Law**: System complexity cannot be eliminated. Absorb complexity in code rather than offloading to the user.

---

## Section 6: Curated UI Library Selector

| Task / Problem | Curated Recommendation | Rationale |
|---|---|---|
| Unstyled primitives | **[base-ui](https://base-ui.com)** or Radix | Robust accessibility, unstyled flex, focus trapping. |
| Command palette (⌘K) | **[cmdk](https://cmdk.paco.me)** | Accessible, fast, keyboard-driven palette. |
| Toasts / Alerts | **[Sonner](https://sonner.emilkowal.ski)** | Swipeable, stacked, zero config. |
| OTP / Verification inputs | **[input-otp](https://input-otp.rodz.dev)** | Accessible OTP inputs with clean animations. |
| Motion & Springs | **[motion](https://motion.dev)** (Framer) | Production spring physics, gestures, exit transitions. |
| Tabular rolling numbers | **[NumberFlow](https://number-flow.barvian.me)** | Smooth digit rolling and layout morphing. |
| Charts & Feeds | **[recharts](https://recharts.org)** / **[Liveline](https://github.com/benjitaylor/liveline)** | Interactive data visualization and live streams. |
| Drag and drop | **[dnd kit](https://dndkit.com)** | Modular, performant drag and drop. |
| Virtualized tables | **[Virtuoso](https://virtuoso.dev)** | Handles 10k+ rows with dynamic heights. |
| State store | **[zustand](https://zustand.docs.pmnd.rs)** | Minimal boilerplate client store. |
| Variant styling | **[cva](https://cva.style)** + **clsx** | Type-safe component variant API. |
| Theme switching | **[next-themes](https://github.com/pacocoursey/next-themes)** | Prevents unstyled theme flash on load. |

---

## Section 7: Multi-Variant Prototyping & Visual Picker

Trigger: `frontend prototype <feature>` (e.g. `frontend prototype pricing-table`).

1. **Scope**: Isolate a single target component or flow.
2. **Recon**: Map existing tokens, typography, and borders.
3. **Diverge**: Build 3 distinct variants along defined design axes.
4. **Harness**: Render variants within an isolated test harness using keyboard switcher ([PICKER.md](PICKER.md)).
5. **Selection & Promotion**: User selects preferred variant; merge winner into production codebase and clean test harness.

---

## 📋 Compulsory Execution Contract

Before declaring ANY frontend deliverable complete, agents must strictly execute this 4-step contract:
1. **Design Read & Dials**: Explicitly establish `DESIGN_VARIANCE`, `MOTION_INTENSITY`, and `VISUAL_DENSITY` tailored to product mood.
2. **Craft Floor Gate**: Adhere to [reference/craft-floor.md](reference/craft-floor.md) (minimum 44px touch targets, WCAG 2.2 AA contrast, intentional hierarchy, zero unstyled buttons).
3. **Apple Fluid Physics**: Apply WWDC spring parameters for all transitions and interactions ([reference/animate.md](reference/animate.md)).
4. **Mechanical AST Slop Verification Gate**: Execute the antipattern detector over changed files:
   ```bash
   node scripts/detector/detect-antipatterns.mjs --target <changed files>
   ```
   Resolve all reported antipatterns before declaring completion.

---

## Pre-Flight Check Before Declaring Work Complete

- [ ] Stated design read and adhered to chosen dials?
- [ ] No generic AI purple gradients or unearned glassmorphism?
- [ ] Typography has intentional hierarchy (scale, line-height, font-weight contrast)?
- [ ] Spacing uses consistent 4px or 8px grid steps?
- [ ] Keyboard focus works and visible outline exists?
- [ ] Micro-interactions respond on pointer-down without latency?
- [ ] Empty, loading, and error states handled?
- [ ] Mechanical detector check passed with 0 antipatterns?
