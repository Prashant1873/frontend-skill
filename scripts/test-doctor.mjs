#!/usr/bin/env node
/**
 * Test harness for scripts/doctor.mjs and staleness/schema validation.
 * Verifies CLI output contracts, deterministic exit codes, and corrupted/legacy artifact detection.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { checkConfig, checkDesignSidecar } from './lib/staleness.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DOCTOR_CLI = path.join(SCRIPT_DIR, 'doctor.mjs');

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passedCount++;
  } else {
    console.error(`  ✗ ${message}`);
    failedCount++;
  }
}

function runDoctorCli(args = [], cwd = REPO_ROOT) {
  try {
    const stdout = execFileSync(process.execPath, [DOCTOR_CLI, ...args], {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { exitCode: 0, stdout, stderr: '' };
  } catch (err) {
    return {
      exitCode: err.status ?? 1,
      stdout: err.stdout?.toString?.() || '',
      stderr: err.stderr?.toString?.() || '',
    };
  }
}

function testCleanRepoCli() {
  console.log('\n[Suite 1: Doctor CLI Baseline]');

  const resText = runDoctorCli([]);
  assert(resText.exitCode === 0, 'CLI exits 0 on clean repository');
  assert(resText.stdout.includes('Impeccable doctor'), 'CLI outputs human-readable report header');

  const resHelp = runDoctorCli(['--help']);
  assert(resHelp.exitCode === 0, 'CLI --help exits 0');
  assert(resHelp.stdout.includes('--strict'), 'CLI --help documents --strict flag');

  const resJson = runDoctorCli(['--json']);
  assert(resJson.exitCode === 0, 'CLI --json exits 0 on clean repository');

  let parsed = null;
  try {
    parsed = JSON.parse(resJson.stdout);
  } catch (e) {
    // ignore
  }
  assert(parsed !== null, 'CLI --json outputs valid parseable JSON');
  assert(Array.isArray(parsed?.findings), 'JSON output contains findings array');
  assert(Array.isArray(parsed?.workspaces), 'JSON output contains workspaces array');
  assert(typeof parsed?.projectRoot === 'string', 'JSON output contains projectRoot');
}

function testConfigSchemaAndCorruption() {
  console.log('\n[Suite 2: Config Schema & Corruption Validation]');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-test-config-'));
  const impeccableDir = path.join(tempDir, '.impeccable');
  fs.mkdirSync(impeccableDir, { recursive: true });

  try {
    // 1. Corrupted JSON syntax
    const configPath = path.join(impeccableDir, 'config.json');
    fs.writeFileSync(configPath, '{ "broken": json', 'utf-8');

    const corruptedFindings = checkConfig({ projectRoot: tempDir, repoRoot: tempDir });
    const hasCorrupted = corruptedFindings.some((f) => f.id === 'config-corrupted-json');
    assert(hasCorrupted, 'checkConfig flags syntax-corrupted config.json as config-corrupted-json');
    assert(
      corruptedFindings.find((f) => f.id === 'config-corrupted-json')?.severity === 'route',
      'Corrupted config finding has high severity (route)'
    );

    // 2. Non-object JSON root (e.g. array)
    fs.writeFileSync(configPath, '[1, 2, 3]', 'utf-8');
    const arrayFindings = checkConfig({ projectRoot: tempDir, repoRoot: tempDir });
    assert(
      arrayFindings.some((f) => f.id === 'config-corrupted-json'),
      'checkConfig flags non-object config as config-corrupted-json'
    );

    // 3. Unknown keys and invalid buildPath
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        unknownProperty: 'test',
        buildPath: 'invalid-choice',
      }),
      'utf-8'
    );
    const invalidFindings = checkConfig({ projectRoot: tempDir, repoRoot: tempDir });
    assert(
      invalidFindings.some((f) => f.id === 'config-unknown-keys'),
      'checkConfig flags unknown top-level config keys'
    );
    assert(
      invalidFindings.some((f) => f.id === 'config-invalid-build-path'),
      'checkConfig flags invalid buildPath values'
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function testSidecarSchemaAndCorruption() {
  console.log('\n[Suite 3: Design Sidecar Schema Validation]');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-test-sidecar-'));
  const impeccableDir = path.join(tempDir, '.impeccable');
  fs.mkdirSync(impeccableDir, { recursive: true });

  try {
    const sidecarPath = path.join(impeccableDir, 'design.json');
    const candidates = [sidecarPath];

    // 1. Corrupted JSON syntax
    fs.writeFileSync(sidecarPath, '{ invalid sidecar', 'utf-8');
    const corruptedFindings = checkDesignSidecar({
      designPath: null,
      sidecarCandidates: candidates,
      projectRoot: tempDir,
    });
    assert(
      corruptedFindings.some((f) => f.id === 'design-sidecar-corrupted-json'),
      'checkDesignSidecar flags syntax-corrupted design.json'
    );

    // 2. Legacy schemaVersion (version 1)
    fs.writeFileSync(sidecarPath, JSON.stringify({ schemaVersion: 1 }), 'utf-8');
    const legacyFindings = checkDesignSidecar({
      designPath: null,
      sidecarCandidates: candidates,
      projectRoot: tempDir,
    });
    assert(
      legacyFindings.some((f) => f.id === 'design-sidecar-schema-outdated'),
      'checkDesignSidecar flags outdated schemaVersion (< 2)'
    );

    // 3. Valid current schemaVersion (version 2)
    fs.writeFileSync(sidecarPath, JSON.stringify({ schemaVersion: 2 }), 'utf-8');
    const validFindings = checkDesignSidecar({
      designPath: null,
      sidecarCandidates: candidates,
      projectRoot: tempDir,
    });
    assert(
      !validFindings.some((f) => f.id.includes('schema') || f.id.includes('corrupted')),
      'checkDesignSidecar cleanly accepts valid version 2 sidecar'
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function testDeterministicCliExitCodes() {
  console.log('\n[Suite 4: Deterministic Exit Code Validation]');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-test-exit-'));
  const impeccableDir = path.join(tempDir, '.impeccable');
  fs.mkdirSync(impeccableDir, { recursive: true });

  try {
    // 1. Corrupted config triggers non-zero exit code even in normal run
    fs.writeFileSync(path.join(impeccableDir, 'config.json'), '{ broken json', 'utf-8');
    const resCorrupt = runDoctorCli([], tempDir);
    assert(
      resCorrupt.exitCode === 1,
      'doctor CLI exits non-zero (1) on corrupted artifact definitions'
    );

    // 2. Corrupted config under --json also triggers non-zero exit code
    const resCorruptJson = runDoctorCli(['--json'], tempDir);
    assert(
      resCorruptJson.exitCode === 1,
      'doctor CLI --json exits non-zero (1) on corrupted artifact definitions'
    );

    // 3. Valid config with non-critical finding (e.g. unknown key)
    fs.writeFileSync(
      path.join(impeccableDir, 'config.json'),
      JSON.stringify({ unreadCustomField: 123 }),
      'utf-8'
    );

    // Normal run exits 0 (findings are reported, not treated as fatal)
    const resNormal = runDoctorCli([], tempDir);
    assert(
      resNormal.exitCode === 0,
      'doctor CLI standard run exits 0 on advisory findings'
    );

    // Strict run exits 1 (strict enforcement)
    const resStrict = runDoctorCli(['--strict'], tempDir);
    assert(
      resStrict.exitCode === 1,
      'doctor CLI --strict exits non-zero (1) when unresolved findings exist'
    );

    // Clean run under --strict exits 0
    fs.writeFileSync(
      path.join(impeccableDir, 'config.json'),
      JSON.stringify({ stalenessCheck: true }),
      'utf-8'
    );
    const resCleanStrict = runDoctorCli(['--strict'], tempDir);
    assert(
      resCleanStrict.exitCode === 0,
      'doctor CLI --strict exits 0 when all checks pass'
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function main() {
  console.log('=== Doctor Automation & Staleness Verification Suite ===');
  testCleanRepoCli();
  testConfigSchemaAndCorruption();
  testSidecarSchemaAndCorruption();
  testDeterministicCliExitCodes();

  console.log('\n----------------------------------------------------');
  console.log(`Results: ${passedCount} passed, ${failedCount} failed`);

  if (failedCount > 0) {
    process.exit(1);
  }
  process.exit(0);
}

main();
