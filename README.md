# Frontend Skill 🎨⚡

> **Unified Master Engineering & Aesthetic Design System for AI Coding Agents and Frontend Engineers.**  
> Crafts production web apps, fluid components, design systems, and rock-solid accessible interfaces while ruthlessly eliminating AI slop.

[![Runtime](https://img.shields.io/badge/Node.js-18%2B%20ESM-43853d?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Dependencies](https://img.shields.io/badge/dependencies-0%20external-brightgreen)](#zero-dependency-architecture)
[![Test Suite](https://img.shields.io/badge/verification-100%25%20passing-success)](#verification-pipeline)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

**Frontend Skill** transforms coding agents (Antigravity, Claude Code, Cursor, Codex, OpenCode) from generic code generators into senior design engineers. It enforces strict typography scales, purposeful layout hierarchies, Apple fluid spring physics, cognitive ergonomics, and automated AST antipattern detection.

### 🛡️ Why Frontend Skill?

Standard AI output frequently suffers from **"AI Slop"**:
- Identical generic fonts (unintentional Inter or Roboto defaults)
- Overused purple/indigo floating gradient pills
- Nested border cards inside border cards
- Linear CSS transitions (`transition: all 0.3s ease`) that feel robotic
- Broken accessibility contrast ratios and missing keyboard focus states

Frontend Skill eliminates these tells through:
1. **Anti-Default Design Dials**: Explicit Variance, Motion Intensity, and Density dials tuned per product intent.
2. **Craft Floor Standards**: Non-negotiable micro-spacing rhythm, optical alignment, and tactile feedback.
3. **Apple Fluid Interfaces**: Spring physics based on Apple WWDC guidelines with damping ratios and interruptible state.
4. **13 Cognitive UX Laws**: Fitts, Hick, Miller, Jakob, Doherty Threshold, and Gestalt grouping.
5. **Automated Mechanical Detector**: Native Node.js AST and regex engine flagging visual regressions and code slop.
6. **Multi-Variant Prototyping**: Generating 3 distinct aesthetic directions before committing to implementation.

---

## 🚀 Quick Run Guide & Command Matrix

Invoke workflows through natural conversation or specific subcommands:

| Command / Trigger | Scope | Description |
|---|---|---|
| `frontend design [brief]` | Aesthetic Direction | Analyzes brief, outputs Design Read, tunes Dials, and selects aesthetic direction. |
| `frontend polish [target]` | Visual Finishing | Micro-alignment pass: optical balance, spacing rhythm, hover states, border continuity. |
| `frontend critique [target]` | UX Evaluation | Evaluates UI against 13 cognitive laws and visual heuristics with scored feedback. |
| `frontend audit [target]` | Technical Audit | Scans WCAG 2.2 AA accessibility, responsive adaptation, performance, and layout stability. |
| `frontend clarify [target]` | UX Ergonomics | Sharpens microcopy, error states, empty states, labels, and cognitive clarity. |
| `frontend distill [target]` | Simplification | Strips visual noise, redundant chrome, nested card containers, and unearned decoration. |
| `frontend bolder [target]` | Visual Punch | Infuses distinct personality, expressive typography, bold contrast, and anchor moments. |
| `frontend quieter [target]` | Restraint | Calms overstimulated, busy, hyper-animated, or neon-heavy interfaces. |
| `frontend harden [target]` | Defensive UI | Adds boundary states: text truncation, extreme viewports, loading skeletons, error fallback. |
| `frontend engineer [target]` | Architecture | Component modularity, state machines, clean tokens, accessibility, and zero-drift structure. |
| `frontend apple [target]` | Fluid Physics | Tunes spring physics (damping, response, mass) for fluid gestures and organic transitions. |
| `frontend ux [target]` | Cognitive Review | Audits ergonomics against Fitts's Law, Hick's Law, Miller's 7±2, and Gestalt proximity. |
| `frontend pick-lib [tech]` | Library Selection | Recommends optimal UI component library based on framework and project constraints. |
| `frontend prototype [target]` | Fast Exploration | Explores 3 radically distinct visual variants in parallel for rapid user selection. |

---

## 📦 Installation & Agent Setup

Frontend Skill is packaged as a universal skill compliant across all major agent environments.

### 1. Google Antigravity / Gemini CLI
Clone or symlink the repository into your global or workspace skills directory:
```bash
# Global installation (available to all workspaces)
git clone https://github.com/username/frontend-skill.git ~/.gemini/config/skills/frontend

# Or Workspace installation (active in current project)
git clone https://github.com/username/frontend-skill.git .agents/skills/frontend
```

### 2. Claude Code
Install into your Claude global or project skills root:
```bash
# Global installation
git clone https://github.com/username/frontend-skill.git ~/.claude/skills/frontend

# Or Project installation
git clone https://github.com/username/frontend-skill.git .claude/skills/frontend
```

### 3. Cursor
Add to your project's `.cursor/skills/` or reference in `.cursorrules`:
```bash
git clone https://github.com/username/frontend-skill.git .cursor/skills/frontend
```
In your `.cursorrules`:
```markdown
When designing, building, or reviewing any frontend code (HTML, CSS, React, Vue, Svelte, Tailwind), 
strictly follow the guidelines and playbooks in .cursor/skills/frontend/SKILL.md.
```

### 4. OpenAI Codex / OpenCode / Standalone
Clone into your repository or skills directory and reference `SKILL.md` in your project `AGENTS.md`.

---

## 🛠️ CLI Tools & Verification Pipeline

Frontend Skill includes standalone verification engines that run anywhere Node.js is installed.

### Master Verification Runner
Executes all 5 test and validation suites with aggregated reporting:
```bash
node scripts/test-all.mjs
```

### Run Antipattern Detector
Scan any HTML or CSS file for slop patterns (overused fonts, bad contrast, jerky animations):
```bash
node scripts/detector/detect-antipatterns.mjs --target src/
```

### Health & Drift Doctor
Check project configuration, design tokens, and playbook integrity:
```bash
node scripts/doctor.mjs
```

### Playbook & Routing Validation
Validate all 34 playbooks and SKILL.md command dispatch contracts:
```bash
node scripts/validate-playbooks.mjs
node scripts/validate-routing.mjs
```

---

## ⚡ Zero-Dependency Architecture

Frontend Skill requires **zero external npm packages**:
- Built 100% with native **Node.js ESM standard library** (`node:fs`, `node:path`, `node:child_process`, `node:perf_hooks`, `node:crypto`).
- Runs identically on **macOS**, **Linux**, and **Windows** (PowerShell, Bash, Zsh).
- Zero install delays (`npm install` is never needed).
- Instantly portable into any CI/CD pipeline or isolated agent sandbox.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
