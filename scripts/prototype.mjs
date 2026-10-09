#!/usr/bin/env node
/**
 * Prototype CLI — Multi-Variant Prototype Harness Scaffolder
 *
 * Implements PICKER.md interactive multi-variant switcher generator.
 *
 * Usage:
 *   node scripts/prototype.mjs --title "Checkout Flow" --variants "Quiet,Editorial,Playful" --out prototype.html
 *   node scripts/prototype.mjs --open
 */

import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { scaffoldPrototypeHtml, normalizeVariants } from './lib/picker.mjs';

function printHelp() {
  console.log(`
Prototype Harness Scaffolder (PICKER.md Engine)

Usage:
  node scripts/prototype.mjs [options]

Options:
  --title <name>         Feature title for the prototype (default: "Prototype Variant Preview")
  --variants <list>      Comma-separated variant names (default: "Persuade,Operate,Read,Experience")
  --out <file>           Output HTML filepath (default: "prototype.html")
  --position <pos>       Picker position: "bottom" or "top" (default: "bottom")
  --no-replay            Omit the replay button and divider
  --json                 Print generated variant structure as JSON
  --open                 Open the generated HTML in default browser
  -h, --help             Show this help message

Examples:
  node scripts/prototype.mjs --title "Hero Section" --variants "Editorial,Kinetic,Cockpit"
  node scripts/prototype.mjs --out preview.html --open
`.trim());
}

function parseArgs(args) {
  const options = {
    title: 'Prototype Variant Preview',
    variants: ['Persuade', 'Operate', 'Read', 'Experience'],
    out: 'prototype.html',
    position: 'bottom',
    replay: true,
    json: false,
    open: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--title' && i + 1 < args.length) {
      options.title = args[++i];
    } else if (arg === '--variants' && i + 1 < args.length) {
      options.variants = args[++i].split(',').map(s => s.trim()).filter(Boolean);
    } else if (arg === '--out' && i + 1 < args.length) {
      options.out = args[++i];
    } else if (arg === '--position' && i + 1 < args.length) {
      options.position = args[++i];
    } else if (arg === '--no-replay') {
      options.replay = false;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--open') {
      options.open = true;
    }
  }

  return options;
}

export function generatePrototype(options) {
  const normVariants = normalizeVariants(options.variants);
  const html = scaffoldPrototypeHtml(options.title, normVariants, {
    position: options.position,
    replay: options.replay
  });

  const outPath = path.resolve(process.cwd(), options.out);
  fs.writeFileSync(outPath, html, 'utf8');

  return {
    outPath,
    title: options.title,
    variants: normVariants.map(v => v.label),
    position: options.position,
    replay: options.replay
  };
}

function openInBrowser(filePath) {
  const startCmd = process.platform === 'win32'
    ? `start "" "${filePath}"`
    : process.platform === 'darwin'
      ? `open "${filePath}"`
      : `xdg-open "${filePath}"`;

  exec(startCmd, (err) => {
    if (err) {
      console.error(`Note: Could not automatically open browser: ${err.message}`);
    }
  });
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const result = generatePrototype(options);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`✓ Prototype harness generated: ${result.outPath}`);
    console.log(`  Title: ${result.title}`);
    console.log(`  Variants (${result.variants.length}): ${result.variants.join(' | ')}`);
    console.log(`  Position: ${result.position}`);
  }

  if (options.open) {
    console.log(`Opening ${result.outPath} in browser...`);
    openInBrowser(result.outPath);
  }
}

if (path.basename(process.argv[1] || '') === 'prototype.mjs') {
  main();
}
