'use strict';
const fs = require('fs');
const path = require('path');
const { SudoTypeError } = require('../errors');

/** Write the recommended tsconfig.json into `cwd`. */
function writeTsconfig(options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const target = path.join(cwd, 'tsconfig.json');
  if (fs.existsSync(target) && !options.force) {
    throw new SudoTypeError('tsconfig.json already exists. Use --force to overwrite.', 'TSCONFIG_EXISTS');
  }
  fs.copyFileSync(path.join(__dirname, '..', '..', 'tsconfig.base.json'), target);
  return { path: target };
}

module.exports = { writeTsconfig };
