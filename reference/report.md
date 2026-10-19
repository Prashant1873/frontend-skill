# Master Test, Audit, Critique & Antipattern Synthesis Playbook (`report`)

> A unified verification playbook for executing all available automated test suites, detecting AST/DOM antipatterns, evaluating cognitive UX friction laws, synthesizing heuristic design critiques, and generating publication-grade markdown scorecards.

---

## 1. Sub-Skill Overview & Invocations

The `report` sub-skill consolidates all verification capabilities of Frontend Skill into a single end-to-end execution pipeline. It validates technical correctness, visual craft, behavioral ergonomics, and code hygiene across both the skill repository itself and target application codebases.

### Command Invocations
- **Explicit CLI Subcommands**:
  - `frontend report [target]`
  - `frontend test [target]`
  - `frontend test-report [target]`
  - `frontend eval [target]`
- **Natural Language Conversational Triggers**:
  - *"Run all tests possible that are there on this skill and generate a report"*
  - *"Run all tests and generate a report with audits, critiques and antipatterns"*
  - *"Execute full test suite and output markdown report"*
  - *"Generate comprehensive test, audit, and critique scorecard"*
  - *"Check all antipatterns, UX laws, and test suites"*

---

## 2. The 5 Synthesis Dimensions

```
┌────────────────────────────────────────────────────────────────────────┐
│                   UNIFIED FRONTEND SYNTHESIS ENGINE                    │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Master Test Verification (20 Domain Suites, 100% Pass Required)    │
│ 2. Antipattern & Anti-Slop AST/DOM Scan (Blocking vs Advisory)         │
│ 3. Cognitive UX Friction Audit (Hick's, Fitts's 44px, Miller's Laws)   │
│ 4. 5-Pillar Technical Audit (WCAG 2.2 AA, Perf, Theming, Responsive)   │
│ 5. Heuristic Design Critique (Typography, Parity, Bento, Springs)      │
└────────────────────────────────────────────────────────────────────────┘
```

### Dimension 1: Master Automated Verification Suites
Executes all 20 domain verification suites via `node scripts/test-all.mjs`:
1. **Playbook Integrity**: Structural validation of all 35+ reference playbooks.
2. **SKILL.md Routing**: Verifies 32 command routes and 84 cross-links.
3. **Antipattern Detector**: Unit and fixture tests across slop and quality rules.
4. **Curated Typography & Fallbacks**: Archetype catalog and zero-CLS metric fallbacks.
5. **Perceptual Color Engine**: OKLCH conversions, gamut clipping, and APCA contrast math.
6. **Component Ingestion & Registry**: Sanitization, token mapping, and registry integrity.
7. **Tactile Buttons Engine**: Squish spring physics and button tokens.
8. **Human Editorial Architecture**: Anti-pill rules and asymmetric editorial layouts.
9. **Asymmetric Bento Grids**: Responsive multi-span Bento layout rhythms.
10. **Natural Language Router**: Intent routing and green-field auto-activation.
11. **Visual Sandbox & Test Bench**: Zero-dependency preview and API endpoints.
12. **Multi-Variant Prototype Engine**: `PICKER.md` spec, floating switcher, URL sync.
13. **Fluid Gestures & Spring Physics**: Apple spring solver and rubber-band curve.
14. **Viscoelastic Physics & Poisson Engine**: Stretch-and-squish trajectory math.
15. **Elastic Segmented Controls & Tabs**: 3-tier DOM hierarchy and WAAPI lifecycle.
16. **Buttons & Toggles Craft Perfection**: Concentric radii and toggle physics.
17. **Universal Design Token Compiler**: CSS vars, Tailwind v3/v4, DTCG, SCSS.
18. **Cognitive UX Laws Scanner**: Hick's, Fitts's, and Miller's friction audit.
19. **Doctor Automation**: CLI exit codes, schema validation, corruption tests.
20. **Repository Doctor Scan**: Active artifact health and drift check.

### Dimension 2: Antipattern & Anti-Slop Audit
Scans target files with `scripts/detector/detect-antipatterns.mjs`:
- **Blocking Violations**: Overused fonts (Inter/Roboto), gradient text on headings, side-tab border stripes, glowing dark mode halos, cramped padding, non-concentric radii.
- **Advisory Craft Rules**:
  - `emoji-in-ui`: Raw emojis used in buttons, badges, chips, or interactive controls.
  - `missing-favicon`: Missing `<link rel="icon">` in `<head>`.

### Dimension 3: Cognitive UX Laws & Friction Scan
Evaluates interaction ergonomics using `scripts/ux-scan.mjs`:
- **Hick's Law**: Decision latency and competing primary CTAs (max 1 primary CTA per viewport).
- **Fitts's Law**: Touch target geometry (mandatory ≥ 44 × 44px hit areas).
- **Miller's Law**: Working memory overload (max 7 ± 2 items per chunk/form section).
- **Cognitive Friction Index (CFI)**: 0–100 scale (optimal < 25).

### Dimension 4: 5-Pillar Accessibility & Technical Audit
Evaluates code per [`reference/audit.md`](audit.md):
- WCAG 2.2 AA Contrast Ratios (≥ 4.5:1 text, ≥ 3.0:1 UI boundaries).
- Distinct keyboard focus indicators (`:focus-visible`).
- Responsive viewport adaptation and container queries.
- Zero layout shift (CLS < 0.1).

### Dimension 5: Heuristic Design Critique & Craft Floor
Evaluates design per [`reference/critique.md`](critique.md) and [`reference/craft-floor.md`](craft-floor.md):
- **Dual-Mode Parity**: Physical lighting model (diffuse shadows in light; luminance stepping + hairline borders in dark).
- **Typographic Expression**: Intentional font pairing, no monospace in headings/buttons.
- **Micro-Interaction Polish**: Apple fluid spring curves (`cubic-bezier(0.32, 0.72, 0, 1)`), tactile squish.
- **Chrome Reduction**: Zero nested card borders; generous negative space.

---

## 3. Automation Script Execution

Run the report generator from the command line:

```bash
# Standard run: Audits test fixtures, runs all 20 suites, writes FRONTEND_REPORT.md
node scripts/test-report.mjs

# Audit a specific platform or application directory:
node scripts/test-report.mjs --target ./src --output FRONTEND_REPORT.md

# Emit raw machine-readable JSON:
node scripts/test-report.mjs --target ./src --json
```

---

## 4. Report Anatomy (`FRONTEND_REPORT.md`)

The generated report contains:
1. **Executive Scorecard & Grade**: Letter grade (A+, A, B, C, F), Quality Index (0–100), and summary metrics.
2. **Section 1: Master Verification Test Suites**: Detailed table of all 20 suites with durations and status.
3. **Section 2: Antipattern & Anti-Slop Audit**: Tabular breakdown of blocking violations and advisory recommendations.
4. **Section 3: Cognitive UX Laws & Ergonomics**: Observed vs. threshold values for Hick's, Fitts's, and Miller's laws.
5. **Section 4: Heuristic Design Critique**: 5-pillar craft verification status.
6. **Section 5: Prioritized Action Plan**: Concrete P0 (immediate), P1 (polish), and P2 (advisory) next steps.

---

## 5. Cross-Playbook References
- Technical Audit: [audit.md](audit.md)
- Heuristic Critique: [critique.md](critique.md)
- Antipattern Invariants: [craft-floor.md](craft-floor.md)
- Color & Dual-Mode Contrast: [colorize.md](colorize.md)
- Router & Command Matrix: [router.md](router.md)
