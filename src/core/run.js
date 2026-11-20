'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { findPackageRoot, readJSON } = require('../utils');
const { SudoTypeError } = require('../errors');

function tsxEntry() {
  const root = findPackageRoot('tsx');
  if (!root) throw new SudoTypeError('tsx is not installed. Reinstall SudoType: npm install -g @arraynothere/sudotype', 'TSX_NOT_FOUND');
  const pkg = readJSON(path.join(root, 'package.json')) || {};
  const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin && pkg.bin.tsx;
  return path.join(root, bin || 'dist/cli.mjs');
}

function exec(args, file, options) {
  if (!file) throw new SudoTypeError('A file path is required.', 'INVALID_ARGUMENT');
  const cwd = path.resolve(options.cwd || process.cwd());
  if (!fs.existsSync(path.resolve(cwd, file))) throw new SudoTypeError(`File not found: ${file}`, 'FILE_NOT_FOUND');

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [tsxEntry(), ...args], {
      cwd,
      env: options.env || process.env,
      stdio: options.stdio || 'inherit',
      signal: options.signal,
    });
    if (options.onSpawn) options.onSpawn(child);
    child.on('error', (cause) => {
      const aborted = cause && cause.name === 'AbortError';
      reject(new SudoTypeError(cause.message, aborted ? 'ABORTED' : 'SPAWN_FAILED', { cause }));
    });
    child.on('exit', (code, sig) => resolve(code != null ? code : sig ? 1 : 0));
  });
}

/** Run a TypeScript file with tsx. Resolves to the process exit code. */
async function run(file, args = [], options = {}) {
  return exec([file, ...args], file, options);
}

/** Run a TypeScript file and restart on changes. Resolves when the process ends. */
async function watch(file, args = [], options = {}) {
  return exec(['watch', file, ...args], file, options);
}

module.exports = { run, watch };
