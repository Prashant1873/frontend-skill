#!/usr/bin/env node
/**
 * Automated hook installation utility for Frontend Skill.
 * Sets up pre-edit, post-tool-use, and stop hooks across supported AI coding agent environments:
 *  - Claude Code (.claude/settings.local.json)
 *  - Cursor IDE (.cursor/hooks.json)
 *  - OpenAI Codex (.codex/hooks.json)
 *  - GitHub Copilot (.github/hooks/impeccable.json)
 *
 * Usage:
 *   node scripts/install-hooks.mjs          # Install for all detected/supported harnesses
 *   node scripts/install-hooks.mjs --status # Check status of hook manifests
 *   node scripts/install-hooks.mjs --agent <claude|cursor|codex>
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const HOOK_SCRIPT = path.join(SCRIPT_DIR, 'hook.mjs');
const ADMIN_SCRIPT = path.join(SCRIPT_DIR, 'hook-admin.mjs');

function parseArgs(argv) {
  const flags = { statusOnly: false, agent: null, all: true };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--status') flags.statusOnly = true;
    else if (arg === '--agent' && argv[i + 1]) {
      flags.agent = argv[++i].toLowerCase();
      flags.all = false;
    }
  }
  return flags;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function installClaudeHook(root) {
  const settingsPath = path.join(root, '.claude', 'settings.local.json');
  const existing = readJsonSafe(settingsPath) || {};
  const hookCmd = `node "${path.relative(root, HOOK_SCRIPT).replace(/\\/g, '/')}"`;

  existing.hooks = existing.hooks || {};
  existing.hooks.PostToolUse = existing.hooks.PostToolUse || [];

  const alreadyInstalled = existing.hooks.PostToolUse.some((entry) =>
    typeof entry === 'string' ? entry.includes('hook.mjs') : entry.command?.includes('hook.mjs')
  );

  if (!alreadyInstalled) {
    existing.hooks.PostToolUse.push({
      command: hookCmd,
      timeout: 10,
    });
    writeJson(settingsPath, existing);
    return { agent: 'Claude Code', path: settingsPath, status: 'installed' };
  }
  return { agent: 'Claude Code', path: settingsPath, status: 'already-configured' };
}

function installCursorHook(root) {
  const hooksPath = path.join(root, '.cursor', 'hooks.json');
  const existing = readJsonSafe(hooksPath) || {};
  const hookCmd = `node "${path.relative(root, HOOK_SCRIPT).replace(/\\/g, '/')}"`;

  existing.version = 1;
  existing.hooks = existing.hooks || {};
  existing.hooks.preToolUse = existing.hooks.preToolUse || [];

  const alreadyInstalled = existing.hooks.preToolUse.some((entry) =>
    typeof entry === 'string' ? entry.includes('hook.mjs') : entry.command?.includes('hook.mjs')
  );

  if (!alreadyInstalled) {
    existing.hooks.preToolUse.push({
      command: hookCmd,
      timeout: 10,
    });
    writeJson(hooksPath, existing);
    return { agent: 'Cursor', path: hooksPath, status: 'installed' };
  }
  return { agent: 'Cursor', path: hooksPath, status: 'already-configured' };
}

function installCodexHook(root) {
  const hooksPath = path.join(root, '.codex', 'hooks.json');
  const existing = readJsonSafe(hooksPath) || {};
  const hookCmd = `node "${path.relative(root, HOOK_SCRIPT).replace(/\\/g, '/')}"`;

  existing.version = 1;
  existing.hooks = existing.hooks || {};
  existing.hooks.postToolUse = existing.hooks.postToolUse || [];

  const alreadyInstalled = existing.hooks.postToolUse.some((entry) =>
    typeof entry === 'string' ? entry.includes('hook.mjs') : entry.command?.includes('hook.mjs')
  );

  if (!alreadyInstalled) {
    existing.hooks.postToolUse.push({
      command: hookCmd,
      timeout: 10,
    });
    writeJson(hooksPath, existing);
    return { agent: 'OpenAI Codex', path: hooksPath, status: 'installed' };
  }
  return { agent: 'OpenAI Codex', path: hooksPath, status: 'already-configured' };
}

function main() {
  const flags = parseArgs(process.argv);

  console.log('Frontend Skill: Agent Hook Installer');
  console.log('====================================');

  // 1. Ensure core hook config is enabled
  try {
    execFileSync(process.execPath, [ADMIN_SCRIPT, 'on'], {
      cwd: REPO_ROOT,
      stdio: 'ignore',
    });
    console.log('✓ Core design hook enabled in .impeccable/config.json');
  } catch (err) {
    console.error('✗ Failed to enable hook-admin:', err.message);
  }

  if (flags.statusOnly) {
    try {
      const statusOut = execFileSync(process.execPath, [ADMIN_SCRIPT, 'status'], {
        cwd: REPO_ROOT,
        encoding: 'utf-8',
      });
      console.log('\n' + statusOut.trim());
    } catch {}
    return;
  }

  // 2. Install manifests
  const results = [];
  if (flags.all || flags.agent === 'claude') {
    results.push(installClaudeHook(REPO_ROOT));
  }
  if (flags.all || flags.agent === 'cursor') {
    results.push(installCursorHook(REPO_ROOT));
  }
  if (flags.all || flags.agent === 'codex') {
    results.push(installCodexHook(REPO_ROOT));
  }

  console.log('\nConfigured Agent Hooks:');
  for (const res of results) {
    const symbol = res.status === 'installed' ? '✓ Installed' : '• Configured';
    console.log(`  ${symbol}: ${res.agent.padEnd(15)} -> ${path.relative(REPO_ROOT, res.path)}`);
  }

  console.log('\n✓ Hook installation complete. Edits will trigger anti-slop verification.');
}

main();
