#!/usr/bin/env node

/**
 * Validate command routing and file references in SKILL.md.
 * Verifies that all commands, playbooks, scripts, and links mentioned in SKILL.md resolve cleanly.
 *
 * Usage:
 *   node scripts/validate-routing.mjs [--json] [--quiet]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SKILL_FILE = path.resolve(ROOT_DIR, 'SKILL.md');

// Mapping of subcommands to primary reference playbooks
const COMMAND_PLAYBOOK_MAP = {
  design: 'reference/new-work.md',
  polish: 'reference/polish.md',
  critique: 'reference/critique.md',
  audit: 'reference/audit.md',
  clarify: 'reference/clarify.md',
  distill: 'reference/distill.md',
  bolder: 'reference/bolder.md',
  quieter: 'reference/quieter.md',
  harden: 'reference/harden.md',
  engineer: 'reference/craft-floor.md',
  apple: 'reference/animate.md',
  ux: 'reference/craft-floor.md',
  'pick-lib': 'PICKER.md',
  prototype: 'PICKER.md',
};

function parseArgs(argv) {
  const flags = { json: false, quiet: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') flags.json = true;
    else if (arg === '--quiet') flags.quiet = true;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/validate-routing.mjs [--json] [--quiet]');
      process.exit(0);
    }
  }
  return flags;
}

function extractMarkdownFileLinks(content) {
  const links = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const rawTarget = match[2].trim();
    if (
      rawTarget.startsWith('http://') ||
      rawTarget.startsWith('https://') ||
      rawTarget.startsWith('#') ||
      rawTarget.startsWith('mailto:')
    ) {
      continue;
    }
    const cleanTarget = rawTarget.split('#')[0].split('?')[0];
    if (cleanTarget.length > 0) {
      links.push({
        raw: rawTarget,
        target: cleanTarget,
        text: match[1],
      });
    }
  }
  return links;
}

function extractCommandMatrix(content) {
  const commands = [];
  // Match `frontend <subcommand> ...` in table or text
  const cmdRegex = /`frontend\s+([a-zA-Z0-9_-]+)(?:\s+[^`]*)?`/g;
  let match;
  while ((match = cmdRegex.exec(content)) !== null) {
    const subcmd = match[1];
    if (!commands.includes(subcmd) && subcmd !== 'full') {
      commands.push(subcmd);
    }
  }
  return commands;
}

function main() {
  const flags = parseArgs(process.argv);

  if (!fs.existsSync(SKILL_FILE)) {
    console.error(`Error: SKILL.md not found at ${SKILL_FILE}`);
    process.exit(1);
  }

  const content = fs.readFileSync(SKILL_FILE, 'utf-8');
  const issues = [];
  const verifiedRoutes = [];

  // 1. Check command matrix mapping
  const commands = extractCommandMatrix(content);
  for (const cmd of commands) {
    const target = COMMAND_PLAYBOOK_MAP[cmd];
    if (!target) {
      issues.push({
        type: 'unmapped_command',
        command: `frontend ${cmd}`,
        message: `Command "frontend ${cmd}" has no mapped reference playbook in router registry.`,
      });
    } else {
      const resolved = path.resolve(ROOT_DIR, target);
      if (!fs.existsSync(resolved)) {
        issues.push({
          type: 'missing_playbook',
          command: `frontend ${cmd}`,
          target,
          message: `Backing file for "frontend ${cmd}" does not exist on disk: ${target}`,
        });
      } else {
        verifiedRoutes.push({ command: `frontend ${cmd}`, target });
      }
    }
  }

  // 2. Check all markdown file links inside SKILL.md
  const fileLinks = extractMarkdownFileLinks(content);
  for (const link of fileLinks) {
    // Protocol outputs like FRONTEND_PLAN.md are generated at runtime, not on disk
    if (link.target === 'FRONTEND_PLAN.md') {
      continue;
    }
    const resolvedPath = path.resolve(ROOT_DIR, link.target);
    if (!fs.existsSync(resolvedPath)) {
      issues.push({
        type: 'broken_link',
        target: link.target,
        message: `Link "${link.raw}" in SKILL.md points to non-existent file: ${link.target}`,
      });
    } else {
      verifiedRoutes.push({ linkText: link.text, target: link.target });
    }
  }

  const valid = issues.length === 0;

  if (flags.json) {
    console.log(
      JSON.stringify(
        {
          valid,
          total_commands: commands.length,
          total_verified: verifiedRoutes.length,
          total_issues: issues.length,
          commands,
          issues,
        },
        null,
        2
      )
    );
  } else {
    if (!flags.quiet) {
      console.log(`\nSKILL.md Command Routing Validation`);
      console.log(`Commands found: ${commands.length}`);
      console.log(`Routes/Links verified: ${verifiedRoutes.length}`);
      console.log(`----------------------------------------`);
      for (const route of verifiedRoutes) {
        if (route.command) {
          console.log(`  ✓ ${route.command.padEnd(25)} -> ${route.target}`);
        }
      }

      if (issues.length > 0) {
        console.log(`\n❌ Routing Issues Detected:`);
        for (const issue of issues) {
          console.log(`   - [${issue.type}] ${issue.message}`);
        }
      }
    }

    if (valid) {
      console.log(`\n✓ All command routes and references in SKILL.md resolved successfully.`);
    } else {
      console.log(`\n✗ Found ${issues.length} routing issue(s).`);
    }
  }

  process.exit(valid ? 0 : 1);
}

main();
