#!/usr/bin/env node

/**
 * Human-Craft UI Engine: Interactive Component Visual Sandbox & Test Bench.
 * Zero-dependency local development server and browser test bench for:
 *   - Tactile spring buttons (:active squish-and-stretch deformations)
 *   - Curated typography archetypes & zero-CLS metric fallbacks
 *   - Perceptual OKLCH color engine & contrast guarantee
 *   - Asymmetric Bento & fluid editorial grid systems
 *   - Anti-pill human editorial architecture
 *   - Vetted human component registry catalog
 *   - Multi-variant prototype switcher preview (PICKER.md)
 *   - Apple fluid gestures, momentum springs & tactile toggles
 *   - Universal design token compiler & exporter
 *
 * Usage:
 *   node scripts/sandbox.mjs           # Start server on default port (3333)
 *   node scripts/sandbox.mjs --port 8080 # Custom port
 *   node scripts/sandbox.mjs --open    # Open in browser automatically
 *   node scripts/sandbox.mjs --check   # Headless smoke test on port 0 and exit 0
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { compileTokens } from './lib/token-compiler.mjs';
import { SPRING_PRESETS } from './lib/spring-physics.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function getHtmlContent() {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Human-Craft UI Sandbox & Test Bench</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/lib/buttons.css">
  <link rel="stylesheet" href="/lib/editorial.css">
  <link rel="stylesheet" href="/lib/bento.css">
  <link rel="stylesheet" href="/lib/picker.css">
  <link rel="stylesheet" href="/lib/gestures.css">
  <style>
    :root {
      --bg-base: #090d16;
      --bg-surface: #111827;
      --bg-surface-elevated: #1f2937;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-strong: rgba(255, 255, 255, 0.16);
      --text-main: #f9fafb;
      --text-muted: #9ca3af;
      --accent: #38bdf8;
      --accent-hover: #0284c7;
      --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-display: 'Instrument Serif', Georgia, serif;
      --font-tech: 'Space Grotesk', monospace;
    }

    [data-theme="light"] {
      --bg-base: #f8fafc;
      --bg-surface: #ffffff;
      --bg-surface-elevated: #f1f5f9;
      --border-subtle: rgba(0, 0, 0, 0.08);
      --border-strong: rgba(0, 0, 0, 0.16);
      --text-main: #0f172a;
      --text-muted: #64748b;
      --accent: #0284c7;
      --accent-hover: #0369a1;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-base);
      color: var(--text-main);
      font-family: var(--font-body);
      line-height: 1.5;
      padding: 2rem 1.5rem 5rem;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Header & Navigation */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .brand-mark {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--accent), #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #fff;
      font-size: 1.25rem;
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .brand-tag {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .controls {
      display: flex;
      gap: 0.75rem;
    }

    .theme-toggle {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-strong);
      color: var(--text-main);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      min-inline-size: 44px;
      min-block-size: 44px;
      transition: background 0.15s ease;
    }

    .theme-toggle:hover {
      background: var(--border-strong);
    }

    /* Section Styling */
    .bench-section {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .bench-header {
      margin-bottom: 1.5rem;
    }

    .bench-label {
      font-family: var(--font-tech);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: 0.25rem;
      display: block;
    }

    .bench-title {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }

    .bench-desc {
      color: var(--text-muted);
      font-size: 0.9375rem;
      max-width: 700px;
    }

    /* Buttons Row */
    .button-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .metrics-panel {
      background: var(--bg-surface-elevated);
      padding: 1rem 1.5rem;
      border-radius: 10px;
      font-family: var(--font-tech);
      font-size: 0.8125rem;
      color: var(--text-muted);
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .metric-value {
      color: var(--text-main);
      font-weight: 700;
    }

    /* Typography Bench */
    .type-samples {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    .type-card {
      background: var(--bg-surface-elevated);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--border-subtle);
    }

    .type-archetype {
      font-family: var(--font-tech);
      font-size: 0.75rem;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }

    .type-preview-display {
      font-family: var(--font-display);
      font-size: 2.25rem;
      line-height: 1.1;
      margin-bottom: 0.5rem;
    }

    .type-preview-tech {
      font-family: var(--font-tech);
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .type-preview-body {
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--text-muted);
    }

    /* Color Swatches */
    .color-swatches {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .swatch {
      border-radius: 10px;
      padding: 1rem;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid var(--border-subtle);
    }

    .swatch-label {
      font-family: var(--font-tech);
      font-size: 0.75rem;
      font-weight: 700;
    }

    .swatch-value {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    /* Live Interactive Prototype Stage */
    .prototype-stage {
      background: var(--bg-surface-elevated);
      border-radius: 12px;
      padding: 2.5rem;
      text-align: center;
      margin-bottom: 1.5rem;
      border: 1px solid var(--border-subtle);
      min-height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .prototype-stage-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .prototype-stage-desc {
      color: var(--text-muted);
      max-width: 500px;
    }

    /* Live Gesture Playground */
    .gesture-playground {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .gesture-playground { grid-template-columns: 1fr; }
    }

    .gesture-box {
      background: var(--bg-surface-elevated);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      min-height: 200px;
    }

    /* Code Preview Box */
    .code-preview-box {
      background: #040711;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 1.25rem;
      font-family: var(--font-tech);
      font-size: 0.8125rem;
      color: #93c5fd;
      overflow-x: auto;
      max-height: 220px;
      white-space: pre;
    }

    /* Footer */
    footer {
      text-align: center;
      padding-top: 2rem;
      color: var(--text-muted);
      font-size: 0.8125rem;
      font-family: var(--font-tech);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="brand-mark">HC</div>
        <div>
          <div class="brand-title">Human-Craft UI Sandbox & Test Bench</div>
          <div class="brand-tag">Milestone v3.0 • Multi-Variant Prototyping & Fluid Gesture Physics</div>
        </div>
      </div>
      <div class="controls">
        <button id="themeToggle" class="theme-toggle" type="button">Toggle Theme</button>
      </div>
    </header>

    <!-- SECTION 1: TACTILE BUTTONS BENCH -->
    <section class="bench-section" id="bench-buttons">
      <div class="bench-header">
        <span class="bench-label">Interactive Engine • Phase 13</span>
        <h2 class="bench-title">Tactile & Micro-Interactive Buttons</h2>
        <p class="bench-desc">GPU-accelerated squish-and-stretch active deformations with fluid spring recovery curves.</p>
      </div>
      <div class="button-row">
        <button class="btn btn-primary btn-squish" id="btnTest1" type="button">Primary Squish</button>
        <button class="btn btn-secondary btn-squish" id="btnTest2" type="button">Secondary Action</button>
        <button class="btn btn-subtle btn-squish" id="btnTest3" type="button">Subtle Surface</button>
      </div>
      <div class="metrics-panel">
        <div>Deformation: <span class="metric-value">scale(1.03, 0.94)</span></div>
        <div>Physics: <span class="metric-value">Fluid Spring Recovery</span></div>
        <div>Total Interactions: <span class="metric-value" id="clickCount">0</span></div>
      </div>
    </section>

    <!-- SECTION 2: CURATED TYPOGRAPHY BENCH -->
    <section class="bench-section" id="bench-typography">
      <div class="bench-header">
        <span class="bench-label">Design System • Phase 10</span>
        <h2 class="bench-title">Curated Typography & Archetype Pairings</h2>
        <p class="bench-desc">Characterful typefaces eliminating generic AI defaults with zero-CLS metric fallbacks.</p>
      </div>
      <div class="type-samples">
        <div class="type-card">
          <div class="type-archetype">Editorial Display</div>
          <div class="type-preview-display">Instrument Serif</div>
          <p class="type-preview-body">Distinguished, organic serif display with warm human cadence.</p>
        </div>
        <div class="type-card">
          <div class="type-archetype">Technical Interface</div>
          <div class="type-preview-tech">Space Grotesk</div>
          <p class="type-preview-body">Structured, precise geometric styling for engineering surfaces.</p>
        </div>
        <div class="type-card">
          <div class="type-archetype">Humanist Reading</div>
          <div class="type-preview-display" style="font-family: var(--font-body); font-weight: 700; font-size: 1.75rem;">Plus Jakarta Sans</div>
          <p class="type-preview-body">Crisp, accessible body text engineered for extended screen clarity.</p>
        </div>
      </div>
    </section>

    <!-- SECTION 3: OKLCH COLOR ENGINE BENCH -->
    <section class="bench-section" id="bench-colors">
      <div class="bench-header">
        <span class="bench-label">Perceptual Colors • Phase 11</span>
        <h2 class="bench-title">Perceptual OKLCH Color Engine & Contrast Guarantee</h2>
        <p class="bench-desc">Harmonic lightness stepping with guaranteed WCAG 2.2 AA and APCA perceptual contrast.</p>
      </div>
      <div class="color-swatches">
        <div class="swatch" style="background: #090d16; color: #fff;">
          <div class="swatch-label">Surface 950</div>
          <div class="swatch-value">L: 0.12 C: 0.02</div>
        </div>
        <div class="swatch" style="background: #1e293b; color: #fff;">
          <div class="swatch-label">Elevated 800</div>
          <div class="swatch-value">L: 0.25 C: 0.03</div>
        </div>
        <div class="swatch" style="background: #0284c7; color: #fff;">
          <div class="swatch-label">Accent 600</div>
          <div class="swatch-value">L: 0.58 C: 0.14</div>
        </div>
        <div class="swatch" style="background: #38bdf8; color: #000;">
          <div class="swatch-label">Highlight 400</div>
          <div class="swatch-value">L: 0.76 C: 0.12</div>
        </div>
      </div>
      <div class="metrics-panel">
        <div>Body Contrast: <span class="metric-value">14.2:1 (Pass AAA)</span></div>
        <div>Control Contrast: <span class="metric-value">5.8:1 (Pass AA)</span></div>
        <div>Perceptual Space: <span class="metric-value">OKLCH Gamut</span></div>
      </div>
    </section>

    <!-- SECTION 4: ASYMMETRIC BENTO GRID BENCH -->
    <section class="bench-section" id="bench-bento">
      <div class="bench-header">
        <span class="bench-label">Layout Architecture • Phase 15</span>
        <h2 class="bench-title">Asymmetric Bento Grid System</h2>
        <p class="bench-desc">Multi-span compositions breaking repetitive uniform 3-card templates with rhythmic focal points.</p>
      </div>
      <div class="bento-grid">
        <div class="bento-card bento-card-hero bento-span-2">
          <div class="bento-card-header">
            <span class="bento-kicker">Featured Focus</span>
            <h3 class="bento-card-title">Anchor Intelligence Module</h3>
          </div>
          <p class="bento-card-body">A 2-span wide hero card establishing primary visual focus with subtle surface elevation.</p>
        </div>
        <div class="bento-card">
          <div class="bento-card-header">
            <span class="bento-kicker">Metric</span>
            <h3 class="bento-card-title">99.98%</h3>
          </div>
          <p class="bento-card-body">High-precision layout integrity.</p>
        </div>
        <div class="bento-card">
          <div class="bento-card-header">
            <span class="bento-kicker">Telemetry</span>
            <h3 class="bento-card-title">Instant</h3>
          </div>
          <p class="bento-card-body">Spring response under 12ms.</p>
        </div>
        <div class="bento-card bento-span-2">
          <div class="bento-card-header">
            <span class="bento-kicker">Flow</span>
            <h3 class="bento-card-title">Editorial Rhythm</h3>
          </div>
          <p class="bento-card-body">Natural eye travel across varied card proportions.</p>
        </div>
      </div>
    </section>

    <!-- SECTION 5: ANTI-PILL EDITORIAL ARCHITECTURE -->
    <section class="bench-section" id="bench-editorial">
      <div class="bench-header">
        <span class="bench-label">Editorial Craft • Phase 14</span>
        <h2 class="bench-title">Anti-Pill Human Editorial Architecture</h2>
        <p class="bench-desc">Organic balance, typography scale, and hairline dividers replacing generic floating badge pills.</p>
      </div>
      <div class="editorial-header">
        <h1 class="editorial-title" style="font-family: var(--font-display); font-size: 3rem; margin-bottom: 0.5rem;">
          Natural Typography Speaks
        </h1>
        <div class="editorial-divider"></div>
        <p class="editorial-lead" style="color: var(--text-muted); font-size: 1.125rem;">
          Headlines carry their own structural authority without artificial AI pill tags or floating kicker pills.
        </p>
      </div>
    </section>

    <!-- SECTION 6: COMPONENT REGISTRY INSPECTOR -->
    <section class="bench-section" id="bench-registry">
      <div class="bench-header">
        <span class="bench-label">Registry Catalog • Phase 12</span>
        <h2 class="bench-title">Human Component Registry Catalog</h2>
        <p class="bench-desc">Pre-vetted aesthetic primitives with token mapping and zero third-party runtime dependencies.</p>
      </div>
      <div class="type-samples" id="registryList">
        <div class="type-card"><div class="type-preview-body">Loading registered components...</div></div>
      </div>
    </section>

    <!-- SECTION 7: MULTI-VARIANT PROTOTYPE SWITCHER (PICKER.md) -->
    <section class="bench-section" id="bench-prototypes">
      <div class="bench-header">
        <span class="bench-label">Prototyping Engine • Phase 19</span>
        <h2 class="bench-title">Multi-Variant Prototype Switcher</h2>
        <p class="bench-desc">Interactive variant preview cycling 4 diverging design directions with instant state swap and zero layout shift.</p>
      </div>
      <div class="prototype-stage" id="prototypeStage">
        <h3 class="prototype-stage-title" id="prototypeVariantTitle">Persuade Direction</h3>
        <p class="prototype-stage-desc" id="prototypeVariantDesc">High-conversion editorial hero with warm typography, asymmetric rhythm, and clear primary CTA hierarchy.</p>
      </div>
      <div class="proto-picker" style="position: static; margin: 0 auto; transform: none; display: inline-flex;">
        <div class="proto-picker-highlight" id="protoHighlight"></div>
        <button class="proto-picker-item" data-variant="1" data-active="true" type="button">1 Persuade</button>
        <button class="proto-picker-item" data-variant="2" type="button">2 Operate</button>
        <button class="proto-picker-item" data-variant="3" type="button">3 Read</button>
        <button class="proto-picker-item" data-variant="4" type="button">4 Experience</button>
        <div class="proto-picker-divider"></div>
        <button class="proto-picker-replay" id="protoReplayBtn" title="Replay" type="button">↻</button>
      </div>
      <div class="metrics-panel" style="margin-top: 1.5rem;">
        <div>Active Direction: <span class="metric-value" id="protoActiveName">Persuade</span></div>
        <div>URL Sync: <span class="metric-value">?v=1</span></div>
        <div>Switch Latency: <span class="metric-value">&lt; 1ms (Instant DOM Swap)</span></div>
      </div>
    </section>

    <!-- SECTION 8: APPLE FLUID GESTURES & PHYSICAL MOTION BENCH -->
    <section class="bench-section" id="bench-gestures">
      <div class="bench-header">
        <span class="bench-label">Physical Motion • Phase 20</span>
        <h2 class="bench-title">Apple Fluid Gestures & Spring Physics</h2>
        <p class="bench-desc">Analytical harmonic oscillator solver with momentum velocity projection, logarithmic rubber-banding resistance, and tactile squash toggles.</p>
      </div>
      <div class="gesture-playground">
        <div class="gesture-box">
          <span class="bench-label">Tactile Physics Toggle</span>
          <label class="physics-toggle" style="cursor: pointer;">
            <input type="checkbox" id="physicsToggleInput" checked>
            <span class="physics-toggle-track">
              <span class="physics-toggle-thumb"></span>
            </span>
          </label>
          <p style="font-size: 0.8125rem; color: var(--text-muted);">Deformation: <span class="metric-value">scale(1.18, 0.88)</span> on drag</p>
        </div>
        <div class="gesture-box">
          <span class="bench-label">Sheet Handle Drag Sim</span>
          <div class="sheet-handle" id="demoSheetHandle" style="position: relative; width: 60px; height: 6px; background: var(--accent); border-radius: 9999px; cursor: grab; touch-action: none;"></div>
          <p style="font-size: 0.8125rem; color: var(--text-muted);">Solver: <span class="metric-value">createAppleSpring(response: 0.35s, damping: 1.0)</span></p>
        </div>
      </div>
      <div class="metrics-panel">
        <div>Release Velocity: <span class="metric-value" id="gestureVelX">0 px/s</span></div>
        <div>Settling Duration: <span class="metric-value" id="gestureSettle">350ms</span></div>
        <div>Rubber Band Curve: <span class="metric-value">Logarithmic (c = 0.55)</span></div>
      </div>
    </section>

    <!-- SECTION 9: UNIVERSAL DESIGN TOKEN COMPILER BENCH -->
    <section class="bench-section" id="bench-tokens">
      <div class="bench-header">
        <span class="bench-label">Token System • Phase 21</span>
        <h2 class="bench-title">Universal Design Token Compiler</h2>
        <p class="bench-desc">Live cross-compilation of OKLCH colors, typography, and harmonic springs into CSS variables, Tailwind v4 @theme, and W3C DTCG JSON.</p>
      </div>
      <div class="code-preview-box" id="tokenPreviewBox">Loading universal design tokens...</div>
      <div class="metrics-panel" style="margin-top: 1.5rem;">
        <div>Export Targets: <span class="metric-value">CSS, Tailwind v3/v4, DTCG JSON, SCSS</span></div>
        <div>OKLCH Ramps: <span class="metric-value">11 Luminance Steps</span></div>
        <div>Figma Tokens: <span class="metric-value">W3C Compliant ($value, $type)</span></div>
      </div>
    </section>

    <footer>
      Human-Craft UI Engine • High-Velocity Autonomous Development Bench • 2026
    </footer>
  </div>

  <script>
    // Theme toggle logic
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
    });

    // Button click counter
    let clicks = 0;
    const clickCount = document.getElementById('clickCount');
    ['btnTest1', 'btnTest2', 'btnTest3'].forEach(id => {
      document.getElementById(id).addEventListener('click', () => {
        clicks++;
        clickCount.textContent = clicks;
      });
    });

    // Load registry
    fetch('/api/registry')
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById('registryList');
        if (!data || !Array.isArray(data.components)) return;
        list.innerHTML = data.components.slice(0, 6).map(c => \`
          <div class="type-card">
            <div class="type-archetype">\${c.category || 'General'}</div>
            <div class="type-preview-tech" style="font-size: 1.125rem; margin-bottom: 0.25rem;">\${c.name}</div>
            <p class="type-preview-body" style="font-size: 0.8125rem;">\${c.description}</p>
          </div>
        \`).join('');
      })
      .catch(() => {});

    // Prototype switcher interaction
    const variantDetails = {
      '1': { title: 'Persuade Direction', desc: 'High-conversion editorial hero with warm typography, asymmetric rhythm, and clear primary CTA hierarchy.' },
      '2': { title: 'Operate Direction', desc: 'High-density operational cockpit for SaaS power users with zero-waste layouts and rapid filter controls.' },
      '3': { title: 'Read Direction', desc: 'Long-form editorial typography with serene line lengths, high contrast, and zero AI visual noise.' },
      '4': { title: 'Experience Direction', desc: 'Cinematic creative showcase commanding immediate visual authority with fluid motion springs.' },
    };

    const variantButtons = document.querySelectorAll('.proto-picker-item');
    const stageTitle = document.getElementById('prototypeVariantTitle');
    const stageDesc = document.getElementById('prototypeVariantDesc');
    const activeName = document.getElementById('protoActiveName');

    variantButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        variantButtons.forEach(b => b.removeAttribute('data-active'));
        btn.setAttribute('data-active', 'true');
        const v = btn.getAttribute('data-variant');
        const info = variantDetails[v] || variantDetails['1'];
        stageTitle.textContent = info.title;
        stageDesc.textContent = info.desc;
        activeName.textContent = info.title.replace(' Direction', '');
      });
    });

    // Load compiled tokens preview
    fetch('/api/tokens?format=tailwind4')
      .then(res => res.text())
      .then(css => {
        const box = document.getElementById('tokenPreviewBox');
        if (box) {
          box.textContent = css.slice(0, 800) + '\\n/* ...and 40+ more design tokens */';
        }
      })
      .catch(() => {});
  </script>
</body>
</html>`;
}

export function createSandboxServer() {
  return http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, 'http://localhost');
    const pathname = parsedUrl.pathname;

    // API Routes
    if (pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), version: '3.0.0' }));
      return;
    }

    if (pathname === '/api/registry') {
      const registryPath = path.join(REPO_ROOT, 'scripts', 'data', 'component-registry', 'registry.json');
      try {
        const data = fs.readFileSync(registryPath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Registry unavailable' }));
      }
      return;
    }

    if (pathname === '/api/fonts') {
      const fontsPath = path.join(REPO_ROOT, 'scripts', 'data', 'curated-fonts.json');
      try {
        const data = fs.readFileSync(fontsPath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Fonts catalog unavailable' }));
      }
      return;
    }

    if (pathname === '/api/prototypes') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        variants: ['Persuade', 'Operate', 'Read', 'Experience'],
        description: 'Multi-variant diverging visual directions per PICKER.md',
      }));
      return;
    }

    if (pathname === '/api/tokens') {
      const format = parsedUrl.searchParams.get('format') || 'json';
      const hue = Number(parsedUrl.searchParams.get('hue') || 240);
      const archetype = parsedUrl.searchParams.get('archetype') || 'modern-saas';
      const compiled = compileTokens({ baseHue: hue, archetype });

      if (format === 'css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(compiled.css);
      } else if (format === 'tailwind4') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(compiled.tailwind4);
      } else if (format === 'dtcg') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(compiled.dtcg);
      } else if (format === 'scss') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(compiled.scss);
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(compiled, null, 2));
      }
      return;
    }

    if (pathname === '/api/gestures') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        presets: SPRING_PRESETS,
        standards: {
          minTouchTargetPx: 44,
          rubberBandResistance: 0.55,
          interruptible: true,
        },
      }));
      return;
    }

    // Static Asset Serving from scripts/lib/
    if (pathname.startsWith('/lib/')) {
      const fileName = path.basename(pathname);
      const filePath = path.join(REPO_ROOT, 'scripts', 'lib', fileName);
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        const mime = MIME_TYPES[ext] || 'text/plain';
        const content = fs.readFileSync(filePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': mime });
        res.end(content);
        return;
      }
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    // Root SPA
    if (pathname === '/' || pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(getHtmlContent());
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  });
}

function openBrowser(url) {
  const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${start} ${url}`, (err) => {
    if (err) {
      console.log(`Could not automatically open browser: ${err.message}`);
    }
  });
}

async function runCheck() {
  const server = createSandboxServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}/`;

  try {
    const res = await new Promise((resolve, reject) => {
      http.get(url, (response) => {
        let body = '';
        response.on('data', (chunk) => { body += chunk; });
        response.on('end', () => resolve({ statusCode: response.statusCode, body }));
      }).on('error', reject);
    });

    if (res.statusCode !== 200) {
      throw new Error(`Expected 200 OK, got ${res.statusCode}`);
    }

    if (!res.body.includes('Human-Craft UI Sandbox & Test Bench')) {
      throw new Error('Sandbox title signature missing from HTML payload');
    }

    if (!res.body.includes('Tactile & Micro-Interactive Buttons')) {
      throw new Error('Buttons section signature missing from HTML payload');
    }

    if (!res.body.includes('Multi-Variant Prototype Switcher')) {
      throw new Error('Prototype switcher signature missing from HTML payload');
    }

    if (!res.body.includes('Apple Fluid Gestures & Spring Physics')) {
      throw new Error('Gestures bench signature missing from HTML payload');
    }

    if (!res.body.includes('Universal Design Token Compiler')) {
      throw new Error('Token compiler signature missing from HTML payload');
    }

    console.log('✓ Sandbox smoke test passed (HTTP 200 OK, payload verified on port ' + port + ')');
    await new Promise((resolve) => server.close(resolve));
    process.exit(0);
  } catch (err) {
    console.error('✗ Sandbox check failed:', err.message);
    server.close();
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--check') || args.includes('--test')) {
    runCheck();
    return;
  }

  let port = 3333;
  const portIdx = args.indexOf('--port');
  if (portIdx !== -1 && args[portIdx + 1]) {
    port = parseInt(args[portIdx + 1], 10) || 3333;
  } else if (process.env.PORT) {
    port = parseInt(process.env.PORT, 10) || 3333;
  }

  const server = createSandboxServer();
  server.listen(port, () => {
    const url = `http://localhost:${port}/`;
    console.log('========================================================================');
    console.log('         HUMAN-CRAFT UI ENGINE: INTERACTIVE VISUAL SANDBOX              ');
    console.log('========================================================================');
    console.log(`✓ Local server running at: ${url}`);
    console.log('  - Live tactile buttons (:active squish spring physics)');
    console.log('  - Curated font archetypes & zero-CLS fallbacks');
    console.log('  - OKLCH perceptual colors & WCAG AA contrast check');
    console.log('  - Asymmetric Bento & fluid editorial grids');
    console.log('  - Anti-pill editorial header structures');
    console.log('  - Multi-variant prototype switcher preview (PICKER.md)');
    console.log('  - Apple fluid gestures, velocity projection & tactile toggles');
    console.log('  - Universal design token compiler & exporter');
    console.log('Press Ctrl+C to stop.\n');

    if (args.includes('--open')) {
      openBrowser(url);
    }
  });
}

const isMain = process.argv[1] && path.basename(process.argv[1]) === 'sandbox.mjs';
if (isMain) {
  main();
}
