'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { fail, findPackageRoot, log } = require('../utils');

module.exports = async function check(argv) {
  const root = findPackageRoot('typescript', process.cwd());
  if (!root) {
    fail('TypeScript is not installed in this project.\nInstall it with: npm install -D typescript @types/node');
  }
  if (!fs.existsSync('tsconfig.json')) {
    log.warn('No tsconfig.json found. Create one with: sudotype tsconfig');
  }
  const res = spawnSync(process.execPath, [path.join(root, 'bin', 'tsc'), '--noEmit', ...argv], { stdio: 'inherit' });
  if (res.status === 0) log.ok('No type errors found.');
  process.exit(res.status == null ? 1 : res.status);
};
