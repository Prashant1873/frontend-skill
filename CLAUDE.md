# Claude Code Directives: Frontend Skill

These guidelines instruct Anthropic Claude Code when working in this project.

## 🎯 Mandatory Skill Activation

Whenever user requests involve building, modifying, or styling web UIs, components, or pages:
1. Immediately consult [`SKILL.md`](SKILL.md) and adhere to its design dials and craft guidelines.
2. For specific sub-tasks, execute the corresponding subcommands:
   - Visual polishing: see [`reference/polish.md`](reference/polish.md)
   - UX critique: see [`reference/critique.md`](reference/critique.md)
   - Accessibility & technical audit: see [`reference/audit.md`](reference/audit.md)
   - Simplification & chrome reduction: see [`reference/distill.md`](reference/distill.md)
   - Apple fluid motion: see [`reference/animate.md`](reference/animate.md)

## 🛡️ Anti-Slop & Quality Enforcement

- Strictly avoid default AI aesthetics (generic Inter/Roboto fonts, gratuitous purple pills, repetitive nested cards).
- All transitions must use organic Apple fluid spring physics or refined cubic beziers.
- Run the antipattern detector over touched files before finishing:
  ```bash
  node scripts/detector/detect-antipatterns.mjs --target <changed files>
  ```
- Run full suite validation to prevent regressions:
  ```bash
  node scripts/test-all.mjs
  ```
