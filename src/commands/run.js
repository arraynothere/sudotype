'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { fail, findPackageRoot, readJSON } = require('../utils');

function tsxEntry() {
  const root = findPackageRoot('tsx');
  if (!root) fail('tsx is not installed. Reinstall SudoType: npm install -g sudotype');
  const pkg = readJSON(path.join(root, 'package.json'));
  const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin && pkg.bin.tsx;
  return path.join(root, bin || 'dist/cli.mjs');
}

function exec(args) {
  const child = spawn(process.execPath, [tsxEntry(), ...args], { stdio: 'inherit' });
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
  child.on('error', (e) => fail(e.message));
  child.on('exit', (code, sig) => process.exit(code != null ? code : sig ? 1 : 0));
}

function run(args) {
  if (!args[0]) fail('Usage: sudotype run <file.ts> [args...]');
  if (!fs.existsSync(args[0])) fail(`File not found: ${args[0]}`);
  exec(args);
}

function watch(args) {
  if (!args[0]) fail('Usage: sudotype watch <file.ts> [args...]');
  if (!fs.existsSync(args[0])) fail(`File not found: ${args[0]}`);
  exec(['watch', ...args]);
}

module.exports = { run, watch };
