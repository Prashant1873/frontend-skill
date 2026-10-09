#!/usr/bin/env node
/**
 * token-compiler.mjs: CLI for Universal Design Token Compiler & Exporter.
 *
 * Compiles Frontend Skill design systems (OKLCH color ramps, curated typography,
 * harmonic oscillator springs, spacing, radii) into multiple production token formats:
 * - CSS custom properties (:root and [data-theme="dark"])
 * - Tailwind CSS v3 JavaScript preset
 * - Tailwind CSS v4 @theme directive CSS
 * - W3C DTCG / Figma Tokens JSON format
 * - SCSS variables map
 *
 * Usage:
 *   node scripts/token-compiler.mjs --format css
 *   node scripts/token-compiler.mjs --archetype editorial --hue 220 --out ./tokens
 *   node scripts/token-compiler.mjs --format dtcg --json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildTokenDictionary,
  exportCssVariables,
  exportTailwindPreset,
  exportDtcgJson,
  exportScssVariables,
  compileTokens,
  resolveArchetypeKey,
} from './lib/token-compiler.mjs';

function printHelp() {
  console.log(`
Universal Design Token Compiler & Exporter (Frontend Skill)

Usage:
  node scripts/token-compiler.mjs [options]

Options:
  --format <fmt>       Output format: "css", "tailwind3", "tailwind4", "dtcg", "scss", "all"
                       (default: "all" if --out is specified, otherwise "css")
  --out <dir>          Target directory to write compiled token files
  --archetype <name>   Typography archetype: "modern-saas", "editorial-luxury", "consumer-lifestyle",
                       "expressive-display", "swiss-authority" (or aliases: saas, editorial, humanist, etc.)
  --hue <number>       Base brand hue [0-360] (default: 240)
  --scheme <type>      Color harmony scheme: "monochromatic", "analogous", "complementary",
                       "split-complementary", "triadic" (default: "monochromatic")
  --chroma <number>    Base primary chroma (default: 0.18)
  --json               Output result as machine-readable JSON to stdout
  -h, --help           Show this help message

Examples:
  node scripts/token-compiler.mjs --format css
  node scripts/token-compiler.mjs --out ./dist/tokens --format all
  node scripts/token-compiler.mjs --archetype editorial --hue 210 --format tailwind4
  node scripts/token-compiler.mjs --format dtcg --json
`.trim());
}

function parseArgs(args) {
  const options = {
    format: null,
    out: null,
    archetype: 'modern-saas',
    hue: 240,
    scheme: 'monochromatic',
    chroma: 0.18,
    json: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--format' && i + 1 < args.length) {
      options.format = args[++i].toLowerCase();
    } else if (arg === '--out' && i + 1 < args.length) {
      options.out = args[++i];
    } else if (arg === '--archetype' && i + 1 < args.length) {
      options.archetype = args[++i];
    } else if (arg === '--hue' && i + 1 < args.length) {
      options.hue = Number(args[++i]);
    } else if (arg === '--scheme' && i + 1 < args.length) {
      options.scheme = args[++i];
    } else if (arg === '--chroma' && i + 1 < args.length) {
      options.chroma = Number(args[++i]);
    } else if (arg === '--json') {
      options.json = true;
    }
  }

  // Format default fallback
  if (!options.format) {
    options.format = options.out ? 'all' : 'css';
  }

  return options;
}

export function runCompilerCli(argv = process.argv.slice(2)) {
  const opts = parseArgs(argv);

  if (opts.help) {
    printHelp();
    return { exitCode: 0 };
  }

  const validFormats = ['css', 'tailwind3', 'tailwind4', 'dtcg', 'scss', 'all'];
  if (!validFormats.includes(opts.format)) {
    console.error(`Error: Unknown format "${opts.format}". Valid formats: ${validFormats.join(', ')}`);
    return { exitCode: 1 };
  }

  const compiled = compileTokens({
    baseHue: opts.hue,
    schemeType: opts.scheme,
    archetype: opts.archetype,
    baseChroma: opts.chroma,
  });

  // Machine-readable JSON output
  if (opts.json) {
    const payload = {
      meta: compiled.dictionary.meta,
      format: opts.format,
      dictionary: compiled.dictionary,
      artifacts: {
        css: compiled.css,
        tailwind3: compiled.tailwind3,
        tailwind4: compiled.tailwind4,
        dtcg: JSON.parse(compiled.dtcg),
        scss: compiled.scss,
      },
    };
    console.log(JSON.stringify(payload, null, 2));
    return { exitCode: 0, compiled };
  }

  // Write to directory
  if (opts.out) {
    const outDir = path.resolve(process.cwd(), opts.out);
    fs.mkdirSync(outDir, { recursive: true });

    const writtenFiles = [];

    if (opts.format === 'all' || opts.format === 'css') {
      const p = path.join(outDir, 'tokens.css');
      fs.writeFileSync(p, compiled.css, 'utf8');
      writtenFiles.push(p);
    }
    if (opts.format === 'all' || opts.format === 'tailwind3') {
      const p = path.join(outDir, 'tailwind.config.js');
      fs.writeFileSync(p, compiled.tailwind3, 'utf8');
      writtenFiles.push(p);
    }
    if (opts.format === 'all' || opts.format === 'tailwind4') {
      const p = path.join(outDir, 'tailwind-theme.css');
      fs.writeFileSync(p, compiled.tailwind4, 'utf8');
      writtenFiles.push(p);
    }
    if (opts.format === 'all' || opts.format === 'dtcg') {
      const p = path.join(outDir, 'tokens.json');
      fs.writeFileSync(p, compiled.dtcg, 'utf8');
      writtenFiles.push(p);
    }
    if (opts.format === 'all' || opts.format === 'scss') {
      const p = path.join(outDir, '_tokens.scss');
      fs.writeFileSync(p, compiled.scss, 'utf8');
      writtenFiles.push(p);
    }

    console.log(`Design tokens compiled successfully to ${opts.out}:`);
    for (const f of writtenFiles) {
      console.log(`  - ${path.basename(f)}`);
    }
    return { exitCode: 0, compiled, writtenFiles };
  }

  // Write selected format to stdout
  switch (opts.format) {
    case 'css':
      console.log(compiled.css);
      break;
    case 'tailwind3':
      console.log(compiled.tailwind3);
      break;
    case 'tailwind4':
      console.log(compiled.tailwind4);
      break;
    case 'dtcg':
      console.log(compiled.dtcg);
      break;
    case 'scss':
      console.log(compiled.scss);
      break;
    case 'all':
      console.log('/* === CSS Variables === */');
      console.log(compiled.css);
      console.log('\n/* === Tailwind v4 @theme === */');
      console.log(compiled.tailwind4);
      break;
  }

  return { exitCode: 0, compiled };
}

// Direct execution guard
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const result = runCompilerCli();
  if (result?.exitCode !== 0) {
    process.exit(result?.exitCode ?? 1);
  }
}
