'use strict';
const path = require('path');
const { spawn } = require('child_process');
const { findPackageRoot } = require('../utils');
const { SudoTypeError } = require('../errors');

/** Type-check a project with its own TypeScript (`tsc --noEmit`). */
async function check(options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const root = findPackageRoot('typescript', cwd);
  if (!root) {
    throw new SudoTypeError(
      'TypeScript is not installed in this project.\nInstall it with: npm install -D typescript @types/node',
      'TYPESCRIPT_NOT_INSTALLED',
    );
  }
  const silent = Boolean(options.silent);
  const args = [path.join(root, 'bin', 'tsc'), '--noEmit', ...(options.args || [])];

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd, stdio: silent ? ['ignore', 'pipe', 'pipe'] : 'inherit' });
    let output = '';
    if (silent) {
      child.stdout.on('data', (d) => (output += d));
      child.stderr.on('data', (d) => (output += d));
    }
    child.on('error', (cause) => reject(new SudoTypeError(cause.message, 'SPAWN_FAILED', { cause })));
    child.on('close', (code) => {
      const exitCode = code == null ? 1 : code;
      resolve({ success: exitCode === 0, exitCode, output });
    });
  });
}

module.exports = { check };
