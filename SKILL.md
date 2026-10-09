---
name: frontend-skill
description: Complete unified frontend engineering & design system skill. Combines anti-slop design taste, impeccable craft & evaluation commands (/polish, /critique, /audit, /distill, /bolder), production UI engineering & accessibility (WCAG), Apple fluid motion & spring physics, UX psychology laws, curated UI library picker, and multi-variant prototyping.
---

# Unified Frontend Skill (Design Taste, Engineering, Polish & UX)

A single master skill for all frontend disciplines: from aesthetic direction and anti-slop typography, to production component architecture, Apple fluid motion, UX laws, UI library selection, interactive prototyping, and surgical audit/polish passes.

---

## 🚀 Quick Run Guide & Commands Matrix

Run any frontend workflow using either natural phrasing or direct subcommands:

| Command / Trigger | Primary Scope | What It Does |
|---|---|---|
| `frontend design [brief]` | Aesthetic & Direction | Reads the brief, outputs one-line Design Read, sets Dials (Variance, Motion, Density), chooses official design system or aesthetic family. |
| `frontend polish [target]` | Visual Finishing | Final craft pass: micro-alignments, surface rhythm, optical balance, hover states, border-radius continuity. |
| `frontend critique [target]` | UX / Visual Critique | Evaluates against design principles with heuristic scoring (hierarchy, contrast, typography, affordances). |
| `frontend audit [target]` | Technical Audit | WCAG 2.2 AA accessibility scan, responsiveness, performance, layout shifts, interaction lags. |
| `frontend clarify [target]` | UX Copy & Clarity | Sharpens copy, error messages, empty states, labels, and cognitive ergonomics. |
| `frontend distill [target]` | Simplification | Strips visual noise, redundant chrome, nested cards, and unearned embellishments. |
| `frontend bolder [target]` | Visual Punch | Amplifies safe/bland layouts with distinctive typography, bold contrast, and memorable anchor moments. |
| `frontend quieter [target]` | Restraint | Calms down overstimulated, busy, hyper-animated, or neon-heavy interfaces. |
| `frontend harden [target]` | Edge Cases | Hardens UI against long strings, network failures, slow loads, zero-states, and keyboard traps. |
| `frontend engineer [feature]` | Component Build | Builds production-grade components: colocation, composition over configuration, strict state tiering. |
| `frontend apple [component]` | Fluid Motion | Applies Apple HIG motion: 1:1 pointer tracking, interruptible springs (damping/response), velocity handoff. |
| `frontend ux [flow]` | Cognitive UX Laws | Evaluates flow against Hick's, Fitts's, Jakob's, Miller's, Doherty 400ms threshold, Peak-End rule. |
| `frontend pick-lib <task>` | Dependency Lookup | Curated recommendation for toasts, dialogs, charts, OTP inputs, drag-and-drop, virtualization, or state. |
| `frontend prototype <feature>` | Multi-Variant Picker | Builds 3-5 distinct, fully-functioning visual variants behind an interactive switcher (`PICKER.md`). |

---

## ⚡ Master Autonomous Pipeline: `frontend` / `frontend full`

**Default Invocation Mode**: When invoked simply as `frontend`, `frontend-skill`, or `frontend full [platform/surface]` without a sub-command, the skill runs an **end-to-end systematic execution of ALL subskills across the target platform**, organized into a **chunkwise implementation plan executed in phases**.

```
[Target Platform / Surface]
            │
    ┌───────▼─────────────────────────────────────────────────┐
    │  PHASE 1: Recon & UX Strategy                           │
    │  Subskills: ux-laws + taste-skill + pick-ui-library     │
    └───────┬─────────────────────────────────────────────────┘
            │
    ┌───────▼─────────────────────────────────────────────────┐
    │  PHASE 2: Visual Concept & Exploration                  │
    │  Subskills: prototype + impeccable (/shape, /distill)   │
    └───────┬─────────────────────────────────────────────────┘
            │
    ┌───────▼─────────────────────────────────────────────────┐
    │  PHASE 3: Production Engineering & Scaffolding          │
    │  Subskills: frontend-ui-engineering                     │
    └───────┬─────────────────────────────────────────────────┘
            │
    ┌───────▼─────────────────────────────────────────────────┐
    │  PHASE 4: Apple Fluid Physics & Motion                  │
    │  Subskills: apple-design                                │
    └───────┬─────────────────────────────────────────────────┘
            │
    ┌───────▼─────────────────────────────────────────────────┐
    │  PHASE 5: Hardening, WCAG A11y & Resilience             │
    │  Subskills: impeccable (/harden, /audit) + WCAG 2.2     │
    └───────┬─────────────────────────────────────────────────┘
            │
    ┌───────▼─────────────────────────────────────────────────┐
    │  PHASE 6: Impeccable Polish & Craft Floor               │
    │  Subskills: impeccable (/polish) + taste-skill (Check)  │
    └─────────────────────────────────────────────────────────┘
```

### The Chunkwise Implementation Plan Protocol

When `frontend` is invoked, the agent MUST first construct and output a **Chunkwise Implementation Plan** (written to `FRONTEND_PLAN.md` or conversation plan) before editing production files:

```markdown
# Frontend Implementation Plan: [Platform / Feature Name]

## Target Mode: [Persuade | Operate | Read | Experience]
## Design Read: "<One-line read of audience, vibe, and aesthetic family>"
## Active Dials: Variance: [X] | Motion: [Y] | Density: [Z]

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

### Phased Execution Rules
1. **Never dump everything in one monolithic edit**: Work sequentially through Chunks 1 to 6.
2. **Phase verification gate**: Verify each chunk's success criteria before advancing to the next.
3. **Traceable changes**: Each diff ties directly to the active chunk objective.
4. **Clean handoff**: Once Phase 6 finishes, present the final verification checklist.


---

## Section 1: Anti-Slop Design Taste & Brief Inference

### 1.1 Read the Room Before Writing Code
Before generating any layout, infer what the visitor and audience need:
1. **Surface Kind**: Persuade (landing, marketing), Operate (dashboard, tool), Read (docs, blog), or Experience (portfolio).
2. **Vibe & Context**: Minimalist, high-density B2B, consumer luxury, editorial, brutalist, or developer tool.
3. **Quiet Constraints**: Regulated industries, public sector, high accessibility needs, low-latency tools.

**Mandatory Pre-Generation Read:**
Always state in one line:
> *"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>."*

### 1.2 The Three Dials
* **`DESIGN_VARIANCE` (1-10)**: 1 = strict corporate symmetry, 10 = artsy asymmetry / kinetic layout. Default: `8`.
* **`MOTION_INTENSITY` (1-10)**: 1 = static / instant, 10 = cinematic physics / continuous scroll effects. Default: `6`.
* **`VISUAL_DENSITY` (1-10)**: 1 = airy art gallery, 10 = dense cockpit data table. Default: `4`.

### 1.3 Brief → Design System Map
* Enterprise B2B / Dashboard → `@fluentui/react-components` or `@carbon/react`
* Google/Android aesthetic → `@material/web` + M3 tokens
* E-Commerce admin → `polaris.js` / `@shopify/polaris`
* Developer tool / Open source → `@primer/css` or `@primer/react-brand`
* Public sector → `govuk-frontend` or `uswds`
* Modern SaaS / Indie Web → Radix Themes (`@radix-ui/themes`) or shadcn/ui or Tailwind CSS v4

### 1.4 Anti-Default Rules
* ❌ NO AI-purple gradient meshes behind every hero.
* ❌ NO three identical feature cards with generic rounded icons.
* ❌ NO arbitrary glassmorphism on backgrounds that don't need depth.
* ❌ NO pure gray (`#71717A`) on pure black (`#000000`) without intentional color tinting.
* ❌ NO generic Inter + slate-900 combinations when brand character demands personality.

---

## Section 2: Impeccable Craft & Evaluation Commands

This section incorporates the full Impeccable playbook. Detailed playbooks and detector scripts reside in `reference/` and `scripts/`.

### 2.1 The Four Surface Modes
* **Persuade** (Landing / marketing): The visitor acts. Visual impact, clear value proposition, conversion focus.
* **Operate** (App UI / dashboards): The visitor completes tasks. Predictability, scanability, density, speed.
* **Read** (Docs / editorial): The visitor learns. Typographic rhythm, readable line lengths (55-75 ch), low cognitive friction.
* **Experience** (Portfolios / showcases): The work leads. The UI frames the artifact and recedes.

### 2.2 Quality Floor & Invariants
* **Inspect before edit**: Always check existing styles, tokens, and active CSS variables.
* **Bounded passes**: Fix everything in one disciplined batch; do not loop indefinitely over micro-adjustments.
* **Refinement preserves; redesign replaces**: Never blend half-hearted redesign into existing brand assets.
* See [reference/craft-floor.md](reference/craft-floor.md) and [reference/craft.md](reference/craft.md) for full playbooks.

---

## Section 3: Production UI Engineering & Accessibility

### 3.1 Component Architecture & Colocation
Colocate everything related to a component together:
```
src/components/TaskCard/
  TaskCard.tsx          # Presentation
  TaskCard.test.tsx     # Tests
  useTaskCard.ts        # Business / local state logic (if complex)
  types.ts              # Component contracts
```

### 3.2 Composition Over Configuration
* Prefer sub-components (`<Card.Header>`, `<Card.Body>`) over giant prop-heavy single components with 20 configuration booleans.
* Separate data-fetching containers from presentational renderers.

### 3.3 State Management Hierarchy
1. **Local state (`useState`, `useReducer`)**: UI-only concerns (accordion open, dropdown state).
2. **Lifted state**: Shared between 2-3 immediate siblings.
3. **URL state (`searchParams`)**: Filters, pagination, active tabs, shareable view state.
4. **Server cache (TanStack Query, SWR)**: Remote API data, background refetching, mutation invalidation.
5. **Global client store (Zustand)**: App-wide cross-cutting state (auth token, user session, shopping cart).

### 3.4 WCAG 2.2 AA Accessibility Mandates
* Full keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`).
* Focus states must have visible, high-contrast outlines (`focus-visible:ring-2`).
* Semantic elements only: `<button>` for actions, `<a>` for links, never `<div onClick>`.
* Color contrast: minimum 4.5:1 for normal text, 3:1 for large text (18pt+) and active icons.
* All form inputs must have programmatic `<label>` associations via `htmlFor` / `id`.

---

## Section 4: Apple Fluid Interface Motion & Spring Physics

Based on Apple HIG and WWDC *Designing Fluid Interfaces*:

### 4.1 The Core Invariant: Interruptibility
* An interaction is fluid only when motion can be grabbed and reversed mid-flight without stutter.
* Always animate from **current presentation value**, never target value.
* Never freeze input or show non-dismissible transition locks.

### 4.2 Spring Physics Over Duration
Think in **Damping Ratio** and **Response** (not fixed millisecond durations):
* **Damping Ratio = 1.0**: Critically damped. Settle smoothly without overshoot. Use for modals, popovers, menus.
* **Damping Ratio = 0.8**: Controlled bounce. Use only when preceded by physical momentum (flicks, swipes, throws).
* **Response (0.3s - 0.5s)**: Snappy settling speed.

```ts
import { animate } from 'motion';

// Default interface settle (clean, no bounce)
animate(element, { y: 0 }, { type: 'spring', bounce: 0, duration: 0.35 });

// Flick gesture release (velocity continuation with subtle settle)
animate(element, { y: target }, { type: 'spring', bounce: 0.15, duration: 0.4, velocity: releaseVelocity });
```

### 4.3 Direct Manipulation & 1:1 Tracking
* Touch/cursor and element stay glued together during drag using Pointer Events with `setPointerCapture`.
* Calculate release velocity over the last 3-4 pointer samples to project momentum forward.

---

## Section 5: UX Psychology & Laws of Design

When designing screens or reviewing flows, audit against these 13 universal laws:

1. **Hick's Law**: Time to decide increases with number and complexity of choices. Break forms into steps; set smart defaults.
2. **Fitts's Law**: Large, nearby targets are faster to tap/click. Enlarge hit targets (minimum 44x44px for mobile).
3. **Jakob's Law**: Users expect your app to work like the ones they already know. Don't invent novel navigation patterns without a 10x benefit.
4. **Law of Proximity**: Items close together are perceived as a group. Use spacing before adding borders.
5. **Miller's Law**: Working memory holds 5-7 chunks. Divide long forms into bite-sized segments.
6. **Doherty Threshold (400ms)**: Respond within 400ms. If network takes longer, show skeleton or optimistic UI immediately.
7. **Von Restorff Effect**: The item that stands out is remembered. Make the single primary CTA visually distinctive; quiet everything else.
8. **Peak-End Rule**: Experiences are judged by their peak intensity and end state. End workflows with a clear, rewarding confirmation.
9. **Zeigarnik Effect**: People remember uncompleted tasks. Show progress bars for multi-step onboarding.
10. **Law of Prägnanz**: People perceive ambiguous shapes as simple and orderly. Keep card geometry clean and predictable.
11. **Serial Position Effect**: First and last items in a list receive maximum recall. Put critical links at start and end of nav bars.
12. **Aesthetic-Usability Effect**: Beautiful, polished UI is perceived as more reliable and forgiving of minor flaws.
13. **Tesler's Law (Conservation of Complexity)**: Every system has an irreducible amount of complexity. Don't push it onto the user; let the code handle it.

---

## Section 6: Curated UI Library Selector

Lookup table for choosing proven, modern libraries without guessing:

| Task / Problem | Curated Recommendation | Why |
|---|---|---|
| Unstyled accessible primitives | **[base-ui](https://base-ui.com)** or Radix | Bulletproof accessibility, focus trapping, unstyled. |
| Command palette (⌘K) | **[cmdk](https://cmdk.paco.me)** | Fast, accessible, keyboard-driven palette. |
| Toasts / Notifications | **[Sonner](https://sonner.emilkowal.ski)** | Swipeable, stacked, unstyled, zero config. |
| One-time password inputs | **[input-otp](https://input-otp.rodz.dev)** | Accessible OTP inputs with clean animations. |
| General Animation & Springs | **[motion](https://motion.dev)** (Framer Motion) | First-class spring physics, gestures, exit animations. |
| Animated numbers & stats | **[NumberFlow](https://number-flow.barvian.me)** | Smooth tabular digit rolling transitions. |
| Charts & Dashboards | **[recharts](https://recharts.org)** / **[Liveline](https://github.com/benjitaylor/liveline)** | Recharts for static/interactive; Liveline for live-streaming feeds. |
| Drag and Drop | **[dnd kit](https://dndkit.com)** | Modular, lightweight, performant drag and drop. |
| Large tables & Virtualization | **[Virtuoso](https://virtuoso.dev)** | Handles 10k+ rows with variable row heights. |
| Client State Management | **[zustand](https://zustand.docs.pmnd.rs)** | Minimal boilerplate, hook-based, outside-React access. |
| Tailwind variant styling | **[cva](https://cva.style)** + **clsx** | Type-safe component variant API. |
| Dark Mode / Themes | **[next-themes](https://github.com/pacocoursey/next-themes)** | Prevents flash of unstyled theme on load. |

---

## Section 7: Multi-Variant Prototyping & Visual Picker

Trigger: `frontend prototype <feature>` (e.g. `frontend prototype pricing-table` or `frontend prototype toast`).

### 7.1 Workflow
1. **Scope**: Isolate one specific component or UI piece.
2. **Recon**: Identify active styling stack, color tokens, and border radii.
3. **Diverge**: Propose 3 genuinely distinct directions on named axes (e.g. *Option 1: Quiet/Compact*, *Option 2: Editorial/Typography-led*, *Option 3: Kinetic/Interactive*).
4. **Harness**: Render all 3 variants inside an isolated test harness with the standard keyboard switcher defined in [PICKER.md](PICKER.md).
5. **User Choice**: Present the comparison table with tradeoffs (speed vs flair, density vs breathing room).
6. **Promote**: On selection, merge winning variant into production codebase and clean up test harness.

---

## Pre-Flight Check Before Declaring Work Complete

Before presenting any frontend work to the user:
- [ ] Stated design read and adhered to chosen dials?
- [ ] No generic AI purple gradients or unearned glassmorphism?
- [ ] Typography has intentional hierarchy (scale, line-height, font-weight contrast)?
- [ ] Spacing uses consistent 4px or 8px grid steps?
- [ ] Keyboard focus works and visible outline exists?
- [ ] Micro-interactions respond on pointer-down without latency?
- [ ] Empty, loading, and error states handled?
