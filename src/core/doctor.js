'use strict';
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { isTermux, findPackageRoot, readJSON } = require('../utils');

const versionOf = (root) => (readJSON(path.join(root, 'package.json')) || {}).version || 'unknown';

/** Inspect the environment and return a structured report (never exits the process). */
async function doctor(options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const termux = isTermux();
  const checks = [];
  const add = (id, status, message, hint) => checks.push(hint ? { id, status, message, hint } : { id, status, message });

  const [major, minor] = process.versions.node.split('.').map(Number);
  const nodeOk = major > 20 || (major === 20 && minor >= 12);
  add('node', nodeOk ? 'ok' : 'error', nodeOk ? `Node.js ${process.version}` : `Node.js ${process.version} is too old (need >= 20.12)`);

  try {
    const esbuild = require('esbuild');
    esbuild.transformSync('const a: number = 1', { loader: 'ts' });
    add('esbuild', 'ok', `esbuild ${esbuild.version} works`);
  } catch (e) {
    add('esbuild', 'error', `esbuild failed: ${String(e.message).split('\n')[0]}`, termux ? 'Try: pkg upgrade && npm install -g @arraynothere/sudotype --force' : undefined);
  }

  const tsxRoot = findPackageRoot('tsx');
  if (tsxRoot) add('tsx', 'ok', `tsx ${versionOf(tsxRoot)}`);
  else add('tsx', 'error', 'tsx not found');

  const tsRoot = findPackageRoot('typescript', cwd);
  if (tsRoot) add('typescript', 'ok', `typescript ${versionOf(tsRoot)} (project)`);
  else add('typescript', 'warn', 'typescript not installed in this project (only needed for "sudotype check")');

  const gitOk = spawnSync('git', ['--version']).status === 0;
  add('git', gitOk ? 'ok' : 'warn', gitOk ? 'git available' : 'git not found (pkg install git)');

  const problems = checks.filter((c) => c.status === 'error').length;
  return { platform: process.platform, arch: os.arch(), termux, ok: problems === 0, problems, checks };
}

module.exports = { doctor };
